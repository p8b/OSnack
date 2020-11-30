import { useState, useEffect } from "react";

/**
 * Hook to handle closing when clicking outside of an element
 * @param {React.node} el
 * @param {boolean} initialState
 */
export const useDetectOutsideClick = (el: any, initialState: boolean): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
    const [isActive, setIsActive] = useState(initialState);

    useEffect(() => {
        const onClick = (e: any) => {
            // If the active element exists and is clicked outside of
            if ((el.current !== null && !el.current.contains(e.target))) {
                setIsActive(!isActive);
            }
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