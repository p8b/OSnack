import { CustomRouteContext } from "osnack-frontend-shared/src/_core/Contexts/customRouteContext";
import React, { useContext, useEffect, useState } from "react";

const Container = (props: IProps) => {
   const customRouteContext = useContext(CustomRouteContext);
   const [containerId] = useState(Math.random().toString());

   useEffect(() => {
      if (props.mainContainer) {
         scrollChange();
         window.addEventListener("scroll", scrollChange);
      }
      return () => {
         window.removeEventListener("scroll", scrollChange);
      };
   }, []);

   const scrollChange = () => {
      let container = document.getElementById(containerId);
      if (container !== null && window.pageYOffset > 0) {
         document.getElementById("logo")?.classList.add("small");
         document.getElementById("navbar")?.classList.add("transition");
      }
      else {
         document.getElementById("logo")?.classList.remove("small");
         document.getElementById("navbar")?.classList.remove("transition");
      }
   };

   if (customRouteContext.maintenanceIsOn && !customRouteContext.isUserAllowedInMaintenance)
      return (<>{props.children}</>);
   return (<div id={containerId}
      className={`container ${props?.className} ${props?.mainContainer && "main-container"}`}
      children={props?.children}
      ref={props?.ref} />);
};

interface IProps {
   mainContainer?: boolean;
   children?: any;
   className?: string;
   ref?: any;
}
export default Container;
