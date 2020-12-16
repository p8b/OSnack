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
         <div id="test" className="row justify-content-center m-0 p-0">
            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.clear(); }}
            />
            <ButtonCard cardClassName="card-lg col-12 row p-0 m-0 "
               onClick={newAddress}>
               <div className="col mt-auto mb-auto">
                  <div className="col-12 fas add-icon " />
                        New Address
                      </div>
            </ButtonCard>
            {addressList.length > 0 &&
               addressList.map(addr => {
                  return (
                     <ButtonCard key={addr.id} cardClassName="card-lg col-12 row p-0 m-0"
                        onClick={() => {
                           setSelectAddress(addr);
                           setIsOpenAddressModal(true);
                        }}>

                        <p className={` tick-icon mb-auto ml-auto ${addr.isDefault ? '' : 'hide'}`} />

                        <div className="col-12 ">
                           <b className="row text-left  mt-auto m-0 p-0 line-limit-1">{addr.name}</b>
                           <p className="row  text-left  m-0 p-0 line-limit-2"
                              children={addr.firstLine} />

                           <p className="row text-left  m-0 p-0 line-limit-2">
                              {addr.secondLine}
                           </p>
                           <p className="row text-left   mb-auto m-0 p-0 line-limit-2">
                              {addr.city}, {addr.postcode}
                           </p>
                        </div>
                        <div className="row col-12 p-0 m-0  mt-auto">
                           <Button className="btn-sm  col m-0 radius-none"
                              children="Edit" />
                           {!addr.isDefault &&
                              <Button className="btn-sm  col-6 m-0 radius-none"
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
