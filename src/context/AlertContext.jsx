import React, { createContext, useState } from "react";

export const AlertContext = createContext();

export const AlertContextProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [doShowMessage, setDoShowMessage] = useState(false);

  const showMessage = (message, type) => {
    setMessage(message);
    if (type) setType(type);
    setDoShowMessage(true);
  };
  return (
    <AlertContext.Provider
      value={{
        message,
        setMessage,
        type,
        setType,
        setDoShowMessage,
        doShowMessage,
        showMessage,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
