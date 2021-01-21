import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ShopContext } from '../../_core/shopContext';

const CartIcon = (props: IProps) => {
   const history = useHistory();
   const basket = useContext(ShopContext);
   const [totalItems, setTotalItems] = useState(0);
   useEffect(() => {
      setTotalItems(basket.getTotalItems());
   }, [basket.state.List]);
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
