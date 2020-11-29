import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
//import { AuthContext } from 'osnack-frontend-shared/src/_core/authenticationContext';
import ButtonCard from 'osnack-frontend-shared/src/components/Buttons/ButtonCard';
import Alert, { AlertObj } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Address } from 'osnack-frontend-shared/src/_core/apiModels';
import { sleep } from 'osnack-frontend-shared/src/_core/appFunc';
import { useGetAllAddresses } from '../../hooks/apiCallers/address/Get.Address';
import AddressModal from './AddressModal';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { useModifyDefaultAddress } from '../../hooks/apiCallers/address/Put.Address';

const MyAddresses = (props: IProps) => {
   //const auth = useContext(AuthContext);
   const isUnmounted = useRef(false);
   const [alert, setAlert] = useState(new AlertObj());
   const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);
   const [selectAddress, setSelectAddress] = useState(new Address());
   const [addressList, setAddressList] = useState<Address[]>([]);

   useEffect(() => {
      reloadAddressList();
      return () => { isUnmounted.current = true; };
   }, []);

   const newAddress = () => {
      setSelectAddress(new Address());
      setIsOpenCategoryModal(true);
   };
   const reloadAddressList = () => {
      sleep(500, isUnmounted).then(() => { setAlert(alert.PleaseWait); });
      useGetAllAddresses().then((result) => {
         if (isUnmounted.current) return;

         setAddressList(result.addressList);
         setAlert(alert.Clear);
      });
   };

   const resetCategoryModal = () => {
      setIsOpenCategoryModal(false);
      setSelectAddress(new Address());
   };

   const setDefault = (addressId: number) => {
      sleep(500, isUnmounted).then(() => { setAlert(alert.PleaseWait); });
      useModifyDefaultAddress(addressId).then((result) => {
         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         }
         reloadAddressList();
      });
   };

   return (
      <>
         <PageHeader title="My Addresses" className="line-header-lg" />
         <div id="test" className="row justify-content-center m-0 p-0">
            <Alert alert={alert}
               className="col-12 mb-2"
               onClosed={() => { setAlert(alert.Clear); }}
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
                           setIsOpenCategoryModal(true);
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
                                    setDefault(addr.id);
                                 }}

                                 children="Set as Default" />
                           }
                        </div>
                     </ButtonCard>
                  );
               })
            }
         </div>
         {/***** Add/ modify category modal  ****/}
         <AddressModal isOpen={isOpenCategoryModal}
            onSuccess={() => { reloadAddressList(); }}
            address={selectAddress}
            onClose={resetCategoryModal} />
      </>
   );
};

declare type IProps = {
};
export default MyAddresses;

