import React, { useContext, useEffect, useRef, useState } from 'react';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { ShopContext } from '../../_core/shopContext';
import InputDropDown from 'osnack-frontend-shared/src/components/Inputs/InputDropDown';
import { Address, Coupon, CouponType, DeliveryOption, Order } from 'osnack-frontend-shared/src/_core/apiModels';
import { useAllDeliveryOption } from 'osnack-frontend-shared/src/hooks/PublicHooks/useDeliveryOptionHook';
import { useAllAddress } from 'osnack-frontend-shared/src/hooks/OfficialHooks/useAddressHook';
import { AuthContext } from 'osnack-frontend-shared/src/_core/authenticationContext';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Login from 'osnack-frontend-shared/src/components/Login/Login';
import NewCustomerModal from '../Login/NewCustomerModal';
import { Access } from '../../_core/appConstant.Variables';
import { useDetectOutsideClick } from 'osnack-frontend-shared/src/hooks/function/useDetectOutsideClick';
import AddressModal from '../MyAccount/AddressModal';
import BasketCoupon from './BasketCoupon';
import PaymentModal from './PaymentModal';
import { useScript } from 'osnack-frontend-shared/src/_core/appFunc';

const Checkout = (props: IProps) => {
   const clientID = "AUc_fJXtMhI3ugArGsxZur6ej0GP4Pb_usigBXwK9qvtUKByaJWEf7HNrUBSMHaYSiBq6Cg5nOf4_Tq_";
   const currency = "GBP";
   const intent = "capture";
   const commit = "false";
   const [paypalLoad, setpaypalLoad] = useState(false);
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const auth = useContext(AuthContext);
   const basket = useContext(ShopContext);
   const toggleContainerModal = React.createRef<HTMLDivElement>();
   const [outsideClickModal, setOutsideClickModal] = useDetectOutsideClick(toggleContainerModal, false);
   const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);

   const paymentModalRef = React.createRef<HTMLDivElement>();
   const [isOpenPayementModal, setIsOpenPayementModal] = useDetectOutsideClick(paymentModalRef, false);

   const [addressList, setAddressList] = useState<Address[]>([]);
   const [deliveryOptionList, setDeliveryOptionList] = useState<DeliveryOption[]>([]);
   const [availableDeliveryList, setAvailableDeliveryList] = useState<DeliveryOption[]>([]);

   const [totalDiscount, setTotalDiscount] = useState(0);
   const [order, setOrder] = useState(new Order());

   useScript(`https://www.paypal.com/sdk/js?client-id=${clientID}&currency=${currency}&intent=${intent}&commit=${commit}`, () => { setpaypalLoad(true); });
   useEffect(() => { getDeliveryOptionAndAddresses(); }, [auth.state.isAuthenticated]);
   useEffect(() => {

      getDeliveryOptionAndAddresses();
      return () => {
         isUnmounted.current = true;
      };
   }, []);
   useEffect(() => {
      if (props.refresh) {
         recalculateBasket(deliveryOptionList, order.deliveryOption);
         props.setRefresh(false);
      }
   }, [props.refresh]);


   const getDeliveryOptionAndAddresses = () => {
      if (auth.state.isAuthenticated) {
         useAllAddress().then(result => {
            if (isUnmounted.current) return;
            setAddressList(result.data);
            setOrder(prev => { return { ...prev, address: result.data.find(t => t.isDefault == true) || new Address() }; });
         }).catch();
         useAllDeliveryOption().then(result => {
            if (isUnmounted.current) return;
            recalculateBasket(result.data);
         }).catch();
      }
   };

   const recalculateBasket = (deliveryOptionList: DeliveryOption[],
      selectDeliveryOption?: DeliveryOption, selectCoupon?: Coupon) => {
      let totalPriceTemp = 0;
      /// Calculate the Total item price
      basket.state.List.map(orderItem => { totalPriceTemp += (orderItem.quantity * orderItem.price); });
      let removeCoupon = false;
      if (selectCoupon == undefined) {
         selectCoupon = order.coupon;
      }
      if (selectCoupon != undefined && selectCoupon.type != CouponType.FreeDelivery && totalPriceTemp < selectCoupon?.minimumOrderPrice!) {
         removeCoupon = true;
         setTotalDiscount(0);
         selectCoupon = undefined;
      }
      /// Decide the effect of the coupn on checkout
      switch (selectCoupon?.type) {
         case CouponType.FreeDelivery:
            if (selectDeliveryOption?.isPremitive) {
               selectDeliveryOption = deliveryOptionList.find(d => d.price == 0 && d.minimumOrderTotal == 0 && d.isPremitive) || new DeliveryOption();
            }
            else {
               removeCoupon = true;
               setTotalDiscount(0);
            }
            break;
         case CouponType.DiscountPrice:
            setTotalDiscount(selectCoupon?.discountAmount || 0);
            totalPriceTemp -= (selectCoupon?.discountAmount || 0);
            break;
         case CouponType.PercentageOfTotal:
            const discountPercentage = selectCoupon?.discountAmount || 0;
            const disouctTotalTemp = (((discountPercentage * (totalPriceTemp || 0)) / 100)?.toFixed(2) as unknown as number || 0);
            setTotalDiscount(disouctTotalTemp);

            totalPriceTemp -= disouctTotalTemp;
            break;
         default:
            setTotalDiscount(0);
            break;
      }
      if (totalPriceTemp < 0) totalPriceTemp = 0;

      let availableDeliveryOptionList: DeliveryOption[] = [];

      /// if free delivery is available 
      if (deliveryOptionList.find(o => o.price == 0 && o.minimumOrderTotal > 0 && o.isPremitive) &&
         totalPriceTemp > (deliveryOptionList.find(o => o.price == 0 && o.minimumOrderTotal > 0 && o.isPremitive)!.minimumOrderTotal)) {
         if (selectDeliveryOption == undefined || selectDeliveryOption.isPremitive) {
            selectDeliveryOption = deliveryOptionList.find(d => d.price == 0 && d.minimumOrderTotal > 0 && d.isPremitive)!;
            totalPriceTemp += selectDeliveryOption.price;
            availableDeliveryOptionList.push(selectDeliveryOption);

         } else {
            totalPriceTemp += selectDeliveryOption.price;
            availableDeliveryOptionList.push(deliveryOptionList.find(d => d.price == 0 && d.minimumOrderTotal > 0 && d.isPremitive)!);
         }
      }
      else {
         if (selectDeliveryOption == undefined || selectDeliveryOption?.isPremitive) {

            if (selectDeliveryOption?.price == 0 && selectDeliveryOption?.minimumOrderTotal == 0) {   //if free coupon used in order
               setTotalDiscount(order.deliveryOption.price);
               totalPriceTemp -= order.deliveryOption.price;
               selectDeliveryOption.price = deliveryOptionList.find(d => d.price != 0 && d.minimumOrderTotal == 0 && d.isPremitive)!.price;
            }
            else
               selectDeliveryOption = deliveryOptionList.find(d => d.price != 0 && d.minimumOrderTotal == 0 && d.isPremitive)!;
            totalPriceTemp += selectDeliveryOption.price;
            availableDeliveryOptionList.push(selectDeliveryOption);
         } else {
            totalPriceTemp += selectDeliveryOption.price;
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
            ...prev, totalPrice: totalPriceTemp,
            deliveryOption: selectDeliveryOption || order.deliveryOption,
            coupon: removeCoupon ? new Coupon() : selectCoupon
         };
      });
   };

   return (
      <div className="col-12 col-md-5 col-lg-6 m-0 p-0 pt-3 pb-4 shadow ">
         <div className="col-12 m-0 pos-sticky">
            <Alert className="col-12 mb-2"
               alert={errorAlert.alert}
               onClosed={() => { errorAlert.clear(); }} />
            {auth.state.isAuthenticated &&
               <>
                  <div className="row">
                     <div className="col-12 col-lg-6 checkout-address p-0">
                        <InputDropDown label="Delivery Option"
                           dropdownTitle={order.deliveryOption?.name || "Delivery Option"}
                           className="col-12 align-self-end"
                           children={availableDeliveryList.map(delivery =>
                              <a className="dropdown-item p-1 text-nav" key={delivery?.name}
                                 onClick={() => { recalculateBasket(deliveryOptionList, delivery); }}
                                 children={<div children={`${delivery?.name} - £${delivery?.price?.toFixed(2)}`} />}
                              />)
                           } />
                        <InputDropDown dropdownTitle={order.address.name || "My Addresses"}
                           className="col-12  align-self-end"
                           label="Shipping Address"
                           children={
                              <div className="p-0 m-0">
                                 {addressList.map(addr =>
                                    <a className="dropdown-item text-nav" key={addr.id}
                                       onClick={() => { setOrder({ ...order, address: addr }); }}
                                       children={<div className="col" children={`${addr.name}`} />} />)
                                 }
                                 <a className="dropdown-item text-nav" key="newAddress"
                                    children='New Address'
                                    onClick={() => {
                                       setOrder({ ...order, address: new Address() });
                                       setIsOpenAddressModal(true);
                                    }} />
                              </div>
                           } />
                     </div>
                     <div className="col-12 col-lg-6">
                        <BasketCoupon coupon={order.coupon || new Coupon()}
                           totalPrice={order.totalPrice! - order.deliveryOption.price}
                           acceptFreeCoupon={(order.deliveryOption.price > 0 && order.deliveryOption.isPremitive) || false}
                           setCoupon={(val) => { recalculateBasket(deliveryOptionList, order.deliveryOption, val); errorAlert.clear(); }}
                           setAlert={(alert) => { errorAlert.set(alert); recalculateBasket(deliveryOptionList, order.deliveryOption, new Coupon()); }} />
                        <div> Shipping : <b>£{order.deliveryOption?.price?.toFixed(2)}</b></div>
                        {totalDiscount > 0 && <div> Discount : <b>-£{parseFloat(totalDiscount.toString()).toFixed(2)}</b></div>}
                        <div className="h5 mb-0 pb-0"> Total : <b >£{order.totalPrice?.toFixed(2)}</b> </div>
                        <p className="col-12 p-0 m-0 small-text text-gray" >Total Items: {basket.getTotalItems()}</p>
                     </div>
                  </div>
                  <div className="row col-12 m-0 p-0 mt-2 mb-4">
                     <div className="col-10 m-0 p-0">
                        <div className="col-12 " children={order.address.firstLine} key="FirstLine_Checkout" />
                        <div className="col-12 " children={order.address.secondLine} key="SecondLine_Checkout" />
                        <div className="col-12 " children={order.address.city} key="City_Checkout" />
                        <div className="col-12 " children={order.address.postcode} key="Postcode_Checkout" />
                     </div>
                     {(order.address.id || 0) > 0 &&
                        <Button className="col-2 col-md-1 btn-sm edit-icon radius-none mb-auto ml-auto"
                           onClick={() => { setIsOpenAddressModal(true); }} />
                     }
                  </div>
                  <Button className="col-12 btn-lg btn-green mt-auto radius-none " children="Checkout" onClick={() => setIsOpenPayementModal(true)} />
               </>
            }
            {!auth.state.isAuthenticated &&
               <>
                  <Login externalLoginFailed={() => { }} fromPath={"/Checkout"} access={Access} />
                  <Button children="New Customer" className="btn-lg btn-white col-12 mt-2"
                     onClick={() => setOutsideClickModal((prev) => !prev)}
                  />
               </>
            }
         </div>
         {/***** Add/ modify category modal  ****/}
         {auth.state.isAuthenticated &&
            <>
               <AddressModal isOpen={isOpenAddressModal}
                  onSuccess={(address) => {
                     useAllAddress().then(result => {
                        setAddressList(result.data);
                     }).catch(alert => errorAlert.set(alert));
                     setOrder({ ...order, address: address });
                  }}
                  address={order.address}
                  onClose={() => setIsOpenAddressModal(false)} />

               {paypalLoad &&
                  <PaymentModal isOpen={isOpenPayementModal}
                     setIsOpen={setIsOpenPayementModal}
                     ref={paymentModalRef} />
               }
            </>
         }
         {!auth.state.isAuthenticated &&
            <NewCustomerModal isOpen={outsideClickModal}
               modalRef={toggleContainerModal}
               onCancel={() => setOutsideClickModal(false)}
            />
         }
      </div>
   );
};

declare type IProps = {
   refresh: boolean;
   setRefresh: (refresh: boolean) => void;
};
export default Checkout;
