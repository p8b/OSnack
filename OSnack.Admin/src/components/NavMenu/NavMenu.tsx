import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { DefaultNav, LoginNav } from "./NavMenuItems";
import { AuthenticationContext } from "osnack-frontend-shared/src/_core/Contexts/authenticationContext";
import { useLogoutAuthentication } from "osnack-frontend-shared/src/hooks/OfficialHooks/useAuthenticationHook";
import DropDown from "osnack-frontend-shared/src/components/Buttons/DropDown";
import NavLink from "osnack-frontend-shared/src/components/Buttons/NavLink";
import Footer from "../Footer";
import { extractUri } from "osnack-frontend-shared/src/_core/appFunc";
import { Toggler } from "osnack-frontend-shared/src/components/Inputs/Toggler";
import { usePutMaintenance, useGetMaintenance } from "../../SecretHooks/useMaintenanceHook";
import { NotificationContext } from "osnack-frontend-shared/src/_core/Contexts/notificationContext";

// Navigation menu component
const NavMenu = (props: IProps) => {
   const auth = useContext(AuthenticationContext);
   const [currentNavItems, setCurrentNavItems] = useState(DefaultNav);
   const [maintenanceIsOn, setMaintenanceIsOn] = useState(false);
   const history = useHistory();
   const breakSize = 768;
   const notificationCtx = useContext(NotificationContext);

   useEffect(() => {
      if (window.innerWidth > breakSize && extractUri()[0] != "Login")
         props.mainContainerToggler(true);
      useGetMaintenance().then(result => {
         setMaintenanceIsOn(result.data);
      }).catch(err => { });
   }, []);

   useEffect(() => {
      /// Check which menu items to show for the user
      if (auth.isAuthenticated)
         setCurrentNavItems(LoginNav);
      else
         setCurrentNavItems(DefaultNav);
   }, [auth.isAuthenticated]);

   const setMaintenanceMode = (val: boolean) => {
      usePutMaintenance(!val).then(result => {
         setMaintenanceIsOn(result.data);
      }).catch(error => { });
   };
   const logout = () => {
      useLogoutAuthentication().then(() => {
         auth.set(false);
         props.mainContainerToggler(false);
         setCurrentNavItems(DefaultNav);
      });
   };

   return (
      <header>
         {auth.isAuthenticated &&
            <>
               <div id="navbar" className={`bg-white top-navbar row pm-0 pb-1  ${props.isOpenMainContainer ? "show" : "hide"}`}>
                  <button type="button"
                     className={`fas toggler-icon pl-4`}
                     onClick={() => { props.mainContainerToggler(!props.isOpenMainContainer); }} />
                  <Toggler className="toggler-lg my-auto mx-5"
                     lblValueFalse="Shop Closed"
                     lblValueTrue="Shop Open"
                     onChange={setMaintenanceMode}
                     value={!maintenanceIsOn} />
                  <DropDown className="col-auto pm-0 ml-auto " titleClassName={`user-circle-icon btn-no-style pr-3`} title={``}>
                     <button className="link-nav dropdown-item"
                        onClick={() => history.push("/MyAccount")}
                        children="My Account" />
                     <button className="link-nav dropdown-item"
                        onClick={logout}
                        children="Logout" />
                  </DropDown>
               </div>
               <nav className={`row text-center align-items-start sidenav pt-2 m-0 ${props.isOpenMainContainer ? "show" : "hide"}`}>
                  <div onClick={() => history.push("/")} className="logo-container col-12 cursor-pointer">
                     <img id="logo" alt="Logo" className="Logo" src={`/public/images/logo.png`} onDoubleClick={() => { notificationCtx.addDefualt("Hello"); }} />
                     <p className="col-12 text-dark text-center user-select-none">Management</p>
                  </div>
                  {/** user links */}
                  {currentNavItems.map((link, index) =>
                     <NavLink key={index} displayName={link.displayName} path={link.path} className="w-100" onClick={() => { if (window.innerWidth <= breakSize) props.mainContainerToggler(false); }} />
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
