import React, { useContext, useEffect, useState } from "react";
import { CustomRouteContext } from "../../_core/Contexts/customRouteContext";

const SideNotifier = () => {
   const customRouteContext = useContext(CustomRouteContext);
   const [demoMode, setDemoMode] = useState(false);
   useEffect(() => {
      if (window.location.host.endsWith("osnack.p8b.uk"))
         setDemoMode(true);
   }, []);


   if (demoMode || customRouteContext.maintenanceIsOn)
      return (
         <div className="side-notifier">
            {demoMode && "| Demo Mode |"}
            {customRouteContext.maintenanceIsOn && "| Maintenance Mode |"}
         </div>
      );
   else
      return <></>;
};

export default SideNotifier;
