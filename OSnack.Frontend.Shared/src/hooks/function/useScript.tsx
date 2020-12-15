import { useEffect, useState } from "react";

const useScript = (url: string) => {
   const [isLoaded, setIsLoaded] = useState(false);
   const [orderId, setOrderId] = useState("");
   useEffect(() => {
      const script = document.createElement('script');
      //  console.log(orderId);
      if (orderId != undefined && orderId != "") {
       //  script.setAttribute("data-order-id", orderId);
         //script.setAttribute("data-page-type", "cart");
         script.src = url;
         script.async = true;
         script.onload = () => { setIsLoaded(true); console.log(`script is loaded: \n ${url}`); };
         document.body.appendChild(script);
      }
      //return () => {
      //   document.body.removeChild(script);
      //};
   }, [orderId]);
   return { isLoaded, setOrderId };
};
export default useScript;
