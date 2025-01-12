import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

export const triggerNotification = (
  type: NotificationType,
  message: string,
  description: string,
  placement: "topRight" | "bottomRight" | "topLeft" | "bottomLeft" = "topLeft"
) => {
  notification[type]({
    message,
    description,
    placement,
  });
};
