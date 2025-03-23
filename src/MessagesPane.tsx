import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import ChatBubble from "./ChatBubble";
import useFetch from "./useFetch";

import { useGlobalContext } from "./GlobalContext";
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
        uniqueActors.set(event.actor.login, event.actor);
      }
    });
    setUsers(Array.from(uniqueActors.values()));
    setUsersInit(false);
  }, [data, setUsers]);

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
          <ChatBubble variant="solid" {...issue!} actor={issue.user} />
          {data.map((event: EventIssue) =>
            event.actor ? (
              <ChatBubble
                key={event.id}
                variant={event?.actor.login === issue!.user.login ? "solid" : "outlined"}
                {...event}
              />
            ) : (
              <p>{event.id}</p>
            ),
          )}
        </Stack>
      )}
    </Sheet>
  );
}
