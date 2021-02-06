import { extractUri, localStorageManagement } from "../appFunc";
import React, { createContext, useReducer, useEffect, useContext } from "react";
import { AuthenticationContext } from "./authenticationContext";

export enum NotificationShow {
   default = 0,
   always = 1,
   login = 2
}

export class Notification {
   id?: number = 0;
   children: any;
   show: NotificationShow;
   timeOut: number;
   location: string | null;
   constructor(children: any, show: NotificationShow = NotificationShow.default, timeOut: number = 0, location: string | null = null) {
      this.children = children;
      this.show = show;
      this.timeOut = timeOut;
      this.location = location;
   }
}

class NotificationState {
   List: Notification[] = [];
   LastId: number = 0;
}

const localStorageName = "NotificationState";
export const initState = new NotificationState();

interface INotificationContext {
   add: (notification: Notification) => void,
   remove: (id: number) => void,
   notifications: () => Notification[],
}

const initNotificationContext: INotificationContext = {
   add: (notification: Notification) => { },
   remove: (id: number) => { },
   notifications: () => [],
};

const reducerNotification = (state: NotificationState, newState: NotificationState) => {
   if (newState === null && navigator.cookieEnabled) {
      localStorageManagement.REMOVE(localStorageName);
      return initState;
   }
   return { ...state, ...newState };
};

const localNotificationState = (): NotificationState => {
   const localValue = localStorageManagement.GET(localStorageName);
   if (localValue == "") {
      return initState;
   } else {
      return JSON.parse(localValue);
   }
};

export const NotificationContext = createContext(initNotificationContext);


const NotificationContextContainerProvider = ({ children }: Props): JSX.Element => {
   const auth = useContext(AuthenticationContext);
   const [state, setState] = useReducer(reducerNotification, localNotificationState());



   const add = (notification: Notification) => {
      var _State = state;
      notification.id = _State.LastId;
      _State.LastId += 1;
      _State.List.push(notification);
      setState(_State);
   };



   const remove = (id: number) => {
      var _State = state;
      var tempList: Notification[] = [];
      _State.List.map(notification => {
         if (notification.id != id)
            tempList.push(notification);
      });
      _State.List = tempList;
      if (_State.List.length == 0)
         _State.LastId = 0;
      setState(_State);
   };

   const notifications = () => {
      var _State = state;
      var tempList: Notification[] = [];
      _State.List.map(notification => {
         if (checkNotification(notification))
            tempList.push(notification);
      });
      _State.List = tempList;
      if (_State.List.length == 0)
         _State.LastId = 0;
      if (_State.List.length != tempList.length)
         setState(_State);
      return _State.List;

   };

   const checkNotification = (notifications: Notification) => {
      if (!auth.isAuthenticated && notifications.show == NotificationShow.login)
         return false;

      if (notifications.location !== null && notifications.location !== extractUri()[0])
         return false;

      return true;

   };

   useEffect(() => {
      localStorageManagement.SET(localStorageName, JSON.stringify(state));
   }, [state]);

   return (
      <NotificationContext.Provider value={{ add, remove, notifications }}>
         {children}
      </NotificationContext.Provider>
   );
};
export default NotificationContextContainerProvider;


type Props = {
   children: React.ReactNode;
};
