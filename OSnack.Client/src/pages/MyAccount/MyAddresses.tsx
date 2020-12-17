import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import ButtonCard from 'osnack-frontend-shared/src/components/Buttons/ButtonCard';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Address } from 'osnack-frontend-shared/src/_core/apiModels';
import AddressModal from './AddressModal';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { useAllAddress, useSetDefaultAddress } from 'osnack-frontend-shared/src/hooks/OfficialHooks/useAddressHook';

const MyAddresses = (props: IProps) => {
   //const auth = useContext(AuthContext);
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
   const [selectAddress, setSelectAddress] = useState(new Address());
   const [addressList, setAddressList] = useState<Address[]>([]);

   useEffect(() => {
      reloadAddressList();
      return () => { isUnmounted.current = true; };
   }, []);

   const newAddress = () => {
      setSelectAddress(new Address());
      setIsOpenAddressModal(true);
   };
   const reloadAddressList = () => {
      errorAlert.PleaseWait(500, isUnmounted);
      useAllAddress().then(result => {
         if (isUnmounted.current) return;

         setAddressList(result.data);
         errorAlert.clear();
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };

   const resetAddressModal = () => {
      setIsOpenAddressModal(false);
      setSelectAddress(new Address());
   };

   const setDefault = (addressId: number) => {
      errorAlert.PleaseWait(500, isUnmounted);
      useSetDefaultAddress(addressId).then(() => {
         reloadAddressList();
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };

   return (
      <>
         <PageHeader title="My Addresses" className="line-header-lg" />
         <div className="row justify-content-center pm-0">
            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.clear(); }}
            />
            <ButtonCard cardClassName="card-lg col-12 row pm-0 "
               onClick={newAddress}>
               <div className="col mt-auto mb-auto">
                  <div className="col-12 fas add-icon " />
                        New Address
                      </div>
            </ButtonCard>
            {addressList.length > 0 &&
               addressList.map(addr => {
                  return (
                     <ButtonCard key={addr.id} cardClassName="card-lg col-12 row pm-0"
                        onClick={() => {
                           setSelectAddress(addr);
                           setIsOpenAddressModal(true);
                        }}>

                        <div className={` tick-icon mb-auto ml-auto ${addr.isDefault ? '' : 'hide'}`} />

                        <div className="col-12 ">
                           <b className="row text-left  mt-auto pm-0 line-limit-1">{addr.name}</b>
                           <div className="row h6  text-left  pm-0 line-limit-2"
                              children={addr.firstLine} />

                           <div className="row h6 text-left  pm-0 line-limit-2">
                              {addr.secondLine}
                           </div>
                           <div className="row h6 text-left   mb-auto pm-0 line-limit-2">
                              {addr.city}
                           </div>
                           <div className="row h6 text-left   mb-auto pm-0 line-limit-2">
                              {addr.postcode}
                           </div>
                        </div>
                        <div className="row col-12 pm-0  mt-auto">
                           <Button className="btn-sm  col m-0 radius-none"
                              children="Edit" />
                           {!addr.isDefault &&
                              <Button className="btn-sm  col-6 m-0 "
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    setDefault(addr.id || 0);
                                 }}

                                 children="Set as Default" />
                           }
                        </div>
                     </ButtonCard>
                  );
               })
            }
         </div>
         <AddressModal isOpen={isOpenAddressModal}
            onSuccess={() => { reloadAddressList(); }}
            address={selectAddress}
            onClose={resetAddressModal} />
      </>
   );
};

declare type IProps = {
};
export default MyAddresses;
