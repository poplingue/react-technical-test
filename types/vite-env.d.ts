/// <reference types="vite/client" />
declare global {
  type User = {
    login: string;
    avatar_url: string;
    id: string;
    active: boolean;
  };

  type Source = {
    issue: Issue;
  };

  type EventType = "labeled" | "commented";

  type LabelType = {
    name: string;
  };

  type EventIssue = {
    id: string;
    created_at: string;
    actor: User;
    body: string;
    source: Source;
    label: LabelType;
    event: EventType;
  };

  type Issue = {
    id: number;
    created_at: string;
    user: User;

    number: string;
    isFetched: boolean;
    title: string;
    body: string;
    comments_url: string;
    source?: Source;
  };
}

export {};
