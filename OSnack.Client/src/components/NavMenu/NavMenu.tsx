import React, { useState, useEffect, useContext } from "react";

import { DefaultNav, LoginNav } from "./NavMenuItems";
import { AuthContext } from "osnack-frontend-shared/src/_core/authenticationContext";
import { useLogout } from "osnack-frontend-shared/src/hooks/apiCallers/authentication/Get.Authentication";
import { User } from "osnack-frontend-shared/src/_core/apiModels";
import { useDetectOutsideClick } from "osnack-frontend-shared/src/hooks/function/useDetectOutsideClick";
import DropDown from "osnack-frontend-shared/src/components/Buttons/DropDown";
import NavLink from "osnack-frontend-shared/src/components/Buttons/NavLink";
import { Link } from "react-router-dom";

// Navigation menu component
const NavMenu = (props: IProps) => {
   const [NavContainer] = useState(React.createRef<HTMLDivElement>());
   const auth = useContext(AuthContext);
   const [outsideClickSmallNav, setOutsideClickSmallNav] = useDetectOutsideClick(NavContainer, false);
   const [currentNavItems, setCurrentNavItems] = useState(DefaultNav);
   const [selectedNav] = useState(window.location.pathname);

   const logout = async () => {
      const result = await useLogout();
      if (result.isLogout) {
         auth.setState({ isAuthenticated: false, user: new User() });
      }
   };
   useEffect(() => {
      /// Check which menu items to show for the user
      if (auth.state.isAuthenticated)
         setCurrentNavItems(LoginNav);
      else
         setCurrentNavItems(DefaultNav);
   }, [auth.state.isAuthenticated]);
   return (
      <header>
         <nav id="navbar" ref={NavContainer}>
            <div className="row col-12 p-0 m-0 ">
               {/** Logo & toggler icon */}
               <Link to="/" className="logo-container ml-md-auto mr-md-auto pt-1 pl-2 pl-md-0">
                  <img id="logo" alt="Logo" className="Logo" src="/public/images/logo.png" />
               </Link>
               <button type="button" name="toggler"
                  className={`fas cart-icon remove-btn-style ml-auto  ml-md-0 mr-md-2 ${outsideClickSmallNav ? "show" : "show"}`}
                  onClick={() => { setOutsideClickSmallNav((prevVal) => !prevVal); }} />
               <button type="button" name="toggler"
                  className={`fas toggler-icon ml-auto ${outsideClickSmallNav ? "show" : "hide"}`}
                  onClick={() => { setOutsideClickSmallNav((prevVal) => !prevVal); }} />
            </div>
            <div className="navbar navbar-expand-md row p-0 m-0">
               <div className={`d-md-inline-flex flex-md-row col-12 collapse align-items-center
                           ${outsideClickSmallNav ? "show" : 'hide'}`}>
                  <div className="ml-auto" />
                  {/** user links */}
                  {currentNavItems.map(link =>
                     <NavLink key={link.id} displayName={link.displayName} path={link.path} className="col-12 col-md-auto" />
                  )}
                  {auth.state.isAuthenticated &&
                     <DropDown titleClassName={`navbar text-nav dropdown-toggle ${selectedNav === "/MyAccount" ? "visited" : ""}`}
                        title={<div className="user-circle-icon" />}>
                        <NavLink className="dropdown-item"
                           path={"/MyAccount"}
                           displayName="Account" />
                        <a className="dropdown-item"
                           onClick={() => {
                              logout();
                           }}
                           children="Logout" />
                     </DropDown >
                  }
                  <div className="mr-auto" />
               </div>
            </div>
         </nav >
      </header >
   );
};

declare type IProps = {
};
export default NavMenu;
