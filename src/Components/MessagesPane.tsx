import { Chip, Sheet, Stack, Typography } from "@mui/joy";
import ChatBubble from "./ChatBubble";
import useFetch from "../Hooks/useFetch";

import { useGlobalContext } from "../Context/GlobalContext";
import { useCallback, useEffect, useState } from "react";

export default function MessagesPane() {
  const [usersInit, setUsersInit] = useState<boolean>(true);
  const {
    state: { issue, users },
    setUsers,
  } = useGlobalContext();

  const { data = [], isFetched } = useFetch<EventIssue[]>(
    {
      url: `https://api.github.com/repos/facebook/react/issues/${issue?.number}/timeline`,
      headers: {
        Authorization: `Bearer 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`,
        Accept: "application/vnd.github.v3+json",
      },
    },
    { enabled: issue?.isFetched, retry: false },
  );

  const getUsers = useCallback(() => {
    const uniqueActors = new Map<string, User>();

    data.forEach((event: EventIssue) => {
      if (event.actor) {
        uniqueActors.set(event.actor.login, { ...event.actor, active: true });
      }
    });

    //TODO add Issue's user in issue.user
    setUsers(Array.from(uniqueActors.values()));

    setUsersInit(false);
  }, [data, setUsers]);

  function isValidEventType(eventType: string): eventType is EventType {
    return eventType === "labeled" || eventType === "commented";
  }

  useEffect(() => {
    if (data && usersInit) {
      getUsers();
    }
  }, [data, getUsers, usersInit, users]);

  // reset init with new issue
  useEffect(() => {
    if (isFetched) {
      setUsersInit(true);
    }
  }, [data, isFetched]);

  return (
    <Sheet
      data-testid="MessagesPane"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      {!!issue && (
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.body",
          }}
          py={{ xs: 2, md: 2 }}
          px={{ xs: 1, md: 2 }}
        >
          <Typography
            fontWeight="lg"
            fontSize="lg"
            component="h2"
            noWrap
            endDecorator={
              <Chip
                variant="outlined"
                size="sm"
                color="neutral"
                sx={{
                  borderRadius: "sm",
                }}
              >
                #{issue.number}
              </Chip>
            }
          >
            {issue.title}
          </Typography>
          <Typography level="body-sm">{issue.user.login}</Typography>
        </Stack>
      )}
      {issue.number && (
        <Stack spacing={2} justifyContent="flex-end" px={2} py={3}>
          <ChatBubble
            variant="solid"
            actor={issue.user}
            body={issue.body}
            created_at={issue.created_at}
            event="commented"
          />

          {data.map((event: EventIssue) => {
            let eventElement: React.ReactNode | HTMLParagraphElement = null;

            if (event.actor) {
              const { actor, body, source, label, id, event: currentEvent, created_at } = event;

              // Filter actor active/inactive
              const currentUser = users.filter((user) => actor && user.id === actor.id)[0];
              const activeActor = actor.id && currentUser?.active;
              eventElement = activeActor && isValidEventType(currentEvent) && (
                <ChatBubble
                  key={id}
                  variant={actor.login === issue!.user.login ? "solid" : "outlined"}
                  body={body ? body : source?.issue.body}
                  created_at={created_at}
                  actor={actor}
                  event={currentEvent}
                  label={label}
                />
              );
            }

            return eventElement;
          })}
        </Stack>
      )}
    </Sheet>
  );
}
