import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ShopContext } from '../../_core/shopContext';

const CartIcon = (props: IProps) => {
   const history = useHistory();
   const basket = useContext(ShopContext);
   useEffect(() => {
   }, []);
   return (
      <>
         {
            basket.state.List.length > 0 &&
            <div className="nav-cart ">
               <button type="button" name="toggler"
                  className={`cart-icon btn-no-style`}
                  onClick={() => { history.push("/Checkout"); }}
                  children={""}
               />
               <span>{basket.state.List.length}</span>
            </div>
         }
      </>
   );
};

declare type IProps = {
};
export default CartIcon;
