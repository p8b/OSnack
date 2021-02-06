import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ShopContext } from '../../_core/Contexts/shopContext';

const CartIcon = (props: IProps) => {
   const history = useHistory();
   const basket = useContext(ShopContext);
   const [totalItems, setTotalItems] = useState(0);
   useEffect(() => {
      setTotalItems(basket.getTotalItems());
   }, [basket.list]);
   return (
      <div className="nav-cart ">
         <button type="button" name="cart" aria-label="cart"
            className={`cart-icon btn-no-style`}
            onClick={() => { history.push("/Checkout"); }}
            children={""}
         />
         <span onClick={() => { history.push("/Checkout"); }}>
            <span>{totalItems <= 99 ? totalItems : "99+"}</span>
         </span>
      </div>
   );
};

declare type IProps = {
};
export default CartIcon;
