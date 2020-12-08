import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const CartIcon = (props: IProps) => {

   const history = useHistory();
   useEffect(() => {
   }, []);
   return (
      <button type="button" name="toggler"
         className={`nav-cart cart-icon btn-no-style`}
         onClick={() => { history.push("/Checkout"); }} />
   );
};

declare type IProps = {
};
export default CartIcon;
