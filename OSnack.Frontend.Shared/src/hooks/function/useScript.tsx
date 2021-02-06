import { useEffect, useState } from "react";

const useScript = (url: string | null) => {
   const [isLoaded, setIsLoaded] = useState(false);
   const [script] = useState<HTMLScriptElement>(document.createElement('script'));

   useEffect(() => {
      return (() => {
         document.body.removeChild(script);
      });
   }, []);

   useEffect(() => {
      if (url !== "" && url !== null) {
         script.src = url;
         script.async = true;
         script.onload = () => { setIsLoaded(true); };
         document.body.appendChild(script);
      }
      return () => {
         if (url !== "" && url !== null)
            document.body.removeChild(script);
         setIsLoaded(false);
      };
   }, [url]);


   return { isLoaded };
};
export default useScript;
