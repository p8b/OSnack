import React, { useEffect, useState } from 'react';

const CartIcon = (props: IProps) => {
    useEffect(() => {
    }, []);
    return (
        <button type="button" name="toggler"
            className={`nav-cart cart-icon btn-no-style`}
            onClick={() => { }} />
    );
};

declare type IProps = {
};
export default CartIcon;
