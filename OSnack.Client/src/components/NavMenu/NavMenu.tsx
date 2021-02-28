import React, { useState, useEffect, useContext } from "react";

import { DefaultNav, LoginNav } from "./NavMenuItems";
import { AuthenticationContext } from "osnack-frontend-shared/src/_core/Contexts/authenticationContext";
import { useDetectOutsideClick } from "osnack-frontend-shared/src/hooks/function/useDetectOutsideClick";
import DropDown from "osnack-frontend-shared/src/components/Buttons/DropDown";
import NavLink from "osnack-frontend-shared/src/components/Buttons/NavLink";
import CartIcon from "./CartIcon";
import { useLogoutAuthentication } from "osnack-frontend-shared/src/hooks/OfficialHooks/useAuthenticationHook";
import { useHistory } from "react-router-dom";

const NavMenu = (props: IProps) => {
   const [navDropdownRef] = useState(React.createRef<HTMLDivElement>());
   const [accountDropdownButtonRef] = useState(React.createRef<HTMLButtonElement>());
   const auth = useContext(AuthenticationContext);
   const [outsideClickSmallNav, setOutsideClickSmallNav] = useDetectOutsideClick([navDropdownRef, accountDropdownButtonRef], false);
   const [currentNavItems, setCurrentNavItems] = useState(DefaultNav);
   const [selectedNav] = useState(window.location.pathname);
   const history = useHistory();

   useEffect(() => {
      if (auth.isAuthenticated)
         setCurrentNavItems(LoginNav);
      else
         setCurrentNavItems(DefaultNav);
   }, [auth.isAuthenticated]);

   const logout = async () => {
      await useLogoutAuthentication().then(() => {
         auth.set(false);
         setCurrentNavItems(DefaultNav);
      });
   };
   return (
      <header >
         <nav id="navbar" className="navbar p-0">
            <div className="row col-12 p-0 m-0 ">
               {/** Logo & toggler icon */}
               <div onClick={() => history.push("/")} className="logo-container ml-md-auto mr-auto pt-1 pl-2 pl-md-0">
                  <img id="logo" alt="Logo" className="Logo" src="/public/images/logo.png" />
               </div>
               <CartIcon />
               <span ref={navDropdownRef}>
                  <button type="button" name="menu toggler" aria-label="menu toggler"
                     className={`fas toggler-icon ${outsideClickSmallNav ? "show" : "hide"}`}
                     onClick={() => { setOutsideClickSmallNav((prevVal) => !prevVal); }} />
               </span>
            </div>
            <div className={`d-md-inline-flex flex-md-row w-100 collapse align-items-center
                           ${outsideClickSmallNav ? "show" : 'hide'}`} >
               <div className="ml-auto" />
               {/** user links */}
               {currentNavItems.map((link, index) =>
                  <NavLink key={index} displayName={link.displayName} path={link.path}
                     className="col-12 col-md-auto" />
               )}
               {auth.isAuthenticated &&
                  <DropDown buttonRef={accountDropdownButtonRef}
                     className="col-auto pm-0 "
                     menuClassName="mt-n1 mt-md-0"
                     titleClassName={` btn-no-style ${selectedNav === "/MyAccount" ? "visited" : ""}`}
                     title={<><div className="user-circle-icon" /><span className="d-block d-md-none pb-2" children="My Account" /></>}>
                     <NavLink className="dropdown-item"
                        path={"/MyAccount"}
                        displayName="Account" />
                     <NavLink className="dropdown-item"
                        path={"/MyAddresses"}
                        displayName="Addresses" />
                     <NavLink className="dropdown-item"
                        path={"/MyOrders"}
                        displayName="My Orders" />
                     <a className="link-nav dropdown-item"
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
