import { notification } from 'antd';
import type { NotificationArgsProps } from 'antd';

type NotificationPlacement = NotificationArgsProps['placement'];

const useCustomNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    placement: NotificationPlacement,
    message: string,
    description: string,
    options?: { tailwindClass: string },
  ) => {
    api.info({
      message,
      description,
      placement,
      className: options?.tailwindClass || '',
    });
  };

  return { openNotification, contextHolder };
};

export default useCustomNotification;
