import React, { createContext, useReducer, useEffect } from "react";

export enum CookieType {
   none = 0,
   all = 1,
   onlyNecessary = 2,
}

class CookieState {
   type: CookieType = CookieType.none;
}

const localStorageName = "CookieState";
export const initState = new CookieState();
const initCookieContext = {
   state: initState,
   set: (type: CookieType) => { },
};

const reducerCookie = (state: CookieState, newState: CookieState) => {
   if (newState === null) {
      localStorage.removeItem(localStorageName);
      return initState;
   }
   return { ...state, ...newState };
};

const localCookieType = (): CookieState => {
   const localValue = localStorage.getItem(localStorageName);
   if (localValue == null) {
      return initState;
   } else {
      return JSON.parse(localValue);
   }
};

export const CookieContext = createContext(initCookieContext);


const ShopContextContainer = ({ children }: Props): JSX.Element => {
   const [state, setState] = useReducer(reducerCookie, localCookieType());

   const set = (type: CookieType) => {
      setState({ type });
   };

   useEffect(() => {
      localStorage.setItem(localStorageName, JSON.stringify(state));
   }, [state]);

   return (
      <CookieContext.Provider value={{ state, set }}>
         {children}
      </CookieContext.Provider >
   );
};
export default ShopContextContainer;


type Props = {
   children: React.ReactNode;
};
