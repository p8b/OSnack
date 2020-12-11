
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { Coupon } from 'osnack-frontend-shared/src/_core/apiModels';
import React, { useEffect, useState } from 'react';
const BasketCoupon = (props: IProps) => {
   const couponCheck = () => { };
   return (
      <div className="row col-12 m-0 p-0 pb-3 ">
         <Input label="Discount Code"
            value={props.coupon.code}
            onChange={i => props.setCoupon({ ...props.coupon, code: i.target.value })}
            className="col-8 mb-0 p-0 " />
         <div className="row col-4 m-0 p-0 mt-auto">
            <Button className="col-12 btn-sm btn-blue radius-none m-0"
               onClick={couponCheck} children="Apply" />
         </div>
      </div>
   );
};


declare type IProps = {
   coupon: Coupon;
   setCoupon: (coupon: Coupon) => void;
};
export default BasketCoupon;
