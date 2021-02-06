import React from "react";
import AuthenticationContextProvider from "osnack-frontend-shared/src/_core/Contexts/authenticationContext";
import MaintenanceContext from "osnack-frontend-shared/src/_core/Contexts/customRouteContext";
import ShopContextContainer from "./shopContext";
import NotificationContextContainer from "osnack-frontend-shared/src/_core/Contexts/notificationContext";

export const ContextContainer = ({ children }: { children: React.ReactNode; }) =>
   <MaintenanceContext>
      <AuthenticationContextProvider>
         <ShopContextContainer>
            <NotificationContextContainer>
               {children}
            </NotificationContextContainer>
         </ShopContextContainer>
      </AuthenticationContextProvider>
   </MaintenanceContext>;
