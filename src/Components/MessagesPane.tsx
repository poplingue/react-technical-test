import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
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

    //TODO add Issue user in issue.user
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
              // Filter actor active/inactive
              const currentUser = users.filter((user) => event.actor && user.id === event.actor.id)[0];
              const activeActor = event.actor.id && currentUser?.active;

              eventElement = activeActor && isValidEventType(event.event) && (
                <ChatBubble
                  key={event.id}
                  variant={event?.actor.login === issue!.user.login ? "solid" : "outlined"}
                  body={event.body ? event.body : event.source?.issue.body}
                  created_at={event.created_at}
                  actor={event.actor}
                  event={event.event}
                  label={event.label}
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
