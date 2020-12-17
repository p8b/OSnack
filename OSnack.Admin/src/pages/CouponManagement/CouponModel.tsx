import React, { useEffect, useRef, useState } from 'react';
import { Coupon, CouponType, CouponTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import InputDropDown from 'osnack-frontend-shared/src/components/Inputs/InputDropDown';
import { DatePicker } from 'osnack-frontend-shared/src/components/Inputs/DatePicker';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import ButtonPopupConfirm from 'osnack-frontend-shared/src/components/Buttons/ButtonPopupConfirm';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import { useDeleteCoupon, usePutCoupon, usePostCoupon } from '../../SecretHooks/useCouponHook';
import { getNextDate } from 'osnack-frontend-shared/src/_core/appFunc';


const CouponModel = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [coupon, setCoupon] = useState(new Coupon());


   useEffect(() => {
      if (props.coupon.code == undefined)
         setCoupon({ ...props.coupon, expiryDate: getNextDate(31) });
      else
         setCoupon(props.coupon);
   }, [props.coupon]);

   const createProduct = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      usePostCoupon(coupon).then(result => {
         if (isUnmounted.current) return;
         setCoupon(result.data);
         props.onSuccess();
         errorAlert.clear();
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };
   const updateProduct = async () => {

      errorAlert.PleaseWait(500, isUnmounted);
      usePutCoupon(coupon).then(result => {
         if (isUnmounted.current) return;
         setCoupon(result.data);
         props.onSuccess();
         errorAlert.clear();
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });

   };

   const deleteProduct = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      useDeleteCoupon(coupon).then(() => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         props.onSuccess();
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });

   };
   return (
      <Modal className="col-11 col-sm-10 col-md-8 col-lg-6 pl-4 pr-4"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader className="col-12" title={coupon.code == undefined ? "New Coupon" : "Update Coupon"} />
         {/***** Name ****/}
         <div className="row">
            <Input label="Code*"
               value={coupon.pendigCode || coupon.code}
               disabled={(coupon.code != undefined)}
               onChange={i => { if (coupon.code == undefined) setCoupon({ ...coupon, pendigCode: i.target.value }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExist("code")}
            />

            <InputDropDown dropdownTitle={CouponTypeList.find(c => c.Value == coupon.type)?.Name || "Select Option"}
               label="Type*"
               disabled={(coupon.code != undefined)}
               showDanger={errorAlert.checkExist("type")}
               className="col-12 col-sm-6 " >
               {CouponTypeList.map(couponType =>
                  <button className="dropdown-item" key={couponType.Id}
                     onClick={() => { if (coupon.code == undefined) setCoupon({ ...coupon, type: couponType.Value }); }} >
                     {couponType.Name}
                  </button>
               )}
            </InputDropDown>
         </div>
         <div className="row">
            <Input label="Discount Amount*"
               type="number"
               disabled={!(coupon.type != CouponType.FreeDelivery)}
               positiveNumbersOnly
               value={coupon.discountAmount}
               onChange={i => { setCoupon({ ...coupon, discountAmount: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExist("discountAmount")}
            />
            <Input label="Max use quantity *"
               type="number"
               positiveNumbersOnly
               value={coupon.maxUseQuantity}
               onChange={i => { setCoupon({ ...coupon, maxUseQuantity: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExist("maxUseQuantity")}

            />
         </div>
         <div className="row">
            <Input label="Minimum Order Price*"
               type="number"
               positiveNumbersOnly
               value={coupon.minimumOrderPrice}
               onChange={i => { setCoupon({ ...coupon, minimumOrderPrice: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExist("maxUseQuantity")}

            />
            <DatePicker label="Expire Date*" className="col-12 col-sm-6" selectDate={coupon.expiryDate}
               minimumDate={getNextDate(1)}
               onChange={date => { coupon.expiryDate = date || getNextDate(31); }} />
         </div>
         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />

         {/***** buttons ****/}
         <div className="row col-12 pm-0 ">
            {coupon.code == undefined ?
               <Button children="Create"
                  className="col-12 mt-2 btn-green col-sm-6 btn-lg"
                  onClick={createProduct} />
               :
               <div className="row col-12 col-sm-8 pm-0">
                  <ButtonPopupConfirm title="Update"
                     popupMessage="Are you sure?"
                     className="col-12 mt-2 col-sm-6"
                     btnClassName="btn-green"
                     onConfirmClick={updateProduct}
                  />
                  <ButtonPopupConfirm title="Delete"
                     popupMessage="Are you sure?"
                     className="col-12 col-sm-6 mt-2"
                     btnClassName="btn-red"
                     onConfirmClick={deleteProduct}
                  />
               </div>
            }
            <Button children="Cancel"
               className={`col-12 mt-2 btn-white btn-lg ${coupon.code == undefined ? "col-sm-6" : "col-sm-4"}`}
               onClick={() => { errorAlert.clear(); props.onClose(); }} />
         </div>
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
