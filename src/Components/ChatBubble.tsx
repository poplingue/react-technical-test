import { Avatar } from "@mui/joy";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

type ChatBubbleProps = {
  body: string;
  variant: "solid" | "outlined";
  created_at: string;
  actor: User;
};

export default function ChatBubble({ body, variant, created_at, actor }: ChatBubbleProps) {
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
            <Typography level="body-sm" color="primary">
              {body}
            </Typography>
          </Sheet>
        </Box>
      </Box>
    </Stack>
  );
}
