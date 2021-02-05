import React, { useContext } from 'react';
import { NotificationContext } from '../../_core/notificationContext';
import NotificationModal from './NotificationModal';
const NotificationContainer = (props: IProps) => {
   const notificationCtx = useContext(NotificationContext);
   return (
      <div tabIndex={-1} className={`col-12 col-sm-7 col-md-6 col-lg-5 col-xl-4 notification-container pb-3`}>
         {notificationCtx.notifications().map(notification => {
            return (<NotificationModal notification={notification} />);
         })
         }
      </div>
   );
};

interface IProps {
   className?: string;
}
export default NotificationContainer;
