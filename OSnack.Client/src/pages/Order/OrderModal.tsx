import React from 'react';
import { Order, ProductUnitType } from 'osnack-frontend-shared/src/_core/apiModels';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import { onImageError } from 'osnack-frontend-shared/src/_core/appFunc';
import { API_URL } from 'osnack-frontend-shared/src/_core/constant.Variables';


const OrderModal = (props: IProps) => {
   return (
      <Modal className="col-11 col-sm-10 col-md-8 col-lg-6 pl-4 pr-4"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title="Order Details" />

         {/***** OrderItem ****/}
         {props.order.orderItems?.map(orderItem =>
            <div className="row mt-4 mb-4">
               <div className="col-2 col-sm-5">
                  <img className="shop-card-img" onError={onImageError.Product}
                     src={`${API_URL}/${orderItem.imagePath}`} alt={name} />
               </div>
               <div className="row col-10 col-sm-7">
                  <div className="col-12 p-0 "><span className="h5">{orderItem.name}</span> ({orderItem.productCategoryName})</div>
                  <div className="col-12 p-0 h6 mb-1">£{orderItem.price} ({orderItem.unitQuantity} {ProductUnitType[orderItem.unitType]}) :  <b>£{(orderItem.price * orderItem.quantity).toFixed(2)}</b></div>
                  <div className="row text-left ml-2">Quantity: <p className="m-0 p-0 ml-1"
                     children={`£${orderItem.quantity}`} /> </div>
               </div>
            </div>
         )}
         {/***** buttons ****/}
         <div className="row col-12 p-0 m-0 ">
            <Button children="Cancel"
               className={`col-12 mt-2 btn-white btn-lg col-sm-6"}`}
               onClick={() => { props.onClose(); }} />
         </div>
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
