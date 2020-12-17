import { useState, useEffect, RefObject } from "react";

/**
 * Hook to handle closing when clicking outside of an element
 * @param {React.node} el
 * @param {boolean} initialState
 */
export const useDetectOutsideClick = (el: (RefObject<any>)[], initialState: boolean): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
   const [isActive, setIsActive] = useState(initialState);

   useEffect(() => {
      const onClick = (e: any) => {
         let isCurrentElementOutside = true;
         for (var i = 0; i < el.length; i++) {
            if (el[i]?.current !== null && el[i]?.current.contains(e.target))
               isCurrentElementOutside = false;
         }

         if (isCurrentElementOutside)
            setIsActive(!isActive);
      };

      // If the item is active (ie open) then listen for clicks outside
      if (isActive) {
         window.addEventListener("mouseup", onClick);
      }

      return () => {
         window.removeEventListener("mouseup", onClick);
      };
   }, [isActive]);
   return [isActive, setIsActive];
};
