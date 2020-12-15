import React, { useContext, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { Loading } from "../components/Loading/Loading";
import { AlertObj } from "../components/Texts/Alert";
import { useAntiforgeryTokenAuthentication } from "../hooks/PublicHooks/useAuthenticationHook";
import { User } from "./apiModels";
import { AuthContext } from "./authenticationContext";

const CustomRoute = (props: IProps) => {
   const auth = useContext(AuthContext);
   const [prevPath, setPrevPath] = useState("");
   const [authChecking, setAuthChecking] = useState(true);
   if (prevPath !== props.path) {
      setAuthChecking(true);
      const successResult = (user: User) => {
         auth.setState({ isAuthenticated: true, user: user });
         setAuthChecking(false);
      };

      const catchResult = (error: AlertObj) => {
         auth.setState({ isAuthenticated: false, user: new User() });
         setAuthChecking(false);
      };

      props.authenticate().then(result => {
         successResult(result.data);
      }
      ).catch((error) => {
         if (error.httpStatus === 404) {
            useAntiforgeryTokenAuthentication().then(() => { });
         }
         props.authenticate().then(result => {
            successResult(result.data);
         }
         ).catch((error) => {
            catchResult(error);
         });
      });

      setPrevPath(props.path);
   }
   if (props.AuthRequired && !auth.state.isAuthenticated && !authChecking)
      return (<Redirect to={{ pathname: "/Login", state: { fromPath: prevPath } }} />);

   if (!props.AuthRequired || (props.AuthRequired && auth.state.isAuthenticated && !authChecking))
      return (<Route exact={props?.exact} path={props.path} render={props.Render} />);

   return <Loading />;
};
declare type IProps = {
   path: string,
   Render: any,
   exact?: boolean;
   authenticate: () => Promise<{ data: User, status?: number; }>,
   AuthRequired?: boolean;
};
export default CustomRoute;
