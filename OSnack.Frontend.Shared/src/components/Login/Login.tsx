import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import { CommonRegex } from "../../_core/constant.Variables";
import PageHeader from "../../components/Texts/PageHeader";
import { Input } from "../../components/Inputs/Input";
import { CheckBox } from "../../components/Inputs/CheckBox";
import { Button } from "../../components/Buttons/Button";
import GoogleLogin from "../../components/Buttons/GoogleLogin";
import { useLogin, useExternalLogin } from "../../hooks/apiCallers/authentication/Post.Authentication";
import { AuthContext } from "../../_core/authenticationContext";
import { ExternalLoginInfo, LoginInfo, User } from "../../_core/apiModels";
import ForgotPasswordModal from "../Modals/ForgotPasswordModal";
import Alert, { AlertObj, AlertTypes, Error } from "../Texts/Alert";
import { sleep } from "../../_core/appFunc";

const Login = (props: IProps) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [loginInfo, setLoginInfo] = useState(new LoginInfo());
   const [forgotPasswordModalIsOpen, setForgotPasswordModalIsOpen] = useState(false);
   const auth = useContext(AuthContext);

   const login = async () => {
      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useLogin(loginInfo, props.access).then(result => {
         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else if (result.isAuthenticated) {
            auth.setState({ isAuthenticated: result.isAuthenticated, user: result.user });
            setAlert(alert.Clear);
         }
      });
   };

   const externalLogin = async (info: ExternalLoginInfo) => {

      info.rememberMe = loginInfo.rememberMe;
      info.redirectUrl = window.location.href;

      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useExternalLogin(info, props.access).then(result => {
         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         }
         /// pass the state user info to create new customer
         else if (!result.isAuthenticated) {
            props.externalLoginFailed(result.user);
            setAlert(alert.Clear);
         } else if (result.isAuthenticated) {
            auth.setState({ isAuthenticated: result.isAuthenticated, user: result.user });
         }
      });
   };

   const externalLoginWait = () => {
      setAlert(new AlertObj([new Error("Working", "Please Wait...")], AlertTypes.Warning));
   };

   const externalLoginFailed = (err: string) => {
      setAlert(new AlertObj([new Error(Math.random(), err)], AlertTypes.Error));
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
         <PageHeader title="Login" className="pt-0" />

         <Input label="Email"
            type="email"
            value={loginInfo.email}
            validationPattern={CommonRegex.Email}
            showDanger={alert.checkExist("email")}
            onChange={i => setLoginInfo({ ...loginInfo, email: i.target.value })}
         />

         <Input label="Password"
            type="password"
            onPressedEnter={login}
            value={loginInfo.password}
            showDanger={alert.checkExist("password")}
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

         <Alert alert={alert} className="col-12" onClosed={() => setAlert(alert.Clear)} />

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
                  onClosedWithoutAction={() => setAlert(alert.Clear)}
               /> ****/}
               <GoogleLogin clientId="78803002607-eqki0ohr9viovu2e5q0arpg8on9p8huq.apps.googleusercontent.com"
                  children="Sign in with Google"
                  className="btn-lg btn-g col-12 mt-2 "
                  redirectURI={window.location.href}
                  onSuccess={externalLogin}
                  onFailure={externalLoginFailed}
                  onClick={externalLoginWait}
                  onClosedWithoutAction={() => setAlert(alert.Clear)}
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
   access: string;
   disableExternalLogin?: boolean;
   externalLoginFailed: (user: User) => void;
};
export default Login;