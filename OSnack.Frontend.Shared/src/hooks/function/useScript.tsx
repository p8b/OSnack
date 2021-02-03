import { useEffect, useState } from "react";

const useScript = (url: string | null) => {
   const [isLoaded, setIsLoaded] = useState(false);
   useEffect(() => {
      const script = document.createElement('script');
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
