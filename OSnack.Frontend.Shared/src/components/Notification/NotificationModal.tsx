import React, { useContext, useEffect, useRef } from 'react';
import { sleep } from '../../_core/appFunc';
import { NotificationContext } from '../../_core/Contexts/notificationContext';
const NotificationModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const notificationCtx = useContext(NotificationContext);

   useEffect(() => {
      if (props.notification.timeOut! > 0)
         sleep(props.notification.timeOut, isUnmounted)
            .then(() => {
               notificationCtx.remove(props.notification.id!);
            });
      return () => { isUnmounted.current = true; };
   }, []);

   return (
      <>
         {props.notification.minimize &&
            <div key={props.notification.id} className={`row col-2 notification mb-3 pm-0 ml-auto justify-content-center`}>
               <div className={`${props.notification.type != NotificationType.fix ? "col-6 pl-2 text-left" : "col-12 pr-2 text-right"} p-0   pt-1`}
                  children={<a className="close-button mb-auto maximize-icon " onClick={() => { notificationCtx.changeMinimize(props.notification.id!, false); }} />}
               />
               {props.notification.type != NotificationType.fix &&
                  <div className="col-6 p-0 pr-2 text-right pt-1"
                     children={<a className="close-button mb-auto" onClick={() => { notificationCtx.remove(props.notification.id!); }} children="✘" />}
                  />
               }
            </div>
         }
         {!props.notification.minimize &&
            <div key={props.notification.id} className={`row col-12 notification mb-3 pm-0 `}>
               <div className={`${props.notification.type != NotificationType.fix ? "col-10" : "col-11"} p-4`}
                  children={props.notification.children}
               />
               <div className={`col-1 p-0 pr-2 text-right pt-1`}
                  children={<a className="close-button mb-auto minus-icon " onClick={() => { notificationCtx.changeMinimize(props.notification.id!, true); }} />}
               />
               {props.notification.type != NotificationType.fix &&
                  <div className="col-1 p-0 pr-2 text-right pt-1"
                     children={<a className="close-button mb-auto" onClick={() => { notificationCtx.remove(props.notification.id!); }} children="✘" />}
                  />
               }
            </div>
         }
      </>
   );
};

interface IProps {
   notification: Notification;
   className?: string;
}
export default NotificationModal;



export enum NotificationType {
   default,
   fix,
   authorised
}

export class Notification {
   id?: number = 0;
   children: any;
   type: NotificationType;
   timeOut: number;
   location: string | null;
   minimize: boolean;
   constructor(children: any, show: NotificationType = NotificationType.default, timeOut: number = 0, location: string | null = null, id: number = 0) {
      this.id = id;
      this.children = children;
      this.type = show;
      this.timeOut = timeOut;
      this.location = location;
      this.minimize = false;
   }
}
