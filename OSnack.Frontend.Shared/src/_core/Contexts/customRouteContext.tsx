import React, { createContext, useEffect, useRef, useState } from "react";
import { Loading } from "../../components/Loading/Loading";
import { useGetMaintenance } from "../../hooks/PublicHooks/useMaintenanceHook";
import Maintenance from "../../pages/Maintenance";

export const CustomRouteContext = createContext({
   currentPath: "",
   isAuthenticationConfirmed: false,
   maintenanceIsOn: false,
   setMaintenance: (_maintenanceIsOn: boolean = false, _isUserAllowedInMaintenance: boolean = false) => { },
   setPath: (_path: string) => { },
   authenticationIsConfirmed: () => { }
});

const CustomRouteContextProvider = ({ children }: { children: React.ReactNode; }) => {
   const [currentPath, setCurrentPath] = useState("");
   const [isAuthenticationConfirmed, setIsAuthenticationConfirmed] = useState(false);
   const [content, setContent] = useState<React.ReactNode>(<Loading />);
   const [maintenanceIsOn, setMaintenanceIsOn] = useState(false);
   const isUserAllowedInMaintenance = useRef(false);

   useEffect(() => {
      useGetMaintenance().then(result => {
         setMaintenance(result.data.maintenanceModeStatus!, result.data.isUserAllowedInMaintenance!, true);
      }).catch(err => {
         setContent(<Maintenance CannotReachServer />);
      });
   }, []);

   const setMaintenance = (_maintenanceIsOn: boolean = false, _isUserAllowedInMaintenance: boolean = false, forceUpdate: boolean = false) => {
      if (forceUpdate || isUserAllowedInMaintenance.current != _isUserAllowedInMaintenance || maintenanceIsOn != _maintenanceIsOn) {
         isUserAllowedInMaintenance.current = _isUserAllowedInMaintenance;
         setMaintenanceIsOn(_maintenanceIsOn);
         if (_maintenanceIsOn && !_isUserAllowedInMaintenance) {
            setContent(<Maintenance />);
         }
         else if (!_maintenanceIsOn || _isUserAllowedInMaintenance) {
            setContent(children);
         } else {
            setContent(<Loading />);
         }
      }
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
      setMaintenance,
      setPath,
      authenticationIsConfirmed
   };
   return (
      <CustomRouteContext.Provider value={providerValue}>
         {content}
      </CustomRouteContext.Provider >
   );
};
export default CustomRouteContextProvider;
