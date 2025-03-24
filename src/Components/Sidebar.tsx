import { Input, FormControl, FormLabel, Sheet, CircularProgress } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import useFetch from "../Hooks/useFetch";
import useDebounce from "../Hooks/useDebounce";
import { useGlobalContext } from "../Context/GlobalContext";
import UsersList from "./UsersList";

export const DEFAULT_ISSUE = "7901"
export default function Sidebar() {
  const {
    setIssue,
    state: { users = [] },
  } = useGlobalContext();

  const [currentId, setCurrentId] = useState<string>(DEFAULT_ISSUE);
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
    if (ev.target.value !== currentId) {
      setCurrentId(ev.target.value);
    }
  };

  const fetchData = useCallback(async () => {
    if (isSuccess && data) {
      setIsLoading(true);
      const {
        id,
        created_at,
        user: { id: userId, login, avatar_url },
        number,
        isFetched,
        title,
        body,
        source,
        comments_url,
      } = data;

      setIssue({
        id,
        source,
        created_at,
        user: {
          id: userId,
          login,
          avatar_url,
          active: true,
        },
        number,
        isFetched,
        title,
        body: body || title,
        comments_url,
      });
    }
    setIsLoading(false);
  }, [data, isSuccess, setIssue]);

  // Init issue
  useEffect(() => {
    if (init && data) {
      setIssue(data);
      setInit(false);
    }
  }, [init, data, setIssue, users]);

  // Issue updated on input changed with debounce
  useEffect(() => {
    if (debouncedIssueId) {
      fetchData();
    }
  }, [debouncedIssueId]);

  return (
    <Sheet
      data-testid="Sidebar"
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
      <FormControl>
        <FormLabel>Facebook React Github Issue</FormLabel>
        <Input
          value={currentId}
          onChange={updateIssue}
          placeholder={DEFAULT_ISSUE}
          endDecorator={isLoading && <CircularProgress size="sm" color="neutral" />}
        />
      </FormControl>
      <UsersList />
    </Sheet>
  );
}
