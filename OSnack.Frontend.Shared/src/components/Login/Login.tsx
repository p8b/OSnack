import React, { useState, useContext, useRef, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { CommonRegex, GoogleLoginKey } from "../../_core/appConst";
import { Input } from "../../components/Inputs/Input";
import { CheckBox } from "../../components/Inputs/CheckBox";
import { Button } from "../../components/Buttons/Button";
import GoogleLogin from "../../components/Buttons/GoogleLogin";
import { AuthenticationContext } from "../../_core/Contexts/authenticationContext";
import { ExternalLoginDetails, LoginInfo, User } from "../../_core/apiModels";
import ForgotPasswordModal from "../Modals/ForgotPasswordModal";
import Alert, { AlertObj, AlertTypes, ErrorDto, useAlert } from "../Texts/Alert";
import { useExternalLoginAuthentication, useLoginAuthentication } from "../../hooks/PublicHooks/useAuthenticationHook";

const Login = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [loginInfo, setLoginInfo] = useState(new LoginInfo());
   const [forgotPasswordModalIsOpen, setForgotPasswordModalIsOpen] = useState(false);
   const auth = useContext(AuthenticationContext);

   useEffect(() => {
      return () => {
         isUnmounted.current = true;
      };
   }, []);

   const loginSuccess = (result: { data: User, status?: number; }, loadingCallBack?: () => void) => {
      if (isUnmounted.current) return;
      loadingCallBack && loadingCallBack!();
      errorAlert.clear();
      auth.set(true, result.data);
   };
   const loginFailed = (errors: AlertObj, loadingCallBack?: () => void) => {
      if (isUnmounted.current) return;
      errorAlert.set(errors);
      loadingCallBack && loadingCallBack!();
   };
   const externalLoginSuccess = (result: { data: User, status?: number; }, loadingCallBack?: () => void) => {
      if (isUnmounted.current) return;
      loadingCallBack && loadingCallBack!();
      if (result.data.id && result.data.id <= 0) {
         props.externalLoginFailed(result.data);
         errorAlert.clear();
      } else {
         loginSuccess(result);
      }
   };
   const login = (loadingCallBack?: () => void) => {
      errorAlert.pleaseWait(isUnmounted);
      useLoginAuthentication(loginInfo)
         .then((result) => loginSuccess(result, loadingCallBack))
         .catch((errors) => loginFailed(errors, loadingCallBack));
   };
   const externalLogin = (info: ExternalLoginDetails, loadingCallBack?: () => void) => {
      info.rememberMe = loginInfo.rememberMe ?? false;
      info.redirectUrl = window.location.href;

      errorAlert.pleaseWait(isUnmounted);
      useExternalLoginAuthentication(info)
         .then(result => externalLoginSuccess(result, loadingCallBack))
         .catch(errors => loginFailed(errors, loadingCallBack));
   };

   const externalLoginWait = () => { errorAlert.pleaseWait(isUnmounted); };

   const externalLoginFailed = (err: string) => {
      errorAlert.set(new AlertObj([new ErrorDto(Math.random().toString(), err)], AlertTypes.Error));
   };

   /// If user is authenticated then redirect the user to home page
   if (auth.isAuthenticated) {
      try {
         return (<Redirect to={props.fromPath || "/"} />);
      } catch (e) {
         return (<Redirect to="/" />);
      }
   }

   return (
      <>
         <Input label="Email"
            type="email"
            id="email"
            value={loginInfo.email}
            validationPattern={CommonRegex.Email}
            showDanger={errorAlert.checkExist("email")}
            onChange={i => setLoginInfo({ ...loginInfo, email: i.target.value })}
         />
         {loginInfo.email != "" && loginInfo.email != undefined &&
            <Input label="Password"
               type="password"
               onPressedEnter={login}
               value={loginInfo.password}
               showDanger={errorAlert.checkExist("password")}
               onChange={i => setLoginInfo({ ...loginInfo, password: i.target.value })}
            />
         }

         <div className="row pm-0 my-3">
            <CheckBox label="Remember Me"
               className="col-6 pm-0"
               inputClassName=" color-style-checked"
               onChange={checked => setLoginInfo({ ...loginInfo, rememberMe: checked })}
            />
            <a onClick={() => { if (navigator.cookieEnabled) setForgotPasswordModalIsOpen(true); }}
               className="text-right col-6 pm-0 text-underline"
               children="Forgot Password?"

            />

         </div>

         <Alert alert={errorAlert.alert} className="col-12" onClosed={errorAlert.clear} />

         <Button children="Login"
            className="col-12 btn-lg btn-green mt-2 "
            enableLoading={isUnmounted}
            onClick={login}
            disabled={!navigator.cookieEnabled} />
         {!props.disableExternalLogin &&
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
               <GoogleLogin clientId={GoogleLoginKey}
                  children="Sign in with Google"
                  className="btn-lg btn-g col-12 mt-2 "
                  redirectURI={window.location.href.toLowerCase()}
                  onSuccess={externalLogin}
                  onFailure={externalLoginFailed}
                  onClick={externalLoginWait}
                  onClosedWithoutAction={errorAlert.clear}
                  enableLoading={isUnmounted}

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
   disableExternalLogin?: boolean;
   externalLoginFailed: (user: User) => void;
};
export default Login;
