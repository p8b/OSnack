import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import CustomRoute from "osnack-frontend-shared/src/_core/customRoute";
import { Loading } from "osnack-frontend-shared/src/components/Loading/Loading";
import AuthenticationContext from "osnack-frontend-shared/src/_core/authenticationContext";
import ShopContextContainer from "./_core/shopContext";
import Container from "./components/Container";
import { Access } from "./_core/appConstant.Variables";

// Main Components such as pages, navbar, footer
import NavMenu from "./components/NavMenu/NavMenu";
import Footer from "./components/Footer";
const Home = lazy(() => import("./pages/Home/Home"));
const Shop = lazy(() => import("./pages/Shop/Shop"));
const About = lazy(() => import("./pages/About/About"));
const ContactUs = lazy(() => import("./pages/ContactUs/ContactUs"));
const MyAccount = lazy(() => import("./pages/MyAccount/MyAccount"));
const LoginPage = lazy(() => import("./pages/Login/LoginPage"));
const ProductPage = lazy(() => import("./pages/ProductPage/ProductPage"));
const PageNotFound = lazy(() => import("osnack-frontend-shared/src/pages/PageNotFound"));
const ConfirmEmail = lazy(() => import("osnack-frontend-shared/src/pages/ConfirmEmail"));
const PasswordReset = lazy(() => import("osnack-frontend-shared/src/pages/PasswordReset"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions/TermsAndConditions"));

const App = () => {
   return (
      <BrowserRouter>
         <AuthenticationContext>
            <ShopContextContainer>
               <NavMenu />
               <Container id="mainContainer" className="p-0 wide-container main-container" extendBottom extendTop>
                  <Suspense fallback={<Loading />}>
                     <Switch>
                        {/***** Public Routes ****/}
                        <CustomRoute exact path="/" Render={(props: any) => <Home {...props} />} access={Access} />
                        <CustomRoute path="/Login" Render={(props: any) => <LoginPage {...props} />} access={Access} />
                        <CustomRoute path="/EmailConfirmation" Render={(props: any) => <ConfirmEmail {...props} />} access={Access} />
                        <CustomRoute path="/ResetPassword" Render={(props: any) => <PasswordReset {...props} />} access={Access} />
                        <CustomRoute path="/Shop/Product" Render={(props: any) => <ProductPage {...props} />} access={Access} />
                        <CustomRoute path="/Shop" Render={(props: any) => <Shop {...props} />} access={Access} />
                        <CustomRoute path="/Contact" Render={(props: any) => <About {...props} />} access={Access} />
                        <CustomRoute path="/About" Render={(props: any) => <ContactUs {...props} />} access={Access} />
                        <CustomRoute path="/TermsAndConditions" Render={(props: any) => <TermsAndConditions {...props} />} access={Access} />

                        {/***** Protected Routes  ****/}
                        <CustomRoute exact AuthRequired path="/MyAccount" Render={(props: any) => <MyAccount {...props} />} access={Access} />

                        {/***** Route Not Found  ****/}
                        <CustomRoute path="*" Render={(props: any) => <PageNotFound {...props} />} access={Access} />
                     </Switch>
                  </Suspense>
               </Container>
               <Footer />
            </ShopContextContainer>
         </AuthenticationContext>
      </BrowserRouter>
   );
};
export default App;