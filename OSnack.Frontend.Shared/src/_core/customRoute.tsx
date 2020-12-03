import React, { useContext, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { Loading } from "../components/Loading/Loading";
import { useSilentOfficialAuthentication, useSilentSecretAuthentication } from "../hooks/apiHooks/useAuthenticationHook";
import { User } from "./apiModels";
import { AuthContext } from "./authenticationContext";
import { ClientAppAccess } from "./constant.Variables";

const CustomRoute = (props: IProps) => {
   const auth = useContext(AuthContext);
   const [prevPath, setPrevPath] = useState("");
   const [authChecking, setAuthChecking] = useState(true);
   if (prevPath !== props.path) {
      setAuthChecking(true);

      switch (props.access) {

         case ClientAppAccess.Official:
            useSilentOfficialAuthentication().then(user => {

               auth.setState({ isAuthenticated: true, user: user });
               setAuthChecking(false);
            }
            ).catch(() => {
               auth.setState({ isAuthenticated: false, user: new User() });
               setAuthChecking(false);
            });
            break;
         case ClientAppAccess.Secret:
            useSilentSecretAuthentication().then(user => {

               auth.setState({ isAuthenticated: true, user: user });
               setAuthChecking(false);
            }
            ).catch(() => {
               auth.setState({ isAuthenticated: false, user: new User() });
               setAuthChecking(false);
            });
            break;
         default:
      }
      setPrevPath(props.path);

      //useSilentAuthentication(auth.state.isAuthenticated, props.access).then((result) => {
      //   auth.setState(result);
      //   setAuthChecking(false);
      //});
      //setPrevPath(props.path);
   }
   if (props.AuthRequired && !auth.state.isAuthenticated && !authChecking)
      return (<Redirect to={{ pathname: "/Login", state: { fromPath: prevPath } }} />);

   if (!props.AuthRequired || (props.AuthRequired && auth.state.isAuthenticated && !authChecking))
      return (<Route exact={props?.exact} path={props.path} render={props.Render} />);

   return <Loading />;
};
declare type IProps = {
   access: ClientAppAccess;
   path: string,
   Render: any,
   exact?: boolean;
   AuthRequired?: boolean;
};
export default CustomRoute;