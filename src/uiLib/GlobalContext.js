import * as React from "react";
const GlobalContext = React.createContext();

function GlobalProvider({ state, children }) {
  //   const [state, dispatch] = React.useReducer(countReducer, { count: 0 });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  // const value = {state, dispatch}
  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
}

function useGlobal() {
  const context = React.useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
}

export { GlobalProvider, useGlobal };
