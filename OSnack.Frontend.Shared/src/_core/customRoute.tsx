import React, { useContext, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { Loading } from "../components/Loading/Loading";
import { User } from "./apiModels";
import { AuthContext } from "./authenticationContext";

const CustomRoute = (props: IProps) => {
   const auth = useContext(AuthContext);
   const [prevPath, setPrevPath] = useState("");
   const [authChecking, setAuthChecking] = useState(true);
   console.log("");
   if (prevPath !== props.path) {
      setAuthChecking(true);
      props.authenticate().then(user => {

         auth.setState({ isAuthenticated: true, user: user });
         setAuthChecking(false);
      }
      ).catch((error) => {
         console.log(error);
         auth.setState({ isAuthenticated: false, user: new User() });
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
   path: string,
   Render: any,
   exact?: boolean;
   authenticate: () => Promise<User>,
   AuthRequired?: boolean;
};
export default CustomRoute;
