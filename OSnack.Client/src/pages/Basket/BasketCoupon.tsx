
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { Coupon, CouponType } from 'osnack-frontend-shared/src/_core/apiModels';
import { useValidateCoupon } from 'osnack-frontend-shared/src/hooks/PublicHooks/useCouponHook';
import React, { useEffect, useRef, useState } from 'react';
import { IUseAlertReturn } from 'osnack-frontend-shared/src/components/Texts/Alert';
const BasketCoupon = (props: IProps) => {
   const isUnmounted = useRef(false);
   const [code, setCode] = useState("");
   useEffect(() => { setCode(props.coupon.code); return () => { isUnmounted.current = true; }; }, []);
   const couponCheck = (loadingCallBack?: () => void) => {
      if (code == undefined || code == "") {
         props.alert.setSingleError("Access Denied", "Coupon code required.");
         setCode("");
         loadingCallBack!();
         return;
      }
      props.alert.pleaseWait(isUnmounted);
      useValidateCoupon(code).then(result => {
         if (isUnmounted.current) return;
         if (result.data.type == CouponType.FreeDelivery && !props.acceptFreeCoupon) {
            props.alert.setSingleError("Access Denied", "Only apply to \"standard\" delivery.");
            return;
         }
         if (props.totalPrice < result.data.minimumOrderPrice!) {
            props.alert.setSingleError("Access Denied", `Minimum total price must be higher than £${result.data.minimumOrderPrice!}`);
            setCode(result.data.code);
            return;
         }
         props.setCoupon(result.data);
         loadingCallBack!();
      }).catch(errors => {
         if (isUnmounted.current) return;
         props.alert.set(errors);
         loadingCallBack!();
      });
   };
   return (
      <div className="row col-12 pm-0 pb-2">
         <Input placeholder="Discount Code"
            value={code}
            onChange={i => setCode(i.target.value)}
            className="col-8 mb-0 p-0 " />
         <div className="row col-4 pm-0 mt-auto">
            <Button className="col-12 btn-sm btn-blue radius-none m-0"
               onClick={couponCheck} children="Apply" enableLoading={isUnmounted} />
         </div>
      </div>
   );
};


declare type IProps = {
   coupon: Coupon;
   acceptFreeCoupon: boolean;
   totalPrice: number;
   setCoupon: (coupon: Coupon) => void;
   alert: IUseAlertReturn;
};
export default BasketCoupon;
