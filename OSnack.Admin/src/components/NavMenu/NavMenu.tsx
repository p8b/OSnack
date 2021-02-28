import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { Admin, INavItem, Manager } from "./NavMenuItems";
import { AuthenticationContext } from "osnack-frontend-shared/src/_core/Contexts/authenticationContext";
import { useLogoutAuthentication } from "osnack-frontend-shared/src/hooks/OfficialHooks/useAuthenticationHook";
import DropDown from "osnack-frontend-shared/src/components/Buttons/DropDown";
import NavLink from "osnack-frontend-shared/src/components/Buttons/NavLink";
import Footer from "../Footer";
import { Toggler } from "osnack-frontend-shared/src/components/Inputs/Toggler";
import { usePutMaintenance } from "../../SecretHooks/useMaintenanceHook";
import { NotificationContext } from "osnack-frontend-shared/src/_core/Contexts/notificationContext";
import { CustomRouteContext } from "osnack-frontend-shared/src/_core/Contexts/customRouteContext";

// Navigation menu component
const NavMenu = (props: IProps) => {
   const auth = useContext(AuthenticationContext);
   const [currentNavItems, setCurrentNavItems] = useState<INavItem[]>([]);
   const history = useHistory();
   const breakSize = 768;
   const notificationCtx = useContext(NotificationContext);
   const customRouteContext = useContext(CustomRouteContext);

   useEffect(() => {
      if (window.innerWidth > breakSize && auth.isAuthenticated)
         props.mainContainerToggler(true);

   }, []);

   useEffect(() => {
      /// Check which menu items to show for the user
      if (auth.isAuthenticated) {
         if (auth.user.role.accessClaim.toLowerCase() === "admin")
            setCurrentNavItems(Admin);
         if (auth.user.role.accessClaim.toLowerCase() === "manager")
            setCurrentNavItems(Manager);
      }
   }, [auth.isAuthenticated]);

   const setMaintenanceMode = (val: boolean) => {
      usePutMaintenance(!val).then(result => {
         customRouteContext.setMaintenance(result.data, true);
      }).catch(error => { });
   };

   const logout = () => {
      useLogoutAuthentication().then(() => {
         auth.set(false);
         props.mainContainerToggler(false);
         setCurrentNavItems([]);
      });
   };

   return (
      <header>
         {auth.isAuthenticated &&
            <>
               <div id="navbar" className={`bg-white top-navbar row flex-nowrap pm-0 pb-1  ${props.isOpenMainContainer ? "show" : "hide"}`}>
                  <button type="button"
                     className={`col-auto fas toggler-icon `}
                     onClick={() => { props.mainContainerToggler(!props.isOpenMainContainer); }} />
                  <Toggler className="col-auto toggler-xlg circle m-auto px-4"
                     lblValueFalse="Shop Closed"
                     lblValueTrue="Shop Open"
                     onChange={setMaintenanceMode}
                     value={!customRouteContext.maintenanceIsOn} />
                  <DropDown className="col-auto pm-0 " titleClassName={`user-circle-icon btn-no-style pr-3`} title={``}>
                     <button className="link-nav dropdown-item my-auto"
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
