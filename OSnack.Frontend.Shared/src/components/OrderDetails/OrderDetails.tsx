import React from 'react';
import { Order, OrderStatusType, ProductUnitType } from '../../_core/apiModels';
import PageHeader from '../../components/Texts/PageHeader';
import { Button } from '../../components/Buttons/Button';
import { onImageError } from '../../_core/appFunc';
import { API_URL } from '../../_core/constant.Variables';


const OrderDetails = (props: IProps) => {

   const getTotalItemsCount = () => {
      var totalCount = 0;
      props.order.orderItems?.map(orderItems => {
         totalCount += orderItems.quantity;
      });
      return totalCount;

   };

   return (
      <>
         {/***** OrderDetails ****/}
         <div className="col-12 col-sm-5">
            <div className=" pos-sticky t-0">
               <div className="pm-0">
                  <div className="col-12 p-0 font-weight-bold ">Shipping Address :</div>
                  <div className="col-12 p-0 line-limit-1">{props.order.name}</div>
                  <div className="col-12 p-0 line-limit-2">{props.order.firstLine}</div>
                  <div className="col-12 p-0 line-limit-2">{props.order.secondLine}</div>
                  <div className="col-12 p-0 line-limit-1">{props.order.city}</div>
                  <div className="col-12 p-0">{props.order.postcode}</div>
               </div>
               <div className="row col-12 pm-0 mt-3">
                  <div className="col-8 pm-0 small-text text-gray" >Status:</div>
                  <div className="col-4 p-0 font-weight-bold">{OrderStatusType[props.order.status]}</div>
               </div>
               <div className="row col-12  pm-0">
                  <div className="col-8 pm-0 small-text text-gray">Payment date :</div>
                  <div className="col-4 p-0">{new Date(props.order.date!).ToShortDate()}</div>
               </div>

               <div className="row col-12 pm-0 ">
                  <div className="col-8 pm-0  small-text text-gray">Subtotal :</div>
                  <div className="col-4 small-text p-0">£{props.order.totalItemPrice}</div>
               </div>

               <div className="row col-12 pm-0 ">
                  <div className="col-8 pm-0  small-text text-gray">Shippment Price:</div>
                  <div className="col-4 small-text p-0">£{props.order.deliveryOption?.price}</div>
               </div>
               {props.order.totalDiscount > 0 &&
                  <div className="row col-12 pm-0">
                     <div className="col-8 p-0 small-text text-gray">Discount Price:</div>
                     <div className="col-4 small-text p-0">£{props.order.totalDiscount}</div>
                  </div>
               }
               <div className="row col-12 pm-0">
                  <div className="col-8 p-0 pm-0 font-weight-bold ">Total Price:</div>
                  <div className="col-4 p-0 font-weight-bold">£{props.order.totalPrice}</div>
               </div>
               <span className=" col-12 pm-0 small-text text-light-gray mt-3">{props.order.payment.paymentProvider} Reference :{props.order.payment.reference}</span>



            </div>
         </div>


         {/***** OrderItem ****/}
         <div className="col-sm-7 mt-1">
            <div className="row pl-3 pr-3">
               <span className="col-12 pm-0 small-text text-gray">Basket Items:{getTotalItemsCount()}</span>
               {props.order.orderItems?.map(orderItem =>
                  <>
                     <div className="col-2 pm-0 mb-3">
                        <img className="shop-card-img" onError={onImageError.Product}
                           src={`${API_URL}/${orderItem.imagePath}`} alt={name} />
                     </div>
                     <div className="row col-10 mb-3 ">
                        <div className="col-12 "><span className="h5">{orderItem.name}</span> ({orderItem.productCategoryName}) - {orderItem.unitQuantity} {ProductUnitType[orderItem.unitType]}</div>
                        <div className="col-12 h6 mb-1">£{orderItem.price} x {orderItem.quantity} :  <b>£{(orderItem.price * orderItem.quantity).toFixed(2)}</b></div>
                     </div>
                  </>
               )}
            </div>
         </div>

      </>


   );
};

declare type IProps = {
   order: Order;
};
export default OrderDetails;
