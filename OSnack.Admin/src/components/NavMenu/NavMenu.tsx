import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { DefaultNav, LoginNav } from "./NavMenuItems";
import { AuthContext } from "osnack-frontend-shared/src/_core/authenticationContext";
import { useLogoutAuthentication } from "osnack-frontend-shared/src/hooks/OfficialHooks/useAuthenticationHook";
import { User } from "osnack-frontend-shared/src/_core/apiModels";
import DropDown from "osnack-frontend-shared/src/components/Buttons/DropDown";
import NavLink from "osnack-frontend-shared/src/components/Buttons/NavLink";
import Footer from "../Footer";
import { extractUri } from "osnack-frontend-shared/src/_core/appFunc";

// Navigation menu component
const NavMenu = (props: IProps) => {
   const auth = useContext(AuthContext);
   const [currentNavItems, setCurrentNavItems] = useState(DefaultNav);
   const history = useHistory();

   useEffect(() => {
      if (window.innerWidth > 768 && extractUri(window.location.pathname)[0] != "Login")
         props.mainContainerToggler(true);
   }, []);

   const logout = async () => {
      await useLogoutAuthentication().then(() => {
         auth.setState({ isAuthenticated: false, user: new User() });
         props.mainContainerToggler(false);
         setCurrentNavItems(DefaultNav);
      });
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
         {auth.state.isAuthenticated &&
            <>
               <div id="navbar" className={`bg-white top-navbar row pm-0 pb-1  ${props.isOpenMainContainer ? "show" : "hide"}`}>
                  <button type="button"
                     className={`fas toggler-icon pl-4`}
                     onClick={() => { props.mainContainerToggler(!props.isOpenMainContainer); }} />
                  <DropDown className="ml-auto " titleClassName={`user-circle-icon btn-no-style pr-3`} title={``}>
                     <button className="dropdown-item"
                        onClick={() => history.push("/MyAccount")}
                        children="My Account" />
                     <button className="dropdown-item"
                        onClick={logout}
                        children="Logout" />
                  </DropDown>

               </div>
               <nav className={`row text-center align-items-start sidenav pt-2 m-0 ${props.isOpenMainContainer ? "show" : "hide"}`}>
                  <div onClick={() => history.push("/")} className="logo-container col-12 cursor-pointer">
                     <img id="logo" alt="Logo" className="Logo" src={`/public/images/logo.png`} />
                     <p className="col-12 text-dark text-center user-select-none">Management</p>
                  </div>
                  {/** user links */}
                  {currentNavItems.map((link, index) =>
                     <NavLink key={index} displayName={link.displayName} path={link.path} className="w-100" />
                  )}
                  <Footer />
               </nav>
            </>
         }
      </header >
   );
};

declare type IProps = {
   mainContainerToggler: (isOpen: boolean) => void;
   isOpenMainContainer: boolean;
};
export default NavMenu;
