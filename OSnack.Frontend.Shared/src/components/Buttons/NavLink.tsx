import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { setHtmlTitle } from '../../_core/appFunc';
const NavLink = (props: IProps) => {
   const currentKnowPathName = useCurrentKnownPathName();
   const setSelectedNavItem = async () => {
      /// must be delayed to avoid render conflicts
      await new Promise(resolve => setTimeout(resolve, 1));
      if (currentKnowPathName.value !== window.location.pathname) {
         currentKnowPathName.setValue(window.location.pathname);

         const uriPathNameArr = window.location.pathname.split('/').filter(val => val.length > 0);
         let firstPathnameElement = "";
         if (uriPathNameArr.length > 0) {
            firstPathnameElement = uriPathNameArr[0];
         }
         setHtmlTitle(firstPathnameElement);
      }
   };
   const isCurrentRouteVisited = () => {
      if (currentKnowPathName.value === props.path || (props.path != "/" && currentKnowPathName.value.includes(props.path)))
         return "visited";
      else
         return "";
   };

   return (
      <Link
         className={`link-nav ${isCurrentRouteVisited()} ${props.className || ""}`}
         onClick={props.onClick}
         to={() => {
            setSelectedNavItem();
            return props.path;
         }}>
         <div className="w-100 ml-auto mr-auto text-center mb-0">{props.displayName}</div>
         <div id="navlink-underline-animation" />
      </Link>
   );
};

declare type IProps = {
   className?: string;
   displayName: string;
   path: string;
   onClick?: () => void;
};
export default NavLink;

const useCurrentKnownPathName = () => {
   const [value, setValue] = useState(window.location.pathname);

   return { value, setValue };
};
