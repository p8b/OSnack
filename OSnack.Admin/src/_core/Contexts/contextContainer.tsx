import React from "react";
import AuthenticationContextProvider from "osnack-frontend-shared/src/_core/Contexts/authenticationContext";
import CustomRouteContextProvider from "osnack-frontend-shared/src/_core/Contexts/customRouteContext";
import NotificationContextContainer from "osnack-frontend-shared/src/_core/Contexts/notificationContext";

export const ContextContainer = ({ children }: { children: React.ReactNode; }) =>
   <CustomRouteContextProvider>
      <AuthenticationContextProvider>
         <NotificationContextContainer>
            {children}
         </NotificationContextContainer>
      </AuthenticationContextProvider>
   </CustomRouteContextProvider>;
