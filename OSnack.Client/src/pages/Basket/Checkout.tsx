import React, { useContext, useEffect, useRef, useState } from 'react';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { ShopContext } from '../../_core/shopContext';
import InputDropDown from 'osnack-frontend-shared/src/components/Inputs/InputDropDown';
import { Address, Coupon, CouponType, DeliveryOption, Order, Order2 } from 'osnack-frontend-shared/src/_core/apiModels';
import { useAllDeliveryOption } from 'osnack-frontend-shared/src/hooks/PublicHooks/useDeliveryOptionHook';
import { useAllAddress } from 'osnack-frontend-shared/src/hooks/OfficialHooks/useAddressHook';
import { usePostOrder, useVerifyOrderOrder } from 'osnack-frontend-shared/src/hooks/PublicHooks/useOrderHook';
import { AuthContext } from 'osnack-frontend-shared/src/_core/authenticationContext';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { useDetectOutsideClick } from 'osnack-frontend-shared/src/hooks/function/useDetectOutsideClick';
import AddressModal from '../MyAccount/AddressModal';
import BasketCoupon from './BasketCoupon';
import PaymentModal from './PaymentModal';
import useScript from 'osnack-frontend-shared/src/hooks/function/useScript';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Link, Redirect } from 'react-router-dom';

const Checkout = (props: IProps) => {
   const clientID = "AUc_fJXtMhI3ugArGsxZur6ej0GP4Pb_usigBXwK9qvtUKByaJWEf7HNrUBSMHaYSiBq6Cg5nOf4_Tq_";
   const paypalScript = useScript(`https://www.paypal.com/sdk/js?client-id=${clientID}&currency=GBP&intent=capture&commit=false`);

   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const auth = useContext(AuthContext);
   const basket = useContext(ShopContext);
   const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
   const [isOrderCompleted, setIsOrderCompleted] = useState(false);
   const paymentModalRef = React.createRef<HTMLDivElement>();
   const [isOpenPayementModal, setIsOpenPayementModal] = useDetectOutsideClick([paymentModalRef], false);

   const [addressList, setAddressList] = useState<Address[]>([]);
   const [selectAddress, setSelectAddress] = useState(new Address());
   const [deliveryOptionList, setDeliveryOptionList] = useState<DeliveryOption[]>([]);
   const [availableDeliveryList, setAvailableDeliveryList] = useState<DeliveryOption[]>([]);

   const [order, setOrder] = useState(new Order());

   const [paypalOrder, setPaypalOrder] = useState(new Order2());

   useEffect(() => {
      getDeliveryOptionAndAddresses();
      return () => { isUnmounted.current = true; };
   }, []);
   useEffect(() => { getDeliveryOptionAndAddresses(); }, [auth.state.isAuthenticated]);
   useEffect(() => {
      if (props.refresh) {
         recalculateBasket(deliveryOptionList, order.deliveryOption);
         props.setRefresh(false);
      }
   }, [props.refresh]);
   useEffect(() => {
      setOrder(prev => { return { ...prev, addressId: selectAddress.id || 0 }; });
   }, [selectAddress]);

   const getDeliveryOptionAndAddresses = () => {

      errorAlert.PleaseWait(500, isUnmounted);
      if (auth.state.isAuthenticated) {
         useAllAddress().then(result => {
            if (isUnmounted.current) return;
            setAddressList(result.data);
            setSelectAddress(result.data.find(t => t.isDefault == true) || new Address());
         }).catch(errors => { if (isUnmounted.current) return; errorAlert.set(errors); });
      }
      useAllDeliveryOption().then(result => {
         if (isUnmounted.current) return;
         recalculateBasket(result.data);
      }).catch(errors => { if (isUnmounted.current) return; errorAlert.set(errors); });
   };
   const recalculateBasket = (deliveryOptionList: DeliveryOption[],
      selectDeliveryOption?: DeliveryOption, selectCoupon?: Coupon) => {
      let totalDiscount = 0;
      let totalItemPriceTemp = 0;
      /// Calculate the Total item price
      basket.state.List.map(orderItem => {
         totalItemPriceTemp += (orderItem.quantity * orderItem.price);
      });
      let removeCoupon = false;
      if (selectCoupon == undefined) {
         selectCoupon = order.coupon;
      }

      /// Decide the effect of the coupn on checkout
      switch (selectCoupon?.type) {
         case CouponType.FreeDelivery:
            if (selectDeliveryOption?.isPremitive) {
               errorAlert.clear();
               selectDeliveryOption = deliveryOptionList.find(d => d.price > 0 && d.minimumOrderTotal == 0 && d.isPremitive) || new DeliveryOption();
               if (totalItemPriceTemp < selectCoupon?.minimumOrderPrice!) {
                  errorAlert.setSingleWarning("Coupon invalid", `Minimum total price must be higher than £${selectCoupon.minimumOrderPrice}`);
                  totalDiscount = 0;
               }
               else {
                  totalDiscount = selectDeliveryOption.price;
               }
            }
            else {
               removeCoupon = true;
               totalDiscount = 0;
            }
            break;
         case CouponType.DiscountPrice:
            totalDiscount = selectCoupon?.discountAmount!;
            break;
         case CouponType.PercentageOfTotal:
            const discountPercentage = selectCoupon?.discountAmount || 0;
            totalDiscount = (((discountPercentage * (totalItemPriceTemp || 0)) / 100)?.toFixed(2) as unknown as number || 0);
            break;
         default:
            totalDiscount = 0;
            break;
      }

      let availableDeliveryOptionList: DeliveryOption[] = [];
      let shippingPrice = 0;
      /// if free delivery is available 
      if (deliveryOptionList.find(o => o.price == 0 && o.minimumOrderTotal > 0 && o.isPremitive) &&
         totalItemPriceTemp > (deliveryOptionList.find(o => o.price == 0 && o.minimumOrderTotal > 0 && o.isPremitive)!.minimumOrderTotal)) {
         if (selectDeliveryOption == undefined || selectDeliveryOption.isPremitive) {
            selectDeliveryOption = deliveryOptionList.find(d => d.price == 0 && d.minimumOrderTotal > 0 && d.isPremitive)!;
            shippingPrice = selectDeliveryOption.price;
            availableDeliveryOptionList.push(selectDeliveryOption);

         } else {
            shippingPrice = selectDeliveryOption.price;
            availableDeliveryOptionList.push(deliveryOptionList.find(d => d.price == 0 && d.minimumOrderTotal > 0 && d.isPremitive)!);
         }
      }
      else {
         if (selectDeliveryOption == undefined || selectDeliveryOption?.isPremitive) {

            if (selectDeliveryOption?.price == 0 && selectDeliveryOption?.minimumOrderTotal == 0) {   //if free coupon used in order

               shippingPrice = 0;
               selectDeliveryOption.price = deliveryOptionList.find(d => d.price != 0 && d.minimumOrderTotal == 0 && d.isPremitive)!.price;
            }
            else
               selectDeliveryOption = deliveryOptionList.find(d => d.price != 0 && d.minimumOrderTotal == 0 && d.isPremitive)!;
            shippingPrice = selectDeliveryOption.price;
            availableDeliveryOptionList.push(selectDeliveryOption);
         } else {
            shippingPrice = selectDeliveryOption.price;
            availableDeliveryOptionList.push(deliveryOptionList.find(d => d.price != 0 && d.minimumOrderTotal == 0 && d.isPremitive)!);
         }
      }
      deliveryOptionList.filter(d => !d.isPremitive).map(delivery => {
         availableDeliveryOptionList.push(delivery);
      });


      setAvailableDeliveryList(availableDeliveryOptionList);
      setDeliveryOptionList(deliveryOptionList);
      setOrder(prev => {
         return {
            ...prev, totalPrice: (totalItemPriceTemp + shippingPrice - totalDiscount),
            deliveryOption: selectDeliveryOption || order.deliveryOption,
            coupon: removeCoupon ? new Coupon() : selectCoupon,
            orderItems: basket.state.List,
            totalItemPrice: totalItemPriceTemp,
            totalDiscount: totalDiscount
         };
      });
   };

   const checkout = () => {
      errorAlert.clear();
      errorAlert.PleaseWait(500, isUnmounted);
      useVerifyOrderOrder(order).then(result => {
         if (isUnmounted.current) return;
         setPaypalOrder(result.data);
         setIsOpenPayementModal(true);
         errorAlert.clear();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
   };

   const onComplete = (paypalOrderId: string) => {

      usePostOrder(paypalOrderId, order).then(result => {
         setOrder(result.data);
         setIsOrderCompleted(true);
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
         setIsOpenPayementModal(false);
      });
   };
   if (isOrderCompleted)
      return <Redirect to={{ pathname: "/OrderSuccessful", state: { order } }} />;
   return (
      <div className={props.className}>
         <div className="col-12 m-0 pos-sticky">
            <Alert className="col-12 mb-2"
               alert={errorAlert.alert}
               onClosed={() => { errorAlert.clear(); }} />
            <div className="col-12">
               {order.totalDiscount <= 0 &&
                  <BasketCoupon coupon={order.coupon || new Coupon()}
                     totalPrice={order.totalItemPrice}
                     acceptFreeCoupon={(order.deliveryOption?.price! > 0 && order.deliveryOption?.isPremitive) || false}
                     setCoupon={(val) => { recalculateBasket(deliveryOptionList, order.deliveryOption, val); errorAlert.clear(); }}
                     alert={errorAlert} />
               }

               <div className="col-12 pm-0 small-text"> Subtotal : <b>£{order.totalItemPrice?.toFixed(2)}</b></div>
               {order.totalDiscount > 0 &&
                  <div className="col-12 pm-0 pb-2 small-text"> Discount : <b>-£{parseFloat(order.totalDiscount.toString()).toFixed(2)}</b>
                     <span className="float-right edit-icon" onClick={() => { setOrder(prev => { return { ...prev, totalDiscount: 0 }; }); recalculateBasket(deliveryOptionList, order.deliveryOption, new Coupon()); }} /></div>
               }
               <DropDown title={<><span>Shipping: <b>{order.deliveryOption?.name} £{order.deliveryOption?.price?.toFixed(2)}</b></span> <span className="float-right edit-icon" /></>}
                  titleClassName="text-left small-text"
                  className="col-12 pm-0"
                  children={availableDeliveryList.map(delivery =>
                     <a className="dropdown-item p-1 text-nav" key={delivery?.name}
                        onClick={() => { recalculateBasket(deliveryOptionList, delivery); }}
                        children={<div children={`${delivery?.name} - £${delivery?.price?.toFixed(2)}`} />}
                     />)
                  } />
               <div className="h5 mb-0 pb-0"> Total : <b >£{order.totalPrice?.toFixed(2)}</b> </div>
               <p className="col-12 p-0 m-0 small-text text-gray" >Total Items: {basket.getTotalItems()}</p>
            </div>
            {auth.state.isAuthenticated &&
               <>
                  <div className="row col-12 pm-0 mt-5">
                     <InputDropDown dropdownTitle={selectAddress.name || "My Addresses"}
                        className="col-12  align-self-end "
                        label="Shipping Address"
                        children={
                           <div className="p-0 m-0">
                              {addressList.map(addr =>
                                 <a className="dropdown-item text-nav" key={addr.id}
                                    onClick={() => { setSelectAddress(addr); }}
                                    children={<div className="col" children={`${addr.name}`} />}
                                 />)
                              }
                              <a className="dropdown-item text-nav" key="newAddress"
                                 children='New Address'
                                 onClick={() => {
                                    setSelectAddress(new Address());
                                    setIsOpenAddressModal(true);
                                 }} />
                           </div>
                        } />
                     <div className="col-10 pm-0">
                        <div className="col-12 line-limit-2" children={selectAddress.firstLine} key="FirstLine_Checkout" />
                        <div className="col-12 line-limit-2" children={selectAddress.secondLine} key="SecondLine_Checkout" />
                        <div className="col-12 line-limit-1" children={selectAddress.city} key="City_Checkout" />
                        <div className="col-12 line-limit-1" children={selectAddress.postcode} key="Postcode_Checkout" />
                     </div>
                     {(selectAddress.id || 0) > 0 &&
                        <Button className="col-2 col-md-1 btn-sm edit-icon  mb-auto ml-auto"
                           onClick={() => { setIsOpenAddressModal(true); }} />
                     }
                     <Button className="col-12 btn-lg btn-green mb-4 mt-4" children="Checkout" onClick={checkout} />
                  </div>
               </>
            }
            {!auth.state.isAuthenticated &&
               <>
                  <Link className="col-12 btn btn-lg btn-green mb-4 mt-4" children="Login" to={{ pathname: "/Login", state: { fromPath: "/Checkout" } }} />
                  <PageHeader title="OR" />

                  <Button className="col-12 btn-lg btn-green mb-4 mt-4" children="Guest Checkout" onClick={checkout} />
               </>
            }
            <div className="row justify-content-center">
               <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/cc-badges-ppcmcvdam.png" alt="Pay with PayPal Credit or any major credit card" />
            </div>
         </div>
         {/***** Add/ modify category modal  ****/}
         {auth.state.isAuthenticated &&
            <AddressModal isOpen={isOpenAddressModal}
               onSuccess={(address) => {
                  useAllAddress().then(result => {
                     setAddressList(result.data);
                  }).catch(alert => errorAlert.set(alert));
                  setSelectAddress(address);
               }}
               address={selectAddress}
               onClose={() => {
                  if (selectAddress.id == 0)
                     setSelectAddress(addressList.find(a => a.isDefault) || new Address());
                  setIsOpenAddressModal(false);
               }} />
         }
         {paypalScript.isLoaded &&
            <PaymentModal isOpen={isOpenPayementModal}
               setIsOpen={setIsOpenPayementModal}
               ref={paymentModalRef} paypalOrder={paypalOrder}
               onCompelete={onComplete}
               onError={errorAlert.set} />
         }
      </div>
   );
};

declare type IProps = {
   refresh: boolean;
   setRefresh: (refresh: boolean) => void;
   className: string;
};
export default Checkout;
