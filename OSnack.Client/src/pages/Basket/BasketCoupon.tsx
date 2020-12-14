
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { Coupon, CouponType } from 'osnack-frontend-shared/src/_core/apiModels';
import { useValidateCoupon } from 'osnack-frontend-shared/src/hooks/OfficialHooks/useCouponHook';
import React, { useEffect, useState } from 'react';
import { AlertObj, AlertTypes, ErrorDto } from 'osnack-frontend-shared/src/components/Texts/Alert';
const BasketCoupon = (props: IProps) => {
   const [code, setCode] = useState("");
   useEffect(() => { setCode(props.coupon.code); }, [props.coupon]);
   const couponCheck = () => {
      if (code == undefined) {
         props.setAlert(new AlertObj(
            [new ErrorDto("Access Denied", "Coupon code required.")],
            AlertTypes.Error));
         return;
      }
      useValidateCoupon(code).then(result => {
         if (result.data.type == CouponType.FreeDelivery && !props.acceptFreeCoupon) {
            props.setAlert(new AlertObj(
               [new ErrorDto("Access Denied", "Only apply to \"standard\" delivery.")],
               AlertTypes.Error));
            setCode("");
            return;
         }
         if (props.totalPrice < result.data.minimumOrderPrice!) {
            props.setAlert(new AlertObj(
               [new ErrorDto("Access Denied", `Minimum total price must be higher than £${result.data.minimumOrderPrice!}`)],
               AlertTypes.Error));
            setCode("");
            return;
         }
         props.setCoupon(result.data);

      })
         .catch(alert => props.setAlert(alert));
   };
   return (
      <div className="row col-12 m-0 p-0 pb-3 ">
         <Input label="Discount Code"
            value={code}
            onChange={i => setCode(i.target.value)}
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
   acceptFreeCoupon: boolean;
   totalPrice: number;
   setCoupon: (coupon: Coupon) => void;
   setAlert: (alert: AlertObj) => void;
};
export default BasketCoupon;
