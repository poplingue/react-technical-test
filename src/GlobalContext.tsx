import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalContextState {
  issue: Issue;
}

interface GlobalContextValue {
  state: GlobalContextState;
  setIssue: (issue: Issue) => void;
}

const initialState: GlobalContextState = {
  issue: {
    id: 0,
    created_at: "",
    user: {
      login: "",
      avatar_url: "",
    },
    number: "",
    isFetched: true,
    title: "",
    body: "",
    comments_url: "",
  },
};

const defaultContextValue: GlobalContextValue = {
  state: initialState,
  setIssue: () => {},
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

  const value = {
    state,
    setIssue,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = (): GlobalContextValue => {
  return useContext(GlobalContext);
};
