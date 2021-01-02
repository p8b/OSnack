import React, { useEffect, useState } from 'react';
import { Order, OrderStatusType, OrderStatusTypeList, ProductUnitType } from '../../_core/apiModels';
import { getBadgeByOrderStatusType, onImageError } from '../../_core/appFunc';
import { API_URL, ClientAppAccess } from '../../_core/constant.Variables';
import InputDropdown from '../Inputs/InputDropDown';
import Alert, { AlertObj, useAlert } from '../Texts/Alert';


const OrderDetails = (props: IProps) => {

   const errorAlert = useAlert(new AlertObj());
   const [selectedStatus, SetSelectStatus] = useState(OrderStatusType.InProgress);
   useEffect(() => {
      console.log(props.order);
      SetSelectStatus(props.order.status);
   }, [props.order]);

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
            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.clear(); }} />
            <div className=" pos-sticky t-0">
               {props.access == ClientAppAccess.Secret &&
                  <div className="col-12 p-0 font-weight-bold">
                     {props.availabeType!.length > 0 &&
                        <InputDropdown
                           dropdownTitle={<span className={`${getBadgeByOrderStatusType(selectedStatus)}`}
                              children={`${OrderStatusTypeList.find((s) => s.Value == selectedStatus)?.Name || "All"}`} />}
                           label="Status"
                           labelClassName="small-text gray-text"
                           showDanger={errorAlert.checkExistFilterRequired("status")}
                           className="col-12 pm-0" >
                           {OrderStatusTypeList.filter(o => props.availabeType!.includes(o.Value))?.map(statusType =>
                              <button className="dropdown-item" key={statusType.Id}
                                 onClick={() => { SetSelectStatus(statusType.Value); props.statusChanged!(statusType.Value); }} >
                                 <div children={statusType.Name} />
                              </button>
                           )}
                        </InputDropdown>
                     }
                  </div>
               }
               {(props.access == ClientAppAccess.Official || props.availabeType!.length == 0) &&
                  <div className="row col-12 pm-0 mt-3">
                     <div className="col-8 pm-0 small-text text-gray" >Status:</div>
                     <span className={`${getBadgeByOrderStatusType(props.order.status)}`}
                        children={OrderStatusTypeList.find(o => o.Value == props.order.status)?.Name} />
                  </div>
               }
               <div className="row col-12 pm-0 ">
                  <div className="col-8 pm-0 small-text text-gray" >Order Id :</div>
                  <div className="col-4 p-0 small-text">{props.order.id}</div>
               </div>
               <div className="row col-12 pm-0">
                  <div className="col-8 pm-0 small-text text-gray" >{props.order.payment.paymentProvider} Reference :</div>
                  <div className="col-4 p-0 small-text">{props.order.payment.reference}</div>
               </div>
               <div className="row col-12  pm-0">
                  <div className="col-8 pm-0 small-text text-gray">Payment date :</div>
                  <div className="col-4 p-0 small-text">{new Date(props.order.date!).ToShortDate()}</div>
               </div>

               <div className="row col-12 pm-0 ">
                  <div className="col-8 pm-0  small-text text-gray">Subtotal :</div>
                  <div className="col-4 small-text p-0">£{props.order.totalItemPrice}</div>
               </div>

               <div className="row col-12 pm-0 ">
                  <div className="col-8 pm-0  small-text text-gray">Shippment Price:</div>
                  <div className="col-4 small-text p-0">{props.order.shippingPrice === 0 ? "Free" : `£${props.order.shippingPrice}`}</div>
               </div>
               {props.order.totalDiscount > 0 &&
                  <div className="row col-12 pm-0">
                     <div className="col-8 p-0 small-text text-gray">Discount Price:</div>
                     <div className="col-4 small-text p-0">£{props.order.totalDiscount}</div>
                  </div>
               }
               {props.order.payment.refundAmount != 0 &&
                  <div className="row col-12 pm-0">
                     <div className="col-8 p-0 small-text text-gray">Refund Value:</div>
                     <div className="col-4 small-text p-0">£{props.order.payment.refundAmount}</div>
                  </div>
               }
               <div className="row col-12 pm-0">
                  <div className="col-8 p-0 pm-0 font-weight-bold ">Total Price:</div>
                  <div className="col-4 p-0 font-weight-bold">£{props.order.totalPrice}</div>
               </div>
               {props.access == ClientAppAccess.Official && props.order.dispute == undefined && props.order.status != OrderStatusType.Canceled &&
                  <div className="col-12 pm-0 cursor-pointer  small-text text-primary" onClick={props.onDispute}>I have issue with this order.</div>
               }

               <div className="pm-0 mt-3">
                  <div className="col-12 p-0 font-weight-bold ">Shipping Address :</div>
                  <div className="col-12 p-0 line-limit-1">{props.order.name}</div>
                  <div className="col-12 p-0 line-limit-2">{props.order.firstLine}</div>
                  <div className="col-12 p-0 line-limit-2">{props.order.secondLine}</div>
                  <div className="col-12 p-0 line-limit-1">{props.order.city}</div>
                  <div className="col-12 p-0">{props.order.postcode}</div>
               </div>

            </div>
         </div>


         {/***** OrderItem ****/}
         <div className="col-sm-7 mt-1">
            <div className="row pl-3 pr-3">
               <span className="col-12 pm-0 small-text text-gray">Basket Items:{getTotalItemsCount()}</span>
               {props.order.orderItems?.map(orderItem =>
                  <div key={orderItem.productId} className="row col-12">
                     <div className="col-2 pm-0 mb-3">
                        <img className="shop-card-img" onError={onImageError.Product}
                           src={`${API_URL}/${orderItem.imagePath}`} alt={name} />
                     </div>
                     <div className="row col-10 mb-3 ">
                        <div className="col-12 "><span className="h5">{orderItem.name}</span> ({orderItem.productCategoryName})</div>
                        <div className="col-12 small-text">{orderItem.unitQuantity} {ProductUnitType[orderItem.unitType]}</div>
                        <div className="col-12 h6 mb-1">£{orderItem.price} x {orderItem.quantity} :  <b>£{(orderItem.price * orderItem.quantity).toFixed(2)}</b></div>
                     </div>
                  </div>
               )}
            </div>
         </div>

      </>
   );
};

declare type IProps = {
   order: Order;
   access: ClientAppAccess;
   statusChanged?: (status: OrderStatusType) => void;
   availabeType?: OrderStatusType[];
   onDispute?: () => void;
};
export default OrderDetails;
