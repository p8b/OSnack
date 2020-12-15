
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import { Order2 } from 'osnack-frontend-shared/src/_core/apiModels';
import React, { RefObject, useEffect, useState } from 'react';
import { AlertObj } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Loading } from 'osnack-frontend-shared/src/components/Loading/Loading';



const PaymentModal = (props: IProps) => {

   // @ts-ignore
   const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
   }, []);

   const createOrder = (data: any, action: any) => {

      return action.order.create(props.paypalOrder);

   };
   const onApprove = (data: any, action: any) => {
      props.onCompelete(data.orderID);
      setIsLoading(true);
   };

   return (
      <Modal isOpen={props.isOpen}
         bodyRef={props.ref}
         className="col-4">
         {!isLoading &&
            <>
               <Button className="col-12 btn-white radius-none mb-3" children="Back" onClick={() => { props.setIsOpen(false); }} />
               <PayPalButton amount="10.00"
                  createOrder={(data: any, actions: any) => createOrder(data, actions)}
                  onApprove={(data: any, actions: any) => onApprove(data, actions)}
               />
            </>
         }
         {isLoading && <Loading />}
      </Modal>
   );
};

declare type IProps = {
   isOpen: boolean;
   setIsOpen: (isOpen: boolean) => void;
   ref: RefObject<HTMLDivElement>;
   paypalOrder: Order2;
   onCompelete: (paypalOrderId: string) => void;
   onError: (alert: AlertObj) => void;
};
export default PaymentModal;
