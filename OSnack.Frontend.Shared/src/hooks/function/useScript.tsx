import { useEffect, useState } from "react";

const useScript = (url: string) => {
   const [isLoaded, setIsLoaded] = useState(false);
   useEffect(() => {
      const script = document.createElement('script');
      console.log(url);
      if (url != "") {

         //script.setAttribute("data-order-id", orderId);
         //script.setAttribute("data-page-type", "cart");
         script.src = url;
         script.async = true;
         script.onload = () => { setIsLoaded(true); };


         document.body.appendChild(script);
      }

      //return () => {
      //   document.body.removeChild(script);
      //};
   }, [url]);
   return isLoaded;
};
export default useScript;
