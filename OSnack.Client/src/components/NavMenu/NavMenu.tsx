import React, { useState, useEffect, useContext } from "react";

import { DefaultNav, LoginNav } from "./NavMenuItems";
import { AuthContext } from "osnack-frontend-shared/src/_core/authenticationContext";
import { User } from "osnack-frontend-shared/src/_core/apiModels";
import { useDetectOutsideClick } from "osnack-frontend-shared/src/hooks/function/useDetectOutsideClick";
import DropDown from "osnack-frontend-shared/src/components/Buttons/DropDown";
import NavLink from "osnack-frontend-shared/src/components/Buttons/NavLink";
import { Link } from "react-router-dom";
import CartIcon from "./CartIcon";
import { useLogoutAuthentication } from "osnack-frontend-shared/src/hooks/OfficialHooks/useAuthenticationHook";

// Navigation menu component
const NavMenu = (props: IProps) => {
   const [NavContainer] = useState(React.createRef<HTMLDivElement>());
   const auth = useContext(AuthContext);
   const [outsideClickSmallNav, setOutsideClickSmallNav] = useDetectOutsideClick(NavContainer, false);
   const [currentNavItems, setCurrentNavItems] = useState(DefaultNav);
   const [selectedNav] = useState(window.location.pathname);

   useEffect(() => {
      if (auth.state.isAuthenticated)
         setCurrentNavItems(LoginNav);
      else
         setCurrentNavItems(DefaultNav);
   }, [auth.state.isAuthenticated]);

   const logout = async () => {
      await useLogoutAuthentication().then(() => {
         auth.setState({ isAuthenticated: false, user: new User() });
         setCurrentNavItems(DefaultNav);
      });
   };

   return (
      <header >
         <nav id="navbar" className="navbar p-0" ref={NavContainer}>
            <div className="row col-12 p-0 m-0 ">
               {/** Logo & toggler icon */}
               <Link to="/" className="logo-container ml-md-auto mr-auto pt-1 pl-2 pl-md-0">
                  <img id="logo" alt="Logo" className="Logo" src="/public/images/logo.png" />
               </Link>
               <CartIcon />
               <button type="button" name="toggler"
                  className={`fas toggler-icon ${outsideClickSmallNav ? "show" : "hide"}`}
                  onClick={() => { setOutsideClickSmallNav((prevVal) => !prevVal); }} />
            </div>
            <div className={`d-md-inline-flex flex-md-row w-100 collapse align-items-center
                           ${outsideClickSmallNav ? "show" : 'hide'}`}>
               <div className="ml-auto" />
               {/** user links */}
               {currentNavItems.map(link =>
                  <NavLink key={link.id} displayName={link.displayName} path={link.path}
                     className="col-12 col-md-auto" />
               )}
               {auth.state.isAuthenticated &&
                  <DropDown titleClassName={`btn-no-style ${selectedNav === "/MyAccount" ? "visited" : ""}`}
                     title={<div className="user-circle-icon" />}>
                     <NavLink className="dropdown-item"
                        path={"/MyAccount"}
                        displayName="Account" />
                     <a className="dropdown-item"
                        onClick={logout}
                        children="Logout" />
                  </DropDown >
               }
               <div className="mr-auto" />
            </div>
         </nav >
      </header >
   );
};

declare type IProps = {
};
export default NavMenu;
