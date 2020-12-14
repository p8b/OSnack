
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import { PurchaseUnit } from 'osnack-frontend-shared/src/_core/apiModels';
import React, { RefObject, useEffect, useState } from 'react';



const PaymentModal = (props: IProps) => {
   // @ts-ignore
   console.log(paypal);
   // @ts-ignore
   const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

   useEffect(() => {
   }, []);

   const createOrder = (data: any, action: any) => {
      return action.order.create({
         purchase_units: props.purchase_units,
      });

   };
   const onApprove = (data: any, action: any) => {
      return action.order.capture();
   };
   return (
      <Modal isOpen={props.isOpen}
         bodyRef={props.ref}
         className="col-4">
         <Button className="col-12 btn-white radius-none mb-3" children="Back" onClick={() => { props.setIsOpen(false); }} />
         <PayPalButton amount="10.00"
            createOrder={(data: any, actions: any) => createOrder(data, actions)}
            onApprove={(data: any, actions: any) => onApprove(data, actions)}
         />
      </Modal>
   );
};

declare type IProps = {
   isOpen: boolean;
   setIsOpen: (isOpen: boolean) => void;
   ref: RefObject<HTMLDivElement>;
   purchase_units: PurchaseUnit[];
};
export default PaymentModal;
