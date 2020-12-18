import { OrderItem, Product } from "osnack-frontend-shared/src/_core/apiModels";
import React, { createContext, useReducer, useEffect, useRef } from "react";

class ShopState {
   List: OrderItem[] = [];
}

const localStorageName = "ShopState";
export const initState = new ShopState();
const initShopContext = {
   state: initState,
   //set: (state: ShopState) => { },
   set: (product: Product, quantity: number) => { },
   updateOrderItem: (orderItem: OrderItem, quantity?: number) => { },
   getQuantity: function (product: Product): number | undefined { return undefined; },
   clear: () => { },
   getTotalItems: function (): number { return 0; }
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
   const isCleared = useRef(false);

   const set = (product: Product, quantity: number) => {
      var _State = state;
      //_State.List = [];
      let isFound = false;
      for (var i = 0; i < state.List?.length; i++) {
         if (state.List[i].productId === product.id) {
            isFound = true;
            _State.List[i].quantity = quantity;
            break;
         }
      }
      if (!isFound)
         _State.List.push(convertProductToOrderItem(product, quantity));
      _State.List = _State.List.filter(oi => oi.quantity > 0).reverse();
      setState(_State);
      isCleared.current = false;
   };
   const updateOrderItem = (orderItem: OrderItem, quantity?: number) => {
      var _State = state;
      if (quantity != undefined)
         orderItem.quantity = quantity;
      for (var i = 0; i < state.List?.length; i++) {
         if (state.List[i].productId === orderItem.productId) {

            _State.List[i] = orderItem;
            break;
         }
      }
      _State.List = _State.List.filter(oi => oi.quantity > 0);
      setState(_State);
      isCleared.current = false;
   };

   const convertProductToOrderItem = (product: Product, quantity: number) => {
      var item = new OrderItem();
      item.name = product.name;
      item.price = product.price;
      item.productCategoryName = product.category.name;
      item.productId = product.id;
      item.unitQuantity = product.unitQuantity;
      item.unitType = product.unitType;
      item.quantity = quantity;
      item.imagePath = product.imagePath;
      return item;
   };

   const getQuantity = (product: Product) => {
      const item = state.List?.find(p => p.productId === product.id);

      if (item != undefined)
         return item.quantity;
      return undefined;
   };
   const clear = () => {
      if (!isCleared.current) {
         setState(initState);
         isCleared.current = true;
      }
   };

   const getTotalItems = () => {
      let totalItem = 0;
      state.List.map((orderItem) => {
         totalItem += orderItem.quantity;
      });
      return totalItem;
   };

   useEffect(() => {
      localStorage.setItem(localStorageName, JSON.stringify(state));
   }, [state]);

   return (
      <ShopContext.Provider value={{ state, set, getQuantity, clear, getTotalItems, updateOrderItem }}>
         {children}
      </ShopContext.Provider >
   );
};
export default ShopContextContainer;


type Props = {
   children: React.ReactNode;
};
