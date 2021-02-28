import React, { lazy, Suspense, useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import CustomRoute from "osnack-frontend-shared/src/_core/customRoute";
import { Loading } from "osnack-frontend-shared/src/components/Loading/Loading";

// Main Components such as pages, navbar, footer
import NavMenu from "./components/NavMenu/NavMenu";
import { AuthenticationContext } from "osnack-frontend-shared/src/_core/Contexts/authenticationContext";
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
const CookieBanner = lazy(() => import("osnack-frontend-shared/src/components/CookieBanner/CookieBanner"));
const NotificationContainer = lazy(() => import("osnack-frontend-shared/src/components/Notification/NotificationContainer"));
const SideNotifier = lazy(() => import("osnack-frontend-shared/src/components/Texts/SideNotifier"));


const App = () => {
   const auth = useContext(AuthenticationContext);
   const [isOpenMainContainer, setIsOpenMainContainer] = useState(false);
   const isOpenRef = useRef(false);
   const breakSize = 768;
   useEffect(() => {
      sizeChange();
      if (window.innerWidth <= breakSize)
         setIsOpenMainContainer(false);
      else
         setIsOpenMainContainer(true);
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
      if (mainContainer?.onclick == null && window.innerWidth <= breakSize) {
         mainContainer!.onclick = (e: Event) => {
            if (isOpenRef.current)
               e.stopImmediatePropagation();
            setIsOpenMainContainer(false);
         };
      }
      else if (mainContainer?.onclick != null && window.innerWidth > breakSize) {
         if (auth.isAuthenticated)
            setIsOpenMainContainer(true);
         mainContainer!.onclick = null;
      }

      if (mainContainer?.onclick != null && isOpenRef.current && window.innerWidth <= breakSize) {
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
         <SideNotifier />
         <NavMenu mainContainerToggler={(isOpen) => setIsOpenMainContainer(isOpen)} isOpenMainContainer={isOpenMainContainer} />
         <div id="main-container" className={`${auth.isAuthenticated ? "sidenav-main-container" : "vh-100 pm-0"} ${isOpenMainContainer ? "show" : ""}`}>
            <Suspense fallback={<Loading />}>
               <Switch>
                  {/***** Public Routes ****/}
                  <CustomRoute path="/Login" render={(props: any) => <LoginPage {...props} mainContainerToggler={(isOpen) => setIsOpenMainContainer(isOpen)} />} />
                  <CustomRoute path="/EmailConfirmation" render={(props: any) => <ConfirmEmail {...props} />} />
                  <CustomRoute path="/ResetPassword" render={(props: any) => <PasswordReset {...props} />} />
                  <CustomRoute path="/NewEmployee/SetupPassword" render={(props: any) => <PasswordReset {...props} />} />

                  {/***** Protected Routes  ****/}
                  <CustomRoute authRequired exact path="/" render={(props: any) => <Dashboard {...props} />} />
                  <CustomRoute authRequired exact path="/MyAccount" render={(props: any) => <MyAccount {...props} />} />
                  <CustomRoute authRequired path="/Categories" render={(props: any) => <CategoryManagement {...props} />} />
                  <CustomRoute authRequired path="/Coupons" render={(props: any) => <CouponManagement {...props} />} />
                  <CustomRoute authRequired path="/Products" render={(props: any) => <ProductManagement {...props} />} />
                  <CustomRoute authRequired exact path="/EmailTemplate" render={(props: any) => <EmailTemplateManagement {...props} />} />
                  <CustomRoute authRequired exact path="/EmailTemplate/Edit" render={(props: any) => <EmailTemplateEdit {...props} />} />
                  <CustomRoute authRequired path="/Users" render={(props: any) => <UserManagement {...props} />} />
                  <CustomRoute authRequired path="/ViewUserOrders" render={(props: any) => <ViewUserOrders {...props} />} />
                  <CustomRoute authRequired path="/Messages" render={(props: any) => <MessagesManagement {...props} />} />
                  <CustomRoute authRequired path="/Orders" render={(props: any) => <OrderManagement {...props} />} />
                  <CustomRoute authRequired path="/DeliveryOptions" render={(props: any) => <DeliveryOptionManagement {...props} />} />
                  <CustomRoute authRequired path="/ViewDispute" render={(props: any) => <ViewCommunication {...props} />} />
                  <CustomRoute authRequired path="/ViewCommunication" render={(props: any) => <ViewCommunication {...props} />} />

                  {/***** Route Not Found  ****/}
                  <CustomRoute authRequired path="*" render={(props: any) => <PageNotFound {...props} />} />
               </Switch>
            </Suspense>
         </div>
         <Suspense fallback={<></>}>
            <NotificationContainer />
            <CookieBanner />
         </Suspense>
      </BrowserRouter>
   );
};
export default App;
