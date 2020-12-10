
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React, { useContext, useEffect, useRef, useState } from 'react';
//import ReactDOM from 'react-dom';
import Container from '../../components/Container';
import { ShopContext } from '../../_core/shopContext';
import InputDropDown from 'osnack-frontend-shared/src/components/Inputs/InputDropDown';
import { Address, Coupon, CouponType, CouponTypeList, DeliveryOption, User } from 'osnack-frontend-shared/src/_core/apiModels';
import { useAllDeliveryOption } from 'osnack-frontend-shared/src/hooks/PublicHooks/useDeliveryOptionHook';
import { useAllAddress } from 'osnack-frontend-shared/src/hooks/OfficialHooks/useAddressHook';
import { AuthContext } from 'osnack-frontend-shared/src/_core/authenticationContext';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Login from 'osnack-frontend-shared/src/components/Login/Login';
import NewCustomerModal from '../Login/NewCustomerModal';
import { Access } from '../../_core/appConstant.Variables';
import { useDetectOutsideClick } from 'osnack-frontend-shared/src/hooks/function/useDetectOutsideClick';
import AddressModal from '../MyAccount/AddressModal';
import BasketItem from './BasketItem';


const Checkout = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const auth = useContext(AuthContext);
   const basket = useContext(ShopContext);
   // // @ts-ignore
   // const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });
   const toggleContainerModal = React.createRef<HTMLDivElement>();
   const [outsideClickModal, setOutsideClickModal] = useDetectOutsideClick(toggleContainerModal, false);
   const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);

   const [selectedCoupon, setSelectedCoupon] = useState(new Coupon());
   const [selectedAddress, setSelectedAddress] = useState(new Address());
   const [selectedDelivery, setSelectedDelivery] = useState(new DeliveryOption());
   const [totalPrice, setTotalPrice] = useState(0);
   const [addressList, setAddressList] = useState<Address[]>([]);
   const [selectedDeliveryOptionList, setSelectedDeliveryOptionList] = useState<DeliveryOption[]>([]);
   const [availableDeliveryList, setAvailableDeliveryList] = useState<DeliveryOption[]>([]);
   // @ts-ignore
   const [totalDiscount, setTotalDiscount] = useState(0);
   //const [order, setOrder] = useState(new Order());

   useEffect(() => {
      setSelectedCoupon({ ...selectedCoupon, type: CouponType.DiscountPrice, discountAmount: 1 });
      errorAlert.PleaseWait(500, isUnmounted);
      useAllDeliveryOption().then(deliveryList => {
         if (isUnmounted.current) return;
         recalculateBasket(deliveryList);
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
      if (auth.state.isAuthenticated) {
         useAllAddress().then(addresslist => {
            if (isUnmounted.current) return;
            setAddressList(addresslist);
            setSelectedAddress(addresslist.find(t => t.isDefault == true) || new Address);
         }).catch(alert => {
            if (isUnmounted.current) return;
            errorAlert.set(alert);
         });
      }
   }, []);


   const recalculateBasket = (deliveryList: DeliveryOption[], selectDelivery?: DeliveryOption) => {
      let totalPriceTemp = 0;
      let recalculateTotalPriceAtTheEnd = false;
      switch (selectedCoupon.type) {
         case CouponType.FreeDelivery:
            selectDelivery = deliveryList.find(d => d.price == 0 && d.minimumOrderTotal == 0 && d.isPremitive) || new DeliveryOption();
            setSelectedDelivery(selectDelivery);
            setTotalDiscount(0);
            break;
         case CouponType.DiscountPrice:
            setTotalDiscount(selectedCoupon.discountAmount || 0);
            totalPriceTemp -= (selectedCoupon.discountAmount as number);
            break;
         case CouponType.PercentageOfTotal:
            recalculateTotalPriceAtTheEnd = true;
            break;
         default:
            break;
      }

      basket.state.List.map(orderItem => {
         totalPriceTemp += (orderItem.quantity * orderItem.price) as number;
      });
      if (recalculateTotalPriceAtTheEnd) {
         const discountPercentage = selectedCoupon.discountAmount as number;
         const disouctTotalTemp = (((discountPercentage * totalPrice) / 100)?.toFixed(2) as unknown as number || 0);
         setTotalDiscount(disouctTotalTemp);
         totalPriceTemp -= disouctTotalTemp;
      }

      if (totalPriceTemp < 0)
         totalPriceTemp = 0;

      let availableList: DeliveryOption[] = [];
      if (deliveryList.find(d => d.price == 0 && d.minimumOrderTotal > 0 && d.isPremitive) &&
         totalPriceTemp > (deliveryList.find(d => d.price == 0 && d.minimumOrderTotal > 0 && d.isPremitive)!.minimumOrderTotal)) {
         let _delivery: DeliveryOption = deliveryList.find(d => d.price == 0 && d.minimumOrderTotal > 0 && d.isPremitive)!;
         if (selectDelivery == undefined || !selectDelivery.isPremitive) {
            setSelectedDelivery(_delivery);
         } else {
            setSelectedDelivery(selectDelivery);
         }
         totalPriceTemp += _delivery.price;
         availableList.push(_delivery);
         deliveryList.filter(d => !d.isPremitive).map(delivery => {
            availableList.push(delivery);
         });
      }
      else {
         let _delivery: DeliveryOption = deliveryList.find(d => d.price != 0 && d.minimumOrderTotal == 0 && d.isPremitive)!;
         if (selectDelivery == undefined || !selectDelivery?.isPremitive) {
            setSelectedDelivery(_delivery);
         } else {
            setSelectedDelivery(selectDelivery);
         }
         availableList.push(_delivery);
         totalPriceTemp += _delivery.price;
         deliveryList.filter(d => !d.isPremitive).map(delivery => {
            availableList.push(delivery);
         });

      }
      setAvailableDeliveryList(availableList);
      setSelectedDeliveryOptionList(deliveryList);
      setTotalPrice(totalPriceTemp);
   };

   const externalLoginFailed = (user: User) => {
      setOutsideClickModal(true);
   };

   const couponCheck = () => { };
   const submitOrder = () => { };

   return (
      <Container className="wide-container p-0 m-0">
         <PageHeader title="Basket" className="hr-section-sm" />
         <div className="row col-12 col-md-10 bg-white p-0 ml-auto mr-auto">
            {/* Basket info */}
            <div className="col-12 col-md-6 m-0">
               {basket.state.List.map(orderItem =>
                  <BasketItem
                     key={orderItem.productId}
                     orderItem={orderItem}
                     onChange={(val) => { recalculateBasket(availableDeliveryList); }}
                  />
               )}
               <p className="p-2">Total Items : <b id="DiscountAmount">{basket.getTotalItems()}</b></p>
            </div>

            {/* User info */}
            <div className="col-12 col-md-6 m-0 p-0 pt-3 shadow ">
               <div className="col-12 m-0 pos-sticky">
                  <Alert alert={errorAlert.alert}
                     className="col-12 mb-2"
                     onClosed={() => { errorAlert.clear(); }}
                  />
                  {auth.state.isAuthenticated &&
                     <>
                        <div className="row">
                           <div className="col-12 col-md-6 checkout-address  pb-3">
                              <InputDropDown key="deliveryOptions"
                                 label="Delivery Option"
                                 dropdownTitle={selectedDelivery?.name || "Delivery Option"}
                                 className="col-12 align-self-end"
                                 children={
                                    <div className="p-0 m-0">
                                       {availableDeliveryList.map(delivery => {
                                          return <a className="dropdown-item p-1 text-nav" key={delivery?.name}
                                             onClick={() => {
                                                recalculateBasket(selectedDeliveryOptionList, delivery);
                                                setTotalPrice(totalPrice - selectedDelivery.price + delivery.price);
                                             }}
                                             children={<div children={`${delivery?.name} - £${delivery?.price?.toFixed(2)}`} />}
                                          />;
                                       })}
                                    </div>
                                 } />
                              <InputDropDown key="ddAddress" dropdownTitle={selectedAddress.name || "My Addresses"}
                                 className="col-12  align-self-end"
                                 label="Shipping Address"
                                 children={
                                    <div className="p-0 m-0">
                                       {addressList.map(addr =>
                                          <a className="dropdown-item text-nav" key={addr.id}
                                             onClick={() => { setSelectedAddress(addr); }}
                                             children={
                                                <div className="row">

                                                   <div className="col mt-2" children={`${addr.name}`} />

                                                   <Button children="Edit" onClick={() => {
                                                      setSelectedAddress(addr);
                                                      setIsOpenAddressModal(true);
                                                   }}
                                                      className="btn-blue col-auto radius-none mt-auto mb-auto p-2 btn-sm text-white float-right" />
                                                </div>
                                             }
                                          />

                                       )}
                                       <a className="dropdown-item text-nav" key="newAddress"
                                          onClick={() => {
                                             setSelectedAddress(new Address());
                                             setIsOpenAddressModal(true);
                                          }}
                                          children='New Address' />
                                    </div>
                                 } />
                           </div>
                           <div className="col-12 col-md-6">
                              <div className="row col-12 m-0 p-0 pb-3 ">
                                 <Input label="Discount Code"
                                    value={selectedCoupon.code}
                                    onChange={i => selectedCoupon.code = i.target.value}
                                    className="col-8 mb-0 p-0 " />
                                 <div className="row col-4 p-0 mt-auto">
                                    <Button className="col-12 btn-sm btn-blue radius-none m-0"
                                       onClick={couponCheck} children="Apply" />
                                 </div>
                              </div>
                              <p> Shipping : £<b id="DiscountAmount">{selectedDelivery?.price?.toFixed(2)}</b></p>
                              <h4> Total : <b id="DiscountAmount">£{totalPrice.toFixed(2)}</b> </h4>
                           </div>
                        </div>
                        <div className="col-12 mt-2 mb-4">
                           <h5 children={selectedAddress.firstLine} key="FirstLine_Checkout" />
                           <h5 children={selectedAddress.secondLine} key="SecondLine_Checkout" />
                           <h5 children={selectedAddress.city} key="City_Checkout" />
                           <h5 children={selectedAddress.postcode} key="Postcode_Checkout" />
                        </div>
                        <Button className="col-12 btn-lg btn-green mt-auto  radius-none mb-2" children="Checkout" />
                        {/*  <PayPalButton />   */}
                     </>
                  }
                  {!auth.state.isAuthenticated &&
                     <>
                        <div className="row justify-content-sm-center">
                           <div className="col-sm-10 col-md-8 col-lg-6 bg-white p-sm-5 pt-4 pb-4">
                              <Login externalLoginFailed={externalLoginFailed} fromPath={props.location.state?.fromPath} access={Access} />
                              <Button children="New Customer" className="btn-lg btn-white col-12 mt-2"
                                 onClick={() => {
                                    setOutsideClickModal((prev) => !prev);
                                 }}
                              />
                           </div>
                        </div>
                        <NewCustomerModal isOpen={outsideClickModal}
                           modalRef={toggleContainerModal}
                           onCancel={() => setOutsideClickModal(false)}
                        />
                     </>
                  }
               </div>
            </div>
         </div>
         {/***** Add/ modify category modal  ****/}
         <AddressModal isOpen={isOpenAddressModal}
            onSuccess={(address) => {
               useAllAddress().then(addresses => {
                  setAddressList(addresses);
               }).catch(alert => errorAlert.set(alert));
               setSelectedAddress(address);
            }}
            address={selectedAddress}
            onClose={() => setIsOpenAddressModal(false)} />
      </Container >
   );
};

declare type IProps = {
   location: any;
};
export default Checkout;
