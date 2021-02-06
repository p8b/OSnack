import React, { useContext } from 'react';
import { NotificationContext } from '../../_core/Contexts/notificationContext';
import NotificationModal from './NotificationModal';
const NotificationContainer = (props: IProps) => {
   const notificationCtx = useContext(NotificationContext);
   return (
      <div tabIndex={-1} className={`col-12 col-sm-7 col-md-6 col-lg-5 col-xl-4 notification-container`}>
         {notificationCtx.notifications().map(notification =>
            <div className=" pb-3">
               <NotificationModal notification={notification} />
            </div>)
         }
      </div>
   );
};

interface IProps {
   className?: string;
}
export default NotificationContainer;
;