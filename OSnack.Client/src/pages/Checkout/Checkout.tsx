
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Table, { TableData, TableHeaderData, TableRowData } from 'osnack-frontend-shared/src/components/Table/Table';
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

const Checkout = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const auth = useContext(AuthContext);
   const basket = useContext(ShopContext);
   const toggleContainerModal = React.createRef<HTMLDivElement>();
   const [newUser, setNewUser] = useState(new User());
   const [outsideClickModal, setOutsideClickModal] = useDetectOutsideClick(toggleContainerModal, false);
   const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
   const [selectedCoupon, setSelectedCoupon] = useState(new Coupon());
   const [addressList, setAddressList] = useState<Address[]>([]);
   const [selectedAddress, setSelectedAddress] = useState(new Address());
   const [deliveryList, setdeliveryList] = useState<DeliveryOption[]>([]);
   const [selectedDelivery, setSelectedDelivery] = useState(new DeliveryOption());
   const [tableData, setTableData] = useState(new TableData());
   const [totalDiscount, setTotalDiscount] = useState(0);
   const [totalPrice, setTotalPrice] = useState(0);
   //const [order, setOrder] = useState(new Order());

   useEffect(() => {
      setSelectedCoupon({ ...selectedCoupon, type: CouponType.DiscountPrice, discountAmount: 1 });
      errorAlert.PleaseWait(500, isUnmounted);
      useAllDeliveryOption().then(deliveryList => {
         setdeliveryList(deliveryList);
      }).catch(alert => errorAlert.set(alert));
      if (auth.state.isAuthenticated) {
         useAllAddress().then(addresslist => {
            setAddressList(addresslist);
            setSelectedAddress(addresslist.find(t => t.isDefault == true) || new Address);
         }).catch(alert => errorAlert.set(alert));
      }
      populateOrderItemsTable();
   }, []);


   const populateOrderItemsTable = () => {
      let tData = new TableData();
      tData.headers.push(new TableHeaderData("Product", "", true));
      tData.headers.push(new TableHeaderData("Quantity. "));
      tData.headers.push(new TableHeaderData("Price", "", false));

      let totalPriceTemp = 0;
      let recalculateTotalPriceAtTheEnd = false;
      switch (selectedCoupon.type) {
         case CouponType.FreeDelivery:
            setSelectedDelivery(deliveryList.find(d => d.name == "Free") || new DeliveryOption());
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


      totalPriceTemp += selectedDelivery.price;
      basket.state.List.map(orderItem => {
         totalPriceTemp += (orderItem.quantity * orderItem.price);
         tData.rows.push(new TableRowData([
            orderItem.name,
            orderItem.quantity,
            orderItem.price
         ]));

      });
      if (recalculateTotalPriceAtTheEnd) {
         const discountPercentage = selectedCoupon.discountAmount as number;
         const disouctTotalTemp = (((discountPercentage * totalPrice) / 100)?.toFixed(2) as unknown as number || 0);
         setTotalDiscount(disouctTotalTemp);
         totalPriceTemp -= disouctTotalTemp;
      }

      if (totalPriceTemp < 0)
         totalPriceTemp = 0;

      if (basket.state.List.length == 0) {
         errorAlert.setSingleWarning("0", "No Result Found");
      } else {
         errorAlert.clear();
      }
      setTotalPrice(totalPriceTemp);
      setTableData(tData);
   };

   const externalLoginFailed = (user: User) => {
      setOutsideClickModal(true);
      setNewUser(user);
   };

   const couponCheck = () => { };
   const submitOrder = () => { };

   return (
      <Container className="wide-container p-0 m-0">
         <PageHeader title="Basket" className="hr-section-sm" />
         <div className="col-12 bg-white ">
            {/* Basket info */}
            <div className="row col-12 p-0 m-0">
               <div className="col-12 col-md-8 m-0">
                  <Table className="col-12 text-center table-striped mt-4"
                     data={tableData}
                     colGroup={
                        <colgroup>
                           <col style={{ width: "60rem" }} />
                           <col style={{ width: "20rem" }} />
                           <col style={{ width: "20rem" }} />
                        </colgroup>
                     }
                     postRow={
                        <>
                           {/* Discount Row */
                              (selectedCoupon.type != CouponType.FreeDelivery) &&
                              <tr className="checkout-tbl-headers">
                                 <td className="font-weight-bold">
                                    Discount
                              </td>
                                 <td className="font-weight-bold" children={`${selectedCoupon.discountAmount} ${CouponTypeList.find(i => i.Value == selectedCoupon.type)?.Name}`} />
                                 <td>
                                    -£<b id="CheckoutTotalDiscount">{totalDiscount}</b>
                                 </td>
                              </tr>
                           }
                           {/* Delivery Ooption Row */}
                           <tr className="checkout-tbl-headers">
                              <td className="font-weight-bold">
                                 Delivery
                              </td>
                              <td className="pl-0 pr-0 ml-0 mr-0 ">
                                 <InputDropDown key="deliveryOptions"
                                    label=""
                                    dropdownTitle={selectedDelivery.name || "Delivery Option"}
                                    className="col-12 col-md-auto mt-2 pr-2 pl-md-1 mt-md-0 align-self-end dropup"
                                    //titleClassName="btn-white "
                                    //spanClassName="text-center dropdown-menu-right bg-white"
                                    children={
                                       <div className="p-0 m-0">
                                          {deliveryList.map(delivery => {
                                             if (delivery.name != "Free") {
                                                return <a className="dropdown-item p-1 text-nav" key={delivery.name}
                                                   onClick={() => setSelectedDelivery(delivery)}
                                                   children={<div children={`${delivery.name} - £${delivery.price?.toFixed(2)}`} />}
                                                />;
                                             }
                                             else { return <a key={Math.random()} className="dropdown-item p-1 text-nav disabled" children={delivery.name} />; }
                                          }
                                          )
                                          }
                                       </div>
                                    } />
                              </td>
                              <td>
                                 £<b id="DiscountAmount">{selectedDelivery.price?.toFixed(2)}</b>
                              </td>
                           </tr>
                           {/* Total Price Row */}
                           <tr className="checkout-tbl-headers">
                              <td className="font-weight-bold" children="Total" />
                              <td className="" children={
                                 <>
                                    <b className="font-weight-bold" children={basket.getTotalItems()} />
                                    <b className="font-weight-bold" children=" items" />
                                 </>
                              } />
                              <td className="font-weight-bold" children={`£${totalPrice.toFixed(2)}`} />
                           </tr>
                        </>
                     }
                  />
               </div>
               {/* User info */}
               <div className="row col-12 col-md-4 m-0 ">
                  <div className="col-12 bg-white ml-md-3 pt-3  shadow">
                     <Alert alert={errorAlert.alert}
                        className="col-12 mb-2"
                        onClosed={() => { errorAlert.clear(); }}
                     />

                     {auth.state.isAuthenticated &&
                        <>

                           <InputDropDown key="ddAddress" dropdownTitle={selectedAddress.name || "My Addresses"}
                              className="col-12 mt-2 pr-2 pl-md-1 mt-md-0 align-self-end"
                              label="Delivery Address"
                              children={
                                 <div className="p-0 m-0">
                                    {addressList.map(addr =>
                                       <a className="dropdown-item text-nav" key={addr.id}
                                          onClick={() => { setSelectedAddress(addr); }}
                                          children={
                                             <div className="row">
                                                <div className="col">
                                                   <div children={`Name: ${addr.name}`} />
                                                   <div children={` Postcode: ${addr.postcode}`} />
                                                </div>
                                                <div children="Edit" onClick={() => {
                                                   setSelectedAddress(addr);
                                                   setIsOpenAddressModal(true);
                                                }}
                                                   className="btn-blue col-auto mt-auto mb-auto p-2 btn-sm text-white float-right" />
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

                           <div className="col-12 mt-2 mb-3">
                              <h5 children={selectedAddress.firstLine} key="FirstLine_Checkout" />
                              <h5 children={selectedAddress.secondLine} key="SecondLine_Checkout" />
                              <h5 children={selectedAddress.city} key="City_Checkout" />
                              <h5 children={selectedAddress.postcode} key="Postcode_Checkout" />
                           </div>
                           <div className="checkout-address border-bottom pb-3">
                              <div className="row">
                                 <div className="col-8">
                                    <Input label="Discount Code"
                                       value={selectedCoupon.code}
                                       onChange={i => selectedCoupon.code = i.target.value}
                                       className="col-12" />
                                 </div>
                                 <div className="col-4">
                                    <Button className="btn btn-info border-0 col-12"

                                       onClick={couponCheck}
                                       children="Apply" />
                                 </div>
                              </div>
                              <div className="font-weight-bolder mt-4">
                                 <b >Payment:</b>
                              </div>
                              <div key="btnPaymentMethods" className="row">
                                 <a onClick={submitOrder} className="btn col-12 bg-light mb-1 pb-3 pt-2 border-bottom">
                                    <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_150x38.png" alt="PayPal Logo" />
                                 </a>
                              </div>
                           </div>

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
                              onCancel={() => {
                                 setOutsideClickModal(false);
                                 setNewUser(new User());
                              }}
                              newUser={newUser}
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
         </div>
      </Container >
   );
};

declare type IProps = {
   location: any;
};
export default Checkout;
