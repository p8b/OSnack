import React from 'react';
import { Order } from 'osnack-frontend-shared/src/_core/apiModels';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import OrderDetails from 'osnack-frontend-shared/src/components/OrderDetails/OrderDetails';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';



const OrderModal = (props: IProps) => {


   return (
      <Modal className="col-11 col-sm-10 col-lg-8 pm-0 pl-4 pr-4 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <>
            <PageHeader title="Order Details" />
            <div className="row  mt-1">
               <OrderDetails order={props.order} />
               {/***** buttons ****/}
               <div className="row col-12 pm-0 pos-b-sticky bg-white pb-3">
                  <Button children="Cancel"
                     className={`col-12 mt-2 btn-white btn-lg col-sm-6"}`}
                     onClick={() => { props.onClose(); }} />
               </div>
            </div >
         </>
      </Modal >

   );

};

declare type IProps = {
   order: Order;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;
};
export default OrderModal;
