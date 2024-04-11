import React, { useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AlertContext } from "../context/AlertContext";

export default function Alert() {
  const { setType, message, type, doShowMessage, setDoShowMessage } =
    useContext(AlertContext);

  useEffect(() => {
    if (doShowMessage) {
      toast[type](message, { role: "alert", position: "bottom-center" });
      setDoShowMessage(false);
      setType("success");
    }
  }, [message, setDoShowMessage, doShowMessage, type]);
  return <ToastContainer autoClose={3000} />;
}
