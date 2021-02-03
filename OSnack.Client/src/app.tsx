import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import CustomRoute from "osnack-frontend-shared/src/_core/customRoute";
import { Loading } from "osnack-frontend-shared/src/components/Loading/Loading";
import AuthenticationContext from "osnack-frontend-shared/src/_core/authenticationContext";
import ShopContextContainer from "./_core/shopContext";
import Container from "./components/Container";

// Main Components such as pages, navbar, footer
import NavMenu from "./components/NavMenu/NavMenu";
import Footer from "./components/Footer";
const CookieBanner = lazy(() => import("./components/CookieBanner"));
const Home = lazy(() => import("./pages/Home/Home"));
const OrderSuccess = lazy(() => import("./pages/Basket/OrderSuccess"));
const Shop = lazy(() => import("./pages/Shop/Shop"));
const About = lazy(() => import("./pages/About/About"));
const ContactUs = lazy(() => import("./pages/ContactUs/ContactUs"));
const Basket = lazy(() => import("./pages/Basket/Basket"));
const MyAccount = lazy(() => import("./pages/MyAccount/MyAccount"));
const MyAddresses = lazy(() => import("./pages/MyAddress/MyAddresses"));
const MyOrders = lazy(() => import("./pages/MyOrder/MyOrders"));
const LoginPage = lazy(() => import("./pages/Login/LoginPage"));
const ProductPage = lazy(() => import("./pages/ProductPage/ProductPage"));
const PageNotFound = lazy(() => import("osnack-frontend-shared/src/pages/PageNotFound"));
const ConfirmEmail = lazy(() => import("osnack-frontend-shared/src/pages/ConfirmEmail"));
const PasswordReset = lazy(() => import("osnack-frontend-shared/src/pages/PasswordReset"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy/PrivacyPolicy"));
const Unsubscribe = lazy(() => import("./pages/Newsletter/Unsubscribe"));
const ViewCommunication = lazy(() => import("./pages/Communication/ViewCommunication"));

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
                        <CustomRoute exact path="/" render={(props: any) => <Home {...props} />} />
                        <CustomRoute path="/Login" render={(props: any) => <LoginPage {...props} />} />
                        <CustomRoute path="/EmailConfirmation" render={(props: any) => <ConfirmEmail {...props} />} />
                        <CustomRoute path="/ResetPassword" render={(props: any) => <PasswordReset {...props} />} />
                        <CustomRoute path="/Shop/Product" render={(props: any) => <ProductPage {...props} />} />
                        <CustomRoute path="/Shop" render={(props: any) => <Shop {...props} />} />
                        <CustomRoute path="/Checkout" render={(props: any) => <Basket {...props} />} />
                        <CustomRoute path="/About" render={(props: any) => <About {...props} />} />
                        <CustomRoute path="/Contact" render={(props: any) => <ContactUs {...props} />} />
                        <CustomRoute path="/OrderSuccessful" render={(props: any) => <OrderSuccess {...props} />} />
                        <CustomRoute path="/PrivacyPolicy" render={(props: any) => <PrivacyPolicy {...props} />} />
                        <CustomRoute path="/TermsAndConditions" render={(props: any) => <TermsAndConditions {...props} />} />
                        <CustomRoute path="/Unsubscribe" render={(props: any) => <Unsubscribe {...props} />} />
                        <CustomRoute path="/ViewCommunication" render={(props: any) => <ViewCommunication {...props} />} />

                        {/***** Protected Routes  ****/}
                        <CustomRoute authRequired exact path="/MyAccount" render={(props: any) => <MyAccount {...props} />} />
                        <CustomRoute authRequired path="/MyOrders" render={(props: any) => <MyOrders {...props} />} />
                        <CustomRoute authRequired exact path="/MyAddresses" render={(props: any) => <MyAddresses {...props} />} />
                        <CustomRoute authRequired path="/ViewDispute" render={(props: any) => <ViewCommunication {...props} />} />

                        {/***** Route Not Found  ****/}
                        <CustomRoute path="*" render={(props: any) => <PageNotFound {...props} />} />
                     </Switch>
                  </Suspense>
               </Container>
               <Footer />
               <Suspense fallback={<></>}>
                  <CookieBanner />
               </Suspense>
            </ShopContextContainer>
         </AuthenticationContext>
      </BrowserRouter>
   );
};
export default App;
