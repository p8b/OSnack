import React, { useContext, useEffect } from 'react';
import { Notification, NotificationContext, NotificationShow } from '../../_core/Contexts/notificationContext';
const NotificationModal = (props: IProps) => {
   const notificationCtx = useContext(NotificationContext);

   useEffect(() => {
      if (props.notification.timeOut! > 0)
         setTimeout(() => {
            notificationCtx.remove(props.notification.id!);
         }, props.notification.timeOut! * 1000);
   }, []);

   return (
      <div key={props.notification.id} className={`row col-12 notification my-3 pm-0 `}>
         <div className="col-11 p-4"
            children={props.notification.children}
         />
         {props.notification.show != NotificationShow.always &&
            <div className="col-1 p-0 pr-2 text-right pt-1"
               children={<a className="close-button mb-auto" onClick={() => { notificationCtx.remove(props.notification.id!); }} children="✘" />}
            />
         }
      </div>
   );
};

interface IProps {
   notification: Notification;
   className?: string;
}
export default NotificationModal;
