import React from "react";

// setting a global context with details about the current connected account
// and details about a Bank contract that allows interaction with backend

const ConnContext = React.createContext({
  account: String,
  contract: Object,
});

export default ConnContext;
