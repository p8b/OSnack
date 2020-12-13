
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import React, { RefObject, useEffect, useState } from 'react';



const PaymentModal = (props: IProps) => {
   // @ts-ignore
   console.log(paypal);
   // @ts-ignore
   const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

   useEffect(() => {
   }, []);

   const createOrder = (data: any, action: any) => {
      console.log(data);
      console.log(action);
      // @ts-ignore
      //return actions.order.create({
      //   purchase_units: [
      //      {
      //         amount: {
      //            value: "10.01",
      //         },
      //      },
      //   ],
      //});

   };
   const onApprove = (data: any, action: any) => {

   };
   return (
      <Modal isOpen={props.isOpen}
         bodyRef={props.ref}
         className="col-4">
         <Button className="col-12 btn-white radius-none mb-3" children="Back" onClick={() => { props.setIsOpen(false); }} />
         <PayPalButton amount="10.00"
         />
      </Modal>
   );
};

declare type IProps = {
   isOpen: boolean;
   setIsOpen: (isOpen: boolean) => void;
   ref: RefObject<HTMLDivElement>;
};
export default PaymentModal;
