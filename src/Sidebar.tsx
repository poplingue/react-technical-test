import Input from "@mui/joy/Input";
import CircularProgress from "@mui/joy/CircularProgress";
import Sheet from "@mui/joy/Sheet";
import { useCallback, useEffect, useState } from "react";
import useFetch from "./useFetch";
import useDebounce from "./useDebounce";

import { useGlobalContext } from "./GlobalContext";
export default function Sidebar() {
  const { setIssue } = useGlobalContext();

  const [currentId, setCurrentId] = useState<string>("7901");
  const [init, setInit] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debouncedIssueId = useDebounce(currentId, 1000);

  const { data, isSuccess } = useFetch<Issue>(
    {
      url: `https://api.github.com/repos/facebook/react/issues/${currentId}`,
      headers: {
        Authorization: `Bearer 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`,
        Accept: "application/vnd.github.v3+json",
      },
    },
    { retry: false },
  );
  const updateIssue = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentId(ev.target.value);
    setIsLoading(true);
  };

  const fetchData = useCallback(async () => {
    if (isSuccess && data) {
      const { id, created_at, user, number, isFetched, title, body, comments_url } = data;

      setIssue({
        id,
        created_at,
        user: {
          login: user.login,
          avatar_url: user.avatar_url,
        },
        number,
        isFetched,
        title,
        body,
        comments_url,
      });
    }
    setIsLoading(false);
  }, [data, setIssue]);

  // Init issue
  useEffect(() => {
    if (init && data) {
      setIssue(data);
      setInit(false);
    }
  }, [init, data, setIssue]);

  // Issue updated on input changed with debounce
  useEffect(() => {
    if (debouncedIssueId) {
      fetchData();
    }
  }, [debouncedIssueId]);

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: "sticky",
        transition: "transform 0.4s, width 0.4s",
        height: "100dvh",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Input
        value={currentId}
        onChange={updateIssue}
        placeholder="7901"
        endDecorator={isLoading && <CircularProgress size="sm" color="neutral" />}
      />
    </Sheet>
  );
}
