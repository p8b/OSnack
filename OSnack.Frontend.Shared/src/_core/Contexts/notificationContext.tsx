import { extractUri, localStorageManagement, CopyObject } from "../appFunc";
import React, { createContext, useEffect, useContext, useState } from "react";
import { AuthenticationContext } from "./authenticationContext";
import { Notification, NotificationType } from "../../components/Notification/NotificationModal";



interface INotificationContext {
   list: Notification[],
   isEmpty: boolean,
   findById: (id: number) => Notification | undefined,
   add: (notification: Notification) => void,
   addFix: (children: any, timeOut?: number, location?: string | null, id?: number) => void,
   addDefualt: (children: any, timeOut?: number, location?: string | null, id?: number) => void,
   addAuthorised: (children: any, timeOut?: number, location?: string | null, id?: number) => void,
   remove: (id: number) => void,
   changeMinimize: (id: number, minimize: boolean) => void;
}

export const NotificationContext = createContext({
   list: [],
   isEmpty: true,
   findById: (id: number) => undefined,
   add: (notification: Notification) => { },
   addFix: (children: any, timeOut: number = 0, location: string | null = null, id: number = 0) => { },
   addDefualt: (children: any, timeOut: number = 0, location: string | null = null, id: number = 0) => { },
   addAuthorised: (children: any, timeOut: number = 0, location: string | null = null, id: number = 0) => { },
   remove: (id: number) => { },
   changeMinimize: (id: number, minimize: boolean) => { }
} as INotificationContext);

const NotificationContextContainer = ({ children }: { children: React.ReactNode; }) => {
   const auth = useContext(AuthenticationContext);

   const [notificationList, setNotificationList] = useState<Notification[]>([]);

   const localStorageName = "NotificationState";


   useEffect(() => {
      try {
         var _list = JSON.parse(localStorageManagement.GET(localStorageName)) as Notification[];
         setNotificationList(_list || []);
      } catch {
         setNotificationList([]);
      }
   }, []);

   useEffect(() => {
      localStorageManagement.SET(localStorageName, JSON.stringify(list));
   }, [notificationList]);
   const list = (() => {
      var _list = notificationList.filter(n => visibilityCheck(n));
      if (notificationList.length != _list.length)
         setNotificationList(_list);
      return _list;
   })();

   const isEmpty = (() => notificationList.length === 0)();

   const findById = (id: number) => list.find(n => n.id == id);

   const add = (notification: Notification) => {
      var _list = CopyObject(notificationList);
      if (notification.id == 0)
         notification.id = Math.random();
      _list.push(notification);
      setNotificationList(_list);
   };

   const addFix = (children: any, timeOut: number = 0, location: string | null = null, id: number = 0) =>
      add(new Notification(children, NotificationType.fix, timeOut, location, id));


   const addDefualt = (children: any, timeOut: number = 0, location: string | null = null, id: number = 0) =>
      add(new Notification(children, NotificationType.default, timeOut, location, id));

   const addAuthorised = (children: any, timeOut: number = 0, location: string | null = null, id: number = 0) =>
      add(new Notification(children, NotificationType.authorised, timeOut, location, id));


   const remove = (id: number) => setNotificationList(list.filter(n => n.id != id));
   const changeMinimize = (id: number, minimize: boolean) => {
      var notification = list.find(n => n.id == id);
      notification!.minimize = minimize;
      setNotificationList(list);
   };


   function visibilityCheck(notifications: Notification) {
      if (!auth.isAuthenticated && notifications.type == NotificationType.authorised)
         return false;

      if (notifications.location !== null && notifications.location !== extractUri()[0])
         return false;

      return true;
   };

   const providerValue = {
      list,
      isEmpty,
      findById,
      add,
      addFix,
      addDefualt,
      addAuthorised,
      remove,
      changeMinimize
   };

   return (
      <NotificationContext.Provider value={providerValue}>
         {children}
      </NotificationContext.Provider>
   );
};
export default NotificationContextContainer;
