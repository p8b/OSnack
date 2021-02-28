import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import { Order2 } from 'osnack-frontend-shared/src/_core/apiModels';
import React, { RefObject, useState } from 'react';
import { AlertObj } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Loading } from 'osnack-frontend-shared/src/components/Loading/Loading';

const PaymentModal = (props: IProps) => {

   // @ts-ignore
   const PayPalButton = paypal.Buttons.driver("react", {
      // @ts-ignore
      React, ReactDOM,
      style: {
         layout: 'horizontal',
         fundingicons: 'true',
      },
   });

   const [isLoading, setIsLoading] = useState(false);

   const createOrder = (data: any, action: any) => {
      return action.order.create(props.paypalOrder);

   };
   const onApprove = (data: any, action: any) => {
      props.onCompelete(data.orderID);
      setIsLoading(true);
   };

   return (
      <Modal isOpen={isLoading ? true : props.isOpen}
         bodyRef={props.ref}
         className="col-12 col-sm-10 col-md-7 col-lg-4 pm-0">
         {!isLoading &&
            <div className="col-12 m-0 p-3">
               <Button className="col-12 btn-white btn-lg mb-3" children="Cancel" onClick={() => { props.setIsOpen(false); }} />
               <PayPalButton amount="10.00"
                  createOrder={(data: any, actions: any) => createOrder(data, actions)}
                  onApprove={(data: any, actions: any) => onApprove(data, actions)}
               />
            </div>
         }
         {isLoading &&
            <>
               <Loading />
               <div className="col-12 mt-3 text-center">Please wait while we proccess your payment</div>
            </>
         }
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
