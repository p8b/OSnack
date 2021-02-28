import React, { lazy, Suspense } from "react";
import AuthenticationContextProvider from "osnack-frontend-shared/src/_core/Contexts/authenticationContext";
import CustomRouteContextProvider from "osnack-frontend-shared/src/_core/Contexts/customRouteContext";
import NotificationContextProvider from "osnack-frontend-shared/src/_core/Contexts/notificationContext";
import { Loading } from "osnack-frontend-shared/src/components/Loading/Loading";
const App = lazy(() => import("../../app"));

const ContextContainer = () =>
   <CustomRouteContextProvider>
      <AuthenticationContextProvider>
         <NotificationContextProvider>
            <Suspense fallback={<Loading />}>
               <App />
            </Suspense>
         </NotificationContextProvider>
      </AuthenticationContextProvider>
   </CustomRouteContextProvider>;
export default ContextContainer;