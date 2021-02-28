import React, { lazy, Suspense } from "react";
import AuthenticationContextProvider from "osnack-frontend-shared/src/_core/Contexts/authenticationContext";
import CustomRouteContextProvider from "osnack-frontend-shared/src/_core/Contexts/customRouteContext";
import ShopContextProvider from "./shopContext";
import NotificationContextProvider from "osnack-frontend-shared/src/_core/Contexts/notificationContext";
import { Loading } from "osnack-frontend-shared/src/components/Loading/Loading";
const App = lazy(() => import("../../app"));

const ContextContainer = () =>
   <CustomRouteContextProvider>
      <AuthenticationContextProvider>
         <ShopContextProvider>
            <NotificationContextProvider>
               <Suspense fallback={<Loading />}>
                  <App />
               </Suspense>
            </NotificationContextProvider>
         </ShopContextProvider>
      </AuthenticationContextProvider>
   </CustomRouteContextProvider>;
export default ContextContainer;