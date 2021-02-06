import React, { createContext, useState } from "react";

export const CustomRouteContext = createContext({
   currentPath: "",
   isAuthenticationConfirmed: false,
   maintenanceIsOn: false,
   isUserAllowedInMaintenance: false,
   setMaintenance: (_isOpen: boolean = true, _isUserAllowedInMaintenance: boolean = true) => { },
   setPath: (_path: string) => { },
   authenticationIsConfirmed: () => { }
});

const CustomRouteContextProvider = ({ children }: { children: React.ReactNode; }) => {
   const [currentPath, setCurrentPath] = useState("");
   const [maintenanceIsOn, setMaintenanceIsOn] = useState(false);
   const [isUserAllowedInMaintenance, setIsUserAllowedInMaintenance] = useState(false);
   const [isAuthenticationConfirmed, setIsAuthenticationConfirmed] = useState(false);

   const setMaintenance = (_maintenanceIsOn: boolean = true, _isUserAllowedInMaintenance: boolean = false) => {
      setMaintenanceIsOn(_maintenanceIsOn);
      setIsUserAllowedInMaintenance(_isUserAllowedInMaintenance);
   };
   const setPath = (_path: string) => {
      setCurrentPath(_path);
      setIsAuthenticationConfirmed(false);
   };

   const authenticationIsConfirmed = () => {
      setIsAuthenticationConfirmed(true);
   };

   const providerValue = {
      currentPath,
      isAuthenticationConfirmed,
      maintenanceIsOn,
      isUserAllowedInMaintenance,
      setMaintenance,
      setPath,
      authenticationIsConfirmed
   };
   return (
      <CustomRouteContext.Provider value={providerValue}>
         {children}
      </CustomRouteContext.Provider >
   );
};
export default CustomRouteContextProvider;