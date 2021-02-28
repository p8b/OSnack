import React, { useContext, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { Loading } from "../components/Loading/Loading";
import { useSilenceAuthentication } from "../hooks/PublicHooks/useAuthenticationHook";
import { AuthenticationContext } from "./Contexts/authenticationContext";
import { CustomRouteContext } from "./Contexts/customRouteContext";

const CustomRoute = (props: IProps) => {
   const auth = useContext(AuthenticationContext);
   const customRouteContext = useContext(CustomRouteContext);
   useEffect(() => {
      if (customRouteContext.currentPath.toLocaleLowerCase() != props.path.toLocaleLowerCase()) {
         window.scrollTo(0, 0);
         customRouteContext.setPath(props.path.toLocaleLowerCase());
         useSilenceAuthentication().then(result => {
            customRouteContext.setMaintenance(result.data.maintenanceModeStatus, result.data.isUserAllowedInMaintenance);
            auth.set(result.data.isAuthenticated, result.data.user);
            customRouteContext.authenticationIsConfirmed();
         }
         ).catch(error => {
            customRouteContext.setMaintenance(true, false);
            auth.set(false);
            customRouteContext.authenticationIsConfirmed();
         });
      }
   }, [props.path]);

   if (props.authRequired && !auth.isAuthenticated && customRouteContext.isAuthenticationConfirmed)
      return (<Redirect to={{ pathname: "/Login", state: { fromPath: window.location.pathname } }} />);

   if (!props.authRequired || (auth.isAuthenticated && customRouteContext.isAuthenticationConfirmed))
      return (<Route exact={props?.exact} path={props.path} render={props.render} />);

   return (<Loading />);
};
declare type IProps = {
   path: string,
   render: any,
   exact?: boolean;
   authRequired?: boolean;
};
export default CustomRoute;
