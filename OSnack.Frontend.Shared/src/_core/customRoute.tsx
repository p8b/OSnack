import React, { useContext, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { Loading } from "../components/Loading/Loading";
import { useSilentAuthentication } from "../hooks/apiCallers/authentication/Get.Authentication";
import { setHtmlTitle } from "./appFunc";
import { AuthContext } from "./authenticationContext";

const CustomRoute = (props: IProps) => {
   const auth = useContext(AuthContext);
   const [prevPath, setPrevPath] = useState("");
   const [authChecking, setAuthChecking] = useState(true);
   if (prevPath !== props.path) {
      setAuthChecking(true);
      useSilentAuthentication(auth.state.isAuthenticated, props.access).then((result) => {
         auth.setState(result);
         setAuthChecking(false);
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
   access: string;
   path: string,
   Render: any,
   exact?: boolean;
   AuthRequired?: boolean;
};
export default CustomRoute;