import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalContextState {
  issue: Issue;
  users: User[];
}

interface GlobalContextValue {
  state: GlobalContextState;
  setIssue: (issue: Issue) => void;
  setUsers: (users: User[]) => void;
  toggleActiveUser: (id: string) => void;
}

const initialState: GlobalContextState = {
  issue: {
    id: 0,
    created_at: "",
    user: {
      id: "",
      login: "",
      avatar_url: "",
      active: true,
    },
    number: "",
    isFetched: true,
    title: "",
    body: "",
    comments_url: "",
  },
  users: [],
};

const defaultContextValue: GlobalContextValue = {
  state: initialState,
  setIssue: () => {},
  setUsers: () => {},
  toggleActiveUser: () => {},
};

export const GlobalContext = createContext<GlobalContextValue>(defaultContextValue);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [state, setState] = useState<GlobalContextState>(initialState);

  const setIssue = (issue: Issue) => {
    setState((prevState) => ({ ...prevState, issue }));
  };

  const setUsers = (users: User[]) => {
    setState((prevState) => ({ ...prevState, users }));
  };

  const toggleActiveUser = (userId: string) => {
    const newUsers = state.users.map((user) => {
      return user.id === userId ? { ...user, active: !user.active } : user;
    });
    setUsers(newUsers);
  };

  const value = {
    state,
    setIssue,
    setUsers,
    toggleActiveUser,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = (): GlobalContextValue => {
  return useContext(GlobalContext);
};
