import React, { createContext, useMemo, useReducer, useEffect } from "react";

class ShopState {
   //shopCategoryFilter = GetAllRecords;
}

const localStorageName = "ShopState";
export const initState = new ShopState();
const initShopContext = { shopState: initState, setShopState: (state: ShopState) => { } };

const reducerShop = (state: any, newState: any) => {
   if (newState === null) {
      localStorage.removeItem(localStorageName);
      return initState;
   }
   return { ...state, ...newState };
};

const localShopState = () => {
   const localValue = localStorage.getItem(localStorageName);
   if (localValue == null) {
      return undefined;
   } else {
      return JSON.parse(localValue);
   }
};

export const ShopContext = createContext(initShopContext);


const ShopContextContainer = ({ children }: Props): JSX.Element => {
   const [shopState, setShopState] = useReducer(reducerShop, localShopState() || initState);

   const shopProvider = useMemo(() => ({ shopState, setShopState }), [shopState, setShopState]);

   useEffect(() => {
      localStorage.setItem(localStorageName, JSON.stringify(shopState));
   }, [shopState]);

   return (
      <ShopContext.Provider value={shopProvider}>
         {children}
      </ShopContext.Provider >
   );
};
export default ShopContextContainer;


type Props = {
   children: React.ReactNode;
};