import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { DefaultNav, LoginNav } from "./NavMenuItems";
import { AuthContext } from "osnack-frontend-shared/src/_core/authenticationContext";
import { useLogoutAuthentication } from "osnack-frontend-shared/src/hooks/OfficialHooks/useAuthenticationHook";
import { User } from "osnack-frontend-shared/src/_core/apiModels";
import DropDown from "osnack-frontend-shared/src/components/Buttons/DropDown";
import NavLink from "osnack-frontend-shared/src/components/Buttons/NavLink";
import Footer from "../Footer";

// Navigation menu component
const NavMenu = (props: IProps) => {
   const auth = useContext(AuthContext);
   const [isOpenSideBar, setIsOpenSideBar] = useState(true);
   const [currentNavItems, setCurrentNavItems] = useState(DefaultNav);

   const logout = async () => {
      await useLogoutAuthentication().then(() => {
         auth.setState({ isAuthenticated: false, user: new User() });
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
   useEffect(() => {
      props.mainContainerToggler(isOpenSideBar && auth.state.isAuthenticated);
   });
   return (
      <header>
         {!auth.state.isAuthenticated &&
            <div className="row col-12 pm-0 ">
               {/** Logo & toggler icon */}
               <div className="m-auto">
                  <img id="logo" alt="Logo" className="Logo pm-0" src={`/public/images/logo.png`} />
                  <p className="text-center">Management</p>
               </div>
            </div>
         }
         {auth.state.isAuthenticated &&
            <>
               <div className={`bg-white top-navbar row pm-0 pb-1  ${isOpenSideBar ? "show" : "hide"}`}>
                  <button type="button"
                     className={`fas toggler-icon pl-4`}
                     onClick={() => { setIsOpenSideBar((prevVal) => !prevVal); }} />
                  <DropDown className="ml-auto " titleClassName={`user-circle-icon btn-no-style pr-3`} title={``}>
                     <Link className="dropdown-item"
                        to="/MyAccount"
                        children="My Account" />
                     <button className="dropdown-item"
                        onClick={logout}
                        children="Logout" />
                  </DropDown>

               </div>
               <nav className={`row text-center align-items-start sidenav pt-2 m-0 ${isOpenSideBar ? "show" : "hide"}`}>
                  <Link to="/" className="logo-container col-12">
                     <img id="logo" alt="Logo" className="Logo" src={`/public/images/logo.png`} />
                     <p className="col-12 text-dark text-center">Management</p>
                  </Link>
                  {/** user links */}
                  {currentNavItems.map(link =>
                     <NavLink key={link.id} displayName={link.displayName} path={link.path} className="w-100" />
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
};
export default NavMenu;
