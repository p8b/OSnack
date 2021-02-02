import { useEffect, useState } from "react";

const useScript = (url: string) => {
   const [isLoaded, setIsLoaded] = useState(false);
   const [currentUrl, setCurrentUrl] = useState(url);
   useEffect(() => {
      const script = document.createElement('script');
      if (currentUrl !== "") {
         script.src = currentUrl;
         script.async = true;
         script.onload = () => { setIsLoaded(true); };
         document.body.appendChild(script);
      }
      //else {
      //   setIsLoaded(false);
      //}
      return () => {
         if (currentUrl !== "")
            document.body.removeChild(script);
         setIsLoaded(false);

      };
   }, [currentUrl]);

   const set = (url: string) => {
      setCurrentUrl(url);
   };
   return { isLoaded, set };
};
export default useScript;
