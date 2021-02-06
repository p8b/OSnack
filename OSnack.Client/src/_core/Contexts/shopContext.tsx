import { OrderItem, Product } from "osnack-frontend-shared/src/_core/apiModels";
import { CopyObject, localStorageManagement } from "osnack-frontend-shared/src/_core/appFunc";
import React, { createContext, useEffect, useRef, useState } from "react";

interface IShopContext {
   list: OrderItem[],
   set: (product: Product, quantity: number) => void,
   updateOrderItem: (orderItem: OrderItem, quantity?: number) => void,
   getQuantity: (product: Product) => number | undefined,
   clear: () => void,
   getTotalItems: () => number;
}

export const ShopContext = createContext({
   list: [],
   set: (product: Product, quantity: number) => { },
   updateOrderItem: (orderItem: OrderItem, quantity?: number) => { },
   getQuantity: (product: Product) => undefined,
   clear: () => { },
   getTotalItems: () => 0
} as IShopContext);


const ShopContextContainer = ({ children }: Props): JSX.Element => {
   const [list, setList] = useState<OrderItem[]>([]);
   const isCleared = useRef(false);
   const localStorageName = "ShopState";

   useEffect(() => {
      try {

         var _list = JSON.parse(localStorageManagement.GET(localStorageName)) as OrderItem[];
         if (_list.length > 0)
            _list[0].name;
         setList(_list || []);
      } catch {
         setList([]);
      }
   }, []);

   useEffect(() => {
      localStorageManagement.SET(localStorageName, JSON.stringify(list));
   }, [list]);

   const set = (product: Product, quantity: number) => {
      var _list = CopyObject(list);
      let isFound = false;
      for (var i = 0; i < list?.length; i++) {
         if (list[i].productId === product.id) {
            isFound = true;
            _list[i].quantity = quantity;
            break;
         }
      }
      if (!isFound)
         _list.push(convertProductToOrderItem(product, quantity));
      _list = _list.filter(oi => oi.quantity > 0).reverse();
      setList(_list);
      isCleared.current = false;
   };
   const updateOrderItem = (orderItem: OrderItem, quantity?: number) => {
      var _list = CopyObject(list);
      if (quantity != undefined)
         orderItem.quantity = quantity;
      for (var i = 0; i < list?.length; i++) {
         if (list[i].productId === orderItem.productId) {
            _list[i] = orderItem;
            break;
         }
      }
      _list = _list.filter(oi => oi.quantity > 0);
      setList(_list);
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
      const item = list?.find(p => p.productId === product.id);

      if (item != undefined)
         return item.quantity;
      return undefined;
   };
   const clear = () => {
      if (!isCleared.current) {
         setList([]);
         isCleared.current = true;
      }
   };

   const getTotalItems = () => {
      let totalItem = 0;
      list.map((orderItem) => {
         totalItem += orderItem.quantity * 1;
      });
      return totalItem;
   };
   return (
      <ShopContext.Provider value={{ list, set, getQuantity, clear, getTotalItems, updateOrderItem }}>
         {children}
      </ShopContext.Provider >
   );
};
export default ShopContextContainer;


type Props = {
   children: React.ReactNode;
};
