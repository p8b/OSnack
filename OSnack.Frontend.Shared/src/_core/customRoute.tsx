import React, { useContext, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { Loading } from "../components/Loading/Loading";
import { useSilenceAuthentication } from "../hooks/PublicHooks/useAuthenticationHook";
import { User } from "./apiModels";
import { AuthContext } from "./authenticationContext";

const CustomRoute = (props: IProps) => {
   const auth = useContext(AuthContext);
   const [prevPath, setPrevPath] = useState("");
   const [authChecking, setAuthChecking] = useState(true);
   if (prevPath !== props.path) {
      window.scrollTo(0, 0);
      setAuthChecking(true);
      useSilenceAuthentication().then(result => {
         auth.setState({ isAuthenticated: result.data.isAuthenticated!, user: result.data.user! });
         setAuthChecking(false);
      }
      ).catch((error) => {
         auth.setState({ isAuthenticated: false, user: new User() });
         setAuthChecking(false);
      });

      setPrevPath(props.path);
   }
   if (props.authRequired && !auth.state.isAuthenticated && !authChecking)
      return (<Redirect to={{ pathname: "/Login", state: { fromPath: window.location.pathname } }} />);

   if (!props.authRequired || (props.authRequired && auth.state.isAuthenticated && !authChecking))
      return (<Route exact={props?.exact} path={props.path} render={props.render} />);

   return <Loading />;
};
declare type IProps = {
   path: string,
   render: any,
   exact?: boolean;
   authRequired?: boolean;
};
export default CustomRoute;
