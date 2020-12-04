import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import CustomRoute from "osnack-frontend-shared/src/_core/customRoute";
import { Loading } from "osnack-frontend-shared/src/components/Loading/Loading";
import AuthenticationContext from "osnack-frontend-shared/src/_core/authenticationContext";

// Main Components such as pages, navbar, footer
import NavMenu from "./components/NavMenu/NavMenu";
import { useSilentSecretAuthentication } from "./SecretHooks/useAuthenticationHook";
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const MyAccount = lazy(() => import("./pages/MyAccount/MyAccount"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const CategoryManagement = lazy(() => import("./pages/CategoryManagement/CategoryManagement"));
const ProductManagement = lazy(() => import("./pages/ProductManagement/ProductManagement"));
const UserManagement = lazy(() => import("./pages/UserManagement/UserManagement"));
const PageNotFound = lazy(() => import("osnack-frontend-shared/src/pages/PageNotFound"));
const ConfirmEmail = lazy(() => import("osnack-frontend-shared/src/pages/ConfirmEmail"));
const PasswordReset = lazy(() => import("osnack-frontend-shared/src/pages/PasswordReset"));
const EmailTemplateManagement = lazy(() => import("./pages/EmailTemplates/EmailTemplateManagement"));
const EmailTemplateEdit = lazy(() => import("./pages/EmailTemplates/EmailTemplateEdit"));

const App = () => {
   const [isOpenMainContainer, setIsOpenMainContainer] = useState(true);
   console.log(1);
   return (
      <BrowserRouter>
         <AuthenticationContext>
            <div className={`sidenav-main-container ${isOpenMainContainer ? "show" : ""}`}>
               <NavMenu mainContainerToggler={(isOpen) => setIsOpenMainContainer(isOpen)} />
               <Suspense fallback={<Loading />}>
                  <Switch>
                     {/***** Public Routes ****/}
                     <CustomRoute authenticate={useSilentSecretAuthentication} path="/Login" Render={(props: any) => <LoginPage {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} path="/EmailConfirmation" Render={(props: any) => <ConfirmEmail {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} path="/ResetPassword" Render={(props: any) => <PasswordReset {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} path="/NewEmployee/SetupPassword" Render={(props: any) => <PasswordReset {...props} />} />

                     {/***** Protected Routes  ****/}
                     <CustomRoute authenticate={useSilentSecretAuthentication} exact AuthRequired path="/" Render={(props: any) => <Dashboard {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} exact AuthRequired path="/MyAccount" Render={(props: any) => <MyAccount {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} exact AuthRequired path="/Categories" Render={(props: any) => <CategoryManagement {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} exact AuthRequired path="/Products" Render={(props: any) => <ProductManagement {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} exact AuthRequired path="/EmailTemplate" Render={(props: any) => <EmailTemplateManagement {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} exact AuthRequired path="/EmailTemplate/Edit" Render={(props: any) => <EmailTemplateEdit {...props} />} />
                     <CustomRoute authenticate={useSilentSecretAuthentication} exact AuthRequired path="/Users" Render={(props: any) => <UserManagement {...props} />} />

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
