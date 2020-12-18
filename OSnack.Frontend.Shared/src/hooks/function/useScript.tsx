import { useEffect, useState } from "react";

const useScript = (url: string) => {
   const [isLoaded, setIsLoaded] = useState(false);
   useEffect(() => {
      //return () => {
      //   document.body.removeChild(script);
      //};
   }, []);
   useEffect(() => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => { setIsLoaded(true); /*console.log(`script is loaded: \n ${url}`);*/ };
      document.body.appendChild(script);
      return () => {
         document.body.removeChild(script);
      };
   }, [url]);
   return { isLoaded };
};
export default useScript;
