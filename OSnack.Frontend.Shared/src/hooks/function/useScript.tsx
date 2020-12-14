import { useEffect, useState } from "react";

const useScript = (url: string) => {
   const [isLoaded, setIsLoaded] = useState(false);
   useEffect(() => {
      const script = document.createElement('script');
      console.log(url);
      script.src = url;
      script.async = true;
      script.onload = () => { setIsLoaded(true); };


      document.body.appendChild(script);

      return () => {
         document.body.removeChild(script);
      };
   }, [url]);
   return isLoaded;
};
export default useScript;
