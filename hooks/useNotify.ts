import { NotificationContext } from "@/context/notifyContext";
import { TNotify } from "@/types/notification";
import { useContext } from "react";

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }

  const { notify } = context;

  const info = ({ title, desc, position, timeout }: TNotify) => {
    notify({ title, desc, position, mode: "info", timeout });
  };

  const success = ({ title, desc, position, timeout }: TNotify) => {
    notify({ title, desc, position, mode: "success", timeout });
  };

  const error = ({ title, desc, position, timeout }: TNotify) => {
    notify({ title, desc, position, mode: "error", timeout });
  };

  return {
    notify,
    info,
    success,
    error,
  };
};
