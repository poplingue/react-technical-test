/// <reference types="vite/client" />
declare global {
  type User = {
    login: string;
    avatar_url: string;
    id: string;
    active: boolean;
  };

  type EventIssue = {
    id: string;
    created_at: string;
    actor: User;
    body: string;
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
  };
}

export {};
