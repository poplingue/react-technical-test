import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import ChatBubble from "./ChatBubble";
import useFetch from "./useFetch";

import { useGlobalContext } from "./GlobalContext";

export default function MessagesPane() {
  const {
    state: { issue },
  } = useGlobalContext();
  const { data = [] } = useFetch<CommentIssue[]>(
    {
      url: issue?.comments_url,
      headers: {
        Authorization: `Bearer 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`,
        Accept: "application/vnd.github.v3+json",
      },
    },
    { enabled: issue?.isFetched, retry: false },
  );

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
      {issue.comments_url && (
        <Stack spacing={2} justifyContent="flex-end" px={2} py={3}>
          <ChatBubble variant="solid" {...issue!} />
          {data.map((comment) => (
            <ChatBubble
              key={comment.id}
              variant={comment.user.login === issue!.user.login ? "solid" : "outlined"}
              {...comment}
            />
          ))}
        </Stack>
      )}
    </Sheet>
  );
}
