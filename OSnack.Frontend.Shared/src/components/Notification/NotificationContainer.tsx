import React, { useContext, useEffect } from 'react';
import { NotificationContext } from '../../_core/Contexts/notificationContext';
import NotificationModal from './NotificationModal';
const NotificationContainer = (props: IProps) => {
   const notificationContext = useContext(NotificationContext);

   useEffect(() => {
      if (window.location.host.endsWith("osnack.p8b.uk") && notificationContext.findById(1) == undefined)
         notificationContext.addFix("Demo Site.", 0, null, 1);
      else
         notificationContext.remove(1);


   }, []);

   if (notificationContext.isEmpty)
      return (<></>);
   return (
      <div tabIndex={-1} className={`col-12 col-sm-7 col-md-6 col-lg-5 col-xl-4 notification-container pb-3`}>
         {notificationContext.list.map(notification =>
            <NotificationModal notification={notification} />
         )}
      </div>
   );
};

interface IProps {
   className?: string;
}
export default NotificationContainer;
;
