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
import { useSilentOfficialAuthentication } from "osnack-frontend-shared/src/hooks/OfficialHooks/useAuthenticationHook";
const Home = lazy(() => import("./pages/Home/Home"));
const OrderSuccess = lazy(() => import("./pages/Basket/OrderSuccess"));
const Shop = lazy(() => import("./pages/Shop/Shop"));
const About = lazy(() => import("./pages/About/About"));
const ContactUs = lazy(() => import("./pages/ContactUs/ContactUs"));
const Basket = lazy(() => import("./pages/Basket/Basket"));
const MyAccount = lazy(() => import("./pages/MyAccount/MyAccount"));
const MyAddresses = lazy(() => import("./pages/MyAccount/MyAddresses"));
const ViewOrders = lazy(() => import("./pages/MyAccount/MyOrders"));
const LoginPage = lazy(() => import("./pages/Login/LoginPage"));
const ProductPage = lazy(() => import("./pages/ProductPage/ProductPage"));
const PageNotFound = lazy(() => import("osnack-frontend-shared/src/pages/PageNotFound"));
const ConfirmEmail = lazy(() => import("osnack-frontend-shared/src/pages/ConfirmEmail"));
const PasswordReset = lazy(() => import("osnack-frontend-shared/src/pages/PasswordReset"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy/PrivacyPolicy"));

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
                        <CustomRoute authenticate={useSilentOfficialAuthentication} exact path="/" Render={(props: any) => <Home {...props} />} />
                        <CustomRoute authenticate={useSilentOfficialAuthentication} path="/Login" Render={(props: any) => <LoginPage {...props} />} />
                        <CustomRoute authenticate={useSilentOfficialAuthentication} path="/EmailConfirmation" Render={(props: any) => <ConfirmEmail {...props} />} />
                        <CustomRoute authenticate={useSilentOfficialAuthentication} path="/ResetPassword" Render={(props: any) => <PasswordReset {...props} />} />
                        <CustomRoute authenticate={useSilentOfficialAuthentication} path="/Shop/Product" Render={(props: any) => <ProductPage {...props} />} />
                        <CustomRoute authenticate={useSilentOfficialAuthentication} path="/Shop" Render={(props: any) => <Shop {...props} />} />
                        <CustomRoute authenticate={useSilentOfficialAuthentication} path="/Checkout" Render={(props: any) => <Basket {...props} />} />
                        <CustomRoute authenticate={useSilentOfficialAuthentication} path="/About" Render={(props: any) => <About {...props} />} />
                        <CustomRoute authenticate={useSilentOfficialAuthentication} path="/Contact" Render={(props: any) => <ContactUs {...props} />} />
                        <CustomRoute authenticate={useSilentOfficialAuthentication} path="/OrderSuccessful" Render={(props: any) => <OrderSuccess {...props} />} />
                        <CustomRoute authenticate={useSilentOfficialAuthentication} path="/PrivacyPolicy" Render={(props: any) => <PrivacyPolicy {...props} />} />
                        <CustomRoute authenticate={useSilentOfficialAuthentication} path="/TermsAndConditions" Render={(props: any) => <TermsAndConditions {...props} />} />

                        {/***** Protected Routes  ****/}
                        <CustomRoute authenticate={useSilentOfficialAuthentication} exact AuthRequired path="/MyAccount" Render={(props: any) => <MyAccount {...props} />} />
                        <CustomRoute authenticate={useSilentOfficialAuthentication} AuthRequired path="/MyOrders" Render={(props: any) => <ViewOrders {...props} />} />
                        <CustomRoute authenticate={useSilentOfficialAuthentication} exact AuthRequired path="/MyAddresses" Render={(props: any) => <MyAddresses {...props} />} />

                        {/***** Route Not Found  ****/}
                        <CustomRoute authenticate={useSilentOfficialAuthentication} path="*" Render={(props: any) => <PageNotFound {...props} />} />
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
