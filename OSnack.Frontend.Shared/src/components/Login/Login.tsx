import React, { useState, useContext, useRef, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { ClientAppAccess, CommonRegex } from "../../_core/constant.Variables";
import PageHeader from "../../components/Texts/PageHeader";
import { Input } from "../../components/Inputs/Input";
import { CheckBox } from "../../components/Inputs/CheckBox";
import { Button } from "../../components/Buttons/Button";
import GoogleLogin from "../../components/Buttons/GoogleLogin";
import { AuthContext } from "../../_core/authenticationContext";
import { ExternalLoginInfo, LoginInfo, User } from "../../_core/apiModels";
import ForgotPasswordModal from "../Modals/ForgotPasswordModal";
import Alert, { AlertObj, AlertTypes, ErrorDto, useAlert } from "../Texts/Alert";
import { useAntiforgeryTokenAuthentication, useExternalLoginOfficialAuthentication, useExternalLoginSecretAuthentication, useLoginOfficialAuthentication, useLoginSecretAuthentication } from "../../hooks/PublicHooks/useAuthenticationHook";

const Login = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [loginInfo, setLoginInfo] = useState(new LoginInfo());
   const [forgotPasswordModalIsOpen, setForgotPasswordModalIsOpen] = useState(false);
   const auth = useContext(AuthContext);

   useEffect(() => () => {
      isUnmounted.current = true;
      document.getElementById("email")?.focus();
   }, []);

   const loginSuccess = (user: User) => {
      if (isUnmounted.current) return;
      useAntiforgeryTokenAuthentication().then(() => {
         auth.setState({ isAuthenticated: true, user: user });
         errorAlert.clear();
      }).catch();
   };
   const loginFailed = (errors: AlertObj) => {
      if (isUnmounted.current) return;
      errorAlert.set(errors);

   };
   const externalLoginSuccess = (user: User) => {
      if (isUnmounted.current) return;
      if (user.id && user.id <= 0) {
         props.externalLoginFailed(user);
         errorAlert.clear();
      } else {
         loginSuccess(user);
      }
   };
   const login = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      switch (props.access) {
         case ClientAppAccess.Official:
            useLoginOfficialAuthentication(loginInfo).then(loginSuccess).catch(loginFailed);
            break;
         case ClientAppAccess.Secret:
            useLoginSecretAuthentication(loginInfo).then(loginSuccess).catch(loginFailed);
            break;
         default:
            break;
      }
   };
   const externalLogin = async (info: ExternalLoginInfo) => {

      info.rememberMe = loginInfo.rememberMe;
      info.redirectUrl = window.location.href;

      errorAlert.PleaseWait(500, isUnmounted);
      switch (props.access) {
         case ClientAppAccess.Official:
            useExternalLoginOfficialAuthentication(info).then(externalLoginSuccess).catch(loginFailed);
            break;
         case ClientAppAccess.Secret:
            useExternalLoginSecretAuthentication(info).then(externalLoginSuccess).catch(loginFailed);
            break;
         default:
            break;
      }
   };

   const externalLoginWait = () => { errorAlert.PleaseWait(500, isUnmounted); };

   const externalLoginFailed = (err: string) => {
      errorAlert.set(new AlertObj([new ErrorDto(Math.random().toString(), err)], AlertTypes.Error));
   };

   /// If user is authenticated then redirect the user to home page
   if (auth.state.isAuthenticated) {
      try {
         return (<Redirect to={props.fromPath || "/"} />);
      } catch (e) {
         return (<Redirect to="/" />);
      }
   }

   return (
      <>
         <PageHeader title="Login" className="pt-0 line-header-no-line" />

         <Input label="Email"
            type="email"
            id="email"
            value={loginInfo.email}
            validationPattern={CommonRegex.Email}
            showDanger={errorAlert.checkExist("email")}
            onChange={i => setLoginInfo({ ...loginInfo, email: i.target.value })}
         />

         <Input label="Password"
            type="password"
            onPressedEnter={login}
            value={loginInfo.password}
            showDanger={errorAlert.checkExist("password")}
            onChange={i => setLoginInfo({ ...loginInfo, password: i.target.value })}
         />

         <div className="mt-3 mb-3 d-inline">
            <CheckBox label="Remember Me" className="col-6 color-style-checked"
               onChange={checked => setLoginInfo({ ...loginInfo, rememberMe: checked })}
            />
            <a onClick={() => setForgotPasswordModalIsOpen(true)}
               className="text-right col-6 float-right text-underline"
               children="Forgot Password?"
            />

         </div>

         <Alert alert={errorAlert.alert} className="col-12" onClosed={errorAlert.clear} />

         <Button children="Login" className="col-12 btn-lg btn-green mt-2 " onClick={login} />
         {  !props.disableExternalLogin &&
            <>
               {/*****                <FacebookLogin clientId="1237220039954343"
                  children="Login with Facebook"
                  className="btn-lg btn-fb col-12 mt-2 "
                  redirectURI={window.location.href}
                  onSuccess={externalLogin}
                  onFailure={externalLoginFailed}
                  onClick={externalLoginWait}
                  onClosedWithoutAction={() => errorAlert.clear()}
               /> ****/}
               <GoogleLogin clientId="78803002607-eqki0ohr9viovu2e5q0arpg8on9p8huq.apps.googleusercontent.com"
                  children="Sign in with Google"
               className="btn-lg btn-g col-12 mt-2 "
               redirectURI={window.location.href}
                  onSuccess={externalLogin}
                  onFailure={externalLoginFailed}
                  onClick={externalLoginWait}
                  onClosedWithoutAction={errorAlert.clear}
               />
            </>
         }

         {/***** Modal ****/}
         <ForgotPasswordModal isOpen={forgotPasswordModalIsOpen}
            onCancel={() => setForgotPasswordModalIsOpen(false)}
            email={loginInfo.email || ""}
         />
      </>
   );
};

declare type IProps = {
   fromPath: string;
   access: ClientAppAccess;
   disableExternalLogin?: boolean;
   externalLoginFailed: (user: User) => void;
};
export default Login;
