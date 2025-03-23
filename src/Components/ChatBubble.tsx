import { Avatar, Chip, Box, Sheet, Stack, Typography } from "@mui/joy";
import FormatParagraph from "./FormatParagraph";

type ChatBubbleProps = {
  body: string;
  variant: "solid" | "outlined";
  label?: LabelType;
  event: "labeled" | "commented";
  created_at: string;
  actor: User;
};

export default function ChatBubble({ body, variant, created_at, actor, event, label }: ChatBubbleProps) {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar size="sm" variant="solid" src={actor.avatar_url} />
      <Box>
        <Stack direction="row" spacing={2} sx={{ mb: 0.25 }}>
          <Typography level="body-xs" fontWeight="bold">
            {actor.login}
          </Typography>
          <Typography level="body-xs">{created_at}</Typography>
        </Stack>
        <Box>
          <Sheet
            color="primary"
            variant={variant}
            invertedColors={variant === "solid"}
            sx={{
              p: 1.25,
              borderRadius: "lg",
              borderTopLeftRadius: 0,
            }}
          >
            {event === "commented" && (
              <Typography level="body-sm" color="primary">
                <FormatParagraph text={body} />
              </Typography>
            )}
            {event === "labeled" && label && (
              <Chip variant="soft" color="primary">
                {label.name}
              </Chip>
            )}
          </Sheet>
        </Box>
      </Box>
    </Stack>
  );
}
