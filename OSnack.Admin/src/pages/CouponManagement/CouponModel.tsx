import React, { useEffect, useRef, useState } from 'react';
import { Coupon, CouponType, CouponTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import InputDropDown from 'osnack-frontend-shared/src/components/Inputs/InputDropDown';
import { DatePicker } from 'osnack-frontend-shared/src/components/Inputs/DatePicker';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import { useDeleteCoupon, usePutCoupon, usePostCoupon } from '../../SecretHooks/useCouponHook';
import { getNextDate } from 'osnack-frontend-shared/src/_core/appFunc';
import ModalFooter from 'osnack-frontend-shared/src/components/Modals/ModalFooter';

const CouponModel = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [coupon, setCoupon] = useState(new Coupon());
   const [pendingCode, setPendingCode] = useState("");

   useEffect(() => {
      return () => { isUnmounted.current = true; };
   }, []);

   useEffect(() => {
      if (props.coupon.code == undefined)
         setCoupon({ ...props.coupon, expiryDate: getNextDate(31) });
      else {
         setCoupon(props.coupon);
         setPendingCode(props.coupon.code);
      }
   }, [props.coupon]);

   const createCoupon = (loadingCallBack?: () => void) => {
      errorAlert.pleaseWait(isUnmounted);
      usePostCoupon({ ...coupon, code: pendingCode }).then(result => {
         if (isUnmounted.current) return;
         setCoupon(result.data);
         props.onSuccess();
         errorAlert.clear();
         loadingCallBack!();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
         loadingCallBack!();
      });
   };
   const updateCoupon = (loadingCallBack?: () => void) => {

      errorAlert.pleaseWait(isUnmounted);
      usePutCoupon(coupon).then(result => {
         if (isUnmounted.current) return;
         setCoupon(result.data);
         props.onSuccess();
         errorAlert.clear();
         loadingCallBack!();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
         loadingCallBack!();
      });

   };

   const deleteCoupon = (loadingCallBack?: () => void) => {
      errorAlert.pleaseWait(isUnmounted);
      useDeleteCoupon(coupon.code).then(() => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         props.onSuccess();
         loadingCallBack!();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
         loadingCallBack!();
      });

   };
   return (
      <Modal className="col-12 col-sm-11 col-md-9 col-lg-6"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader className="col-12 pm-0" title={coupon.code == undefined ? "New Coupon" : "Update Coupon"} />
         {/***** Name ****/}
         <div className="row">
            <Input label="Code*"
               value={pendingCode}
               disabled={(coupon.code != undefined)}
               onChange={i => { if (coupon.code == undefined) setPendingCode(i.target.value); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExistFilterRequired("code")}
            />

            <InputDropDown dropdownTitle={CouponTypeList.find(c => c.Value == coupon.type)?.Name || "Select Option"}
               label="Type*"
               disabled={(coupon.code != undefined)}
               showDanger={errorAlert.checkExistFilterRequired("type")}
               className="col-12 col-sm-6 " >
               {CouponTypeList.map(couponType =>
                  <button className="dropdown-item" key={couponType.Id}
                     onClick={() => { if (coupon.code == undefined) setCoupon({ ...coupon, type: couponType.Value }); }} >
                     {couponType.Name}
                  </button>
               )}
            </InputDropDown>
            <Input label="Discount Amount*"
               type="number"
               disabled={!(coupon.type != CouponType.FreeDelivery)}
               positiveNumbersOnly
               value={coupon.discountAmount}
               onChange={i => { setCoupon({ ...coupon, discountAmount: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExistFilterRequired("discountAmount")}
            />
            <Input label="Max use quantity *"
               type="number"
               positiveNumbersOnly
               value={coupon.maxUseQuantity}
               onChange={i => { setCoupon({ ...coupon, maxUseQuantity: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExistFilterRequired("maxUseQuantity")}

            />
            <Input label="Minimum Order Price*"
               type="number"
               positiveNumbersOnly
               value={coupon.minimumOrderPrice}
               onChange={i => { setCoupon({ ...coupon, minimumOrderPrice: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExistFilterRequired("minimumOrderPrice")}

            />
            <DatePicker label="Expire Date*" className="col-12 col-sm-6" selectDate={coupon.expiryDate}
               minimumDate={getNextDate(1)}
               onChange={date => { coupon.expiryDate = date || getNextDate(31); }} />
         </div>
         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />

         <ModalFooter
            onCreate={coupon.code != undefined ? undefined : createCoupon}
            onUpdate={coupon.code == undefined ? undefined : updateCoupon}
            onDelete={coupon.code == undefined ? undefined : deleteCoupon}
            enableLoadingCreate={isUnmounted}
            enableLoadingUpdate={isUnmounted}
            enableLoadingDelete={isUnmounted}
            onCancel={() => { errorAlert.clear(); props.onClose(); }} />

      </Modal >
   );
};

declare type IProps = {
   coupon: Coupon;
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
   modalRef?: any;
};
export default CouponModel;
