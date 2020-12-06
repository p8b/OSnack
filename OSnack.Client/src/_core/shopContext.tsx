import { OrderItem, Product } from "osnack-frontend-shared/src/_core/apiModels";
import React, { createContext, useReducer, useEffect } from "react";

class ShopState {
   List: OrderItem[] = [];
}

const localStorageName = "ShopState";
export const initState = new ShopState();
const initShopContext = {
   state: initState,
   //set: (state: ShopState) => { },
   set: (product: Product, quantity: number) => { },
   getQuantity: function (product: Product): number { return 0; },
   clear: () => { }
};

const reducerShop = (state: ShopState, newState: ShopState) => {
   if (newState === null) {
      localStorage.removeItem(localStorageName);
      return initState;
   }
   return { ...state, ...newState };
};

const localShopState = (): ShopState => {
   const localValue = localStorage.getItem(localStorageName);
   if (localValue == null) {
      return initState;
   } else {
      return JSON.parse(localValue);
   }
};

export const ShopContext = createContext(initShopContext);


const ShopContextContainer = ({ children }: Props): JSX.Element => {
   const [state, setState] = useReducer(reducerShop, localShopState());


   const set = (product: Product, quantity: number) => {
      clear();
      var _State = state;
      let isFound = false;
      if (_State === undefined) {
         _State = new ShopState();
         _State.List = [];
      }
      for (var i = 0; i < state.List?.length; i++) {
         if (_State.List[i].id === product.id) {
            isFound = true;
            if (quantity > 0) {
               _State.List[i] = convertProductToOrderItem(product, quantity);
            } else {
               _State.List.splice(i, 1);
            }
         }
      }
      console.log(_State);
      if (!isFound)
         _State.List.push(convertProductToOrderItem(product, quantity));
      setState(_State);
   };

   const convertProductToOrderItem = (product: Product, quantity: number) => {
      var item = new OrderItem();
      item.id = product.id;
      item.name = product.name;
      item.price = product.price;
      item.productCategoryName = product.category.name;
      item.productId = product.id;
      item.unitQuantity = product.unitQuantity;
      item.unitType = product.unitType;
      item.quantity = quantity;
      return item;
   };

   const getQuantity = (product: Product) => {
      const item = state.List?.find(p => p.id === product.id);

      if (item != undefined)
         return item.quantity;
      return 0;
   };
   const clear = () => { setState(initState); };

   useEffect(() => {
      localStorage.setItem(localStorageName, JSON.stringify(state));
   }, [state]);

   return (
      <ShopContext.Provider value={{ state, set, getQuantity, clear }}>
         {children}
      </ShopContext.Provider >
   );
};
export default ShopContextContainer;


type Props = {
   children: React.ReactNode;
};
