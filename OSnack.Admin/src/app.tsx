import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import CustomRoute from "osnack-frontend-shared/src/_core/customRoute";
import { Loading } from "osnack-frontend-shared/src/components/Loading/Loading";
import AuthenticationContext from "osnack-frontend-shared/src/_core/authenticationContext";

// Main Components such as pages, navbar, footer
import NavMenu from "./components/NavMenu/NavMenu";
import { useSilentSecretAuthentication } from "./SecretHooks/useAuthenticationHook";
import { extractUri } from "osnack-frontend-shared/src/_core/appFunc";
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const MyAccount = lazy(() => import("./pages/MyAccount/MyAccount"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const CategoryManagement = lazy(() => import("./pages/CategoryManagement/CategoryManagement"));
const CouponManagement = lazy(() => import("./pages/CouponManagement/CouponManagement"));
const ProductManagement = lazy(() => import("./pages/ProductManagement/ProductManagement"));
const UserManagement = lazy(() => import("./pages/UserManagement/UserManagement"));
const OrderManagement = lazy(() => import("./pages/OrderManagement/OrderManagement"));
const PageNotFound = lazy(() => import("osnack-frontend-shared/src/pages/PageNotFound"));
const ConfirmEmail = lazy(() => import("osnack-frontend-shared/src/pages/ConfirmEmail"));
const PasswordReset = lazy(() => import("osnack-frontend-shared/src/pages/PasswordReset"));
const EmailTemplateManagement = lazy(() => import("./pages/EmailTemplates/EmailTemplateManagement"));
const EmailTemplateEdit = lazy(() => import("./pages/EmailTemplates/EmailTemplateEdit"));
const ViewUserOrders = lazy(() => import("./pages/OrderManagement/ViewUserOrders"));
const MessagesManagement = lazy(() => import("./pages/MessagesManagement/MessagesManagement"));
const DeliveryOptionManagement = lazy(() => import("./pages/DeliveryOptionManagement/DeliveryOptionManagement"));
const ViewCommunication = lazy(() => import("./pages/Communication/ViewCommunication"));

const App = () => {
   const [isOpenMainContainer, setIsOpenMainContainer] = useState(false);
   const isOpenRef = useRef(false);
   const breakSize = 768;
   useEffect(() => {
      sizeChange();
      if (window.innerWidth <= breakSize)
         setIsOpenMainContainer(false);
      window.addEventListener("resize", sizeChange);

      return () => {
         window.removeEventListener("resize", sizeChange);
      };
   }, []);

   useEffect(() => {
      isOpenRef.current = isOpenMainContainer;
      sizeChange();
   }, [isOpenMainContainer]);

   const sizeChange = () => {
      var mainContainer = document.getElementById("main-container");
      console.log(mainContainer!.onclick);
      if (mainContainer?.onclick == null && window.innerWidth <= breakSize) {
         mainContainer!.onclick = (e: Event) => { if (isOpenRef.current) e.stopImmediatePropagation(); setIsOpenMainContainer(false); };
      }
      else if (mainContainer?.onclick != null && window.innerWidth > breakSize) {
         if (extractUri(document.location.pathname)![0].toLowerCase() != "login")
            setIsOpenMainContainer(true);
         mainContainer!.onclick = null;
      }

      if (mainContainer?.onclick != null && isOpenRef.current && window.innerWidth <= breakSize) {
         console.log(1);
         document.body.style.backgroundColor = "rgba(0,0,0,1)";
         mainContainer!.style.opacity = ".3";
      }
      else {
         document.body.style.backgroundColor = "rgba(0,0,0,0)";
         mainContainer!.style.opacity = "1";

      }
   };

   return (
      <BrowserRouter>
         <AuthenticationContext>
            <NavMenu mainContainerToggler={(isOpen) => setIsOpenMainContainer(isOpen)} isOpenMainContainer={isOpenMainContainer} />
            <div id="main-container" className={`sidenav-main-container ${isOpenMainContainer ? "show" : ""}`}>
               <Suspense fallback={<Loading />}>
                  <Switch>
                     {/***** Public Routes ****/}
                     <CustomRoute authenticate={useSilentSecretAuthentication} path="/Login" Render={(props: any) => <LoginPage {...props} mainContainerToggler={(isOpen) => setIsOpenMainContainer(isOpen)} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} path="/EmailConfirmation" Render={(props: any) => <ConfirmEmail {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} path="/ResetPassword" Render={(props: any) => <PasswordReset {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} path="/NewEmployee/SetupPassword" Render={(props: any) => <PasswordReset {...props} />} />

                     {/***** Protected Routes  ****/}
                     <CustomRoute authenticate={useSilentSecretAuthentication} exact AuthRequired path="/" Render={(props: any) => <Dashboard {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} exact AuthRequired path="/MyAccount" Render={(props: any) => <MyAccount {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} AuthRequired path="/Categories" Render={(props: any) => <CategoryManagement {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} AuthRequired path="/Coupons" Render={(props: any) => <CouponManagement {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} AuthRequired path="/Products" Render={(props: any) => <ProductManagement {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} exact AuthRequired path="/EmailTemplate" Render={(props: any) => <EmailTemplateManagement {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} exact AuthRequired path="/EmailTemplate/Edit" Render={(props: any) => <EmailTemplateEdit {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} AuthRequired path="/Users" Render={(props: any) => <UserManagement {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} AuthRequired path="/ViewUserOrders" Render={(props: any) => <ViewUserOrders {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} AuthRequired path="/Messages" Render={(props: any) => <MessagesManagement {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} AuthRequired path="/Orders" Render={(props: any) => <OrderManagement {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} AuthRequired path="/DeliveryOptions" Render={(props: any) => <DeliveryOptionManagement {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} AuthRequired path="/ViewDispute" Render={(props: any) => <ViewCommunication {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} AuthRequired path="/ViewCommunication" Render={(props: any) => <ViewCommunication {...props} />} />
                     {/***** Route Not Found  ****/}
                     <CustomRoute authenticate={useSilentSecretAuthentication} AuthRequired path="*" Render={(props: any) => <PageNotFound {...props} />} />
                  </Switch>
               </Suspense>
            </div>
         </AuthenticationContext>
      </BrowserRouter>
   );
};
export default App;
