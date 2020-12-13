import React, { useContext, useEffect, useRef, useState } from 'react';
import { Address } from 'osnack-frontend-shared/src/_core/apiModels';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import ButtonPopupConfirm from 'osnack-frontend-shared/src/components/Buttons/ButtonPopupConfirm';
import { TextArea } from 'osnack-frontend-shared/src/components/Inputs/TextArea';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import Alert, { AlertObj, AlertTypes, ErrorDto, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { useDeleteAddress, usePostAddress, usePutAddress } from 'osnack-frontend-shared/src/hooks/OfficialHooks/useAddressHook';
import { AuthContext } from 'osnack-frontend-shared/src/_core/authenticationContext';

const AddressModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const Auth = useContext(AuthContext);
   const errorAlert = useAlert(new AlertObj());
   const [address, setAddress] = useState(new Address());
   useEffect(() => {
      if (props.address.id === undefined)
         props.address.id = 0;
      setAddress(props.address);
   }, [props.address]);

   const createAddress = async () => {
      let errors = new AlertObj([], AlertTypes.Error);

      //Ask
      if (address.name == "")
         errors.List.push(new ErrorDto("0", "Address name is required."));
      if (address.firstLine == "")
         errors.List.push(new ErrorDto("0", "FirstLin is required"));
      if (address.postcode == "")
         errors.List.push(new ErrorDto("0", "Post Code is required."));
      if (address.city == "")
         errors.List.push(new ErrorDto("0", "City is required."));


      if (errors.List.length > 0) {
         errorAlert.set(errors);
         return;
      }
      errorAlert.PleaseWait(500, isUnmounted);
      address.userId = Auth.state.user.id;
      usePostAddress(address).then(result => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         setAddress(result.data);
         props.onClose();
         props.onSuccess(result.data);
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };
   const updateAddress = async () => {

      let errors = new AlertObj([], AlertTypes.Error);

      if (address.name == "")
         errors.List.push(new ErrorDto("0", "Address name is required."));
      if (address.firstLine == "")
         errors.List.push(new ErrorDto("0", "FirstLine is required"));
      if (address.postcode == "")
         errors.List.push(new ErrorDto("0", "Postcode is required."));
      if (address.city == "")
         errors.List.push(new ErrorDto("0", "City is required."));

      if (errors.List.length > 0) {
         errorAlert.set(errors);
         return;
      }

      errorAlert.PleaseWait(500, isUnmounted);
      address.userId = Auth.state.user.id;
      usePutAddress(address).then(result => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         props.onClose();
         props.onSuccess(result.data);
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });

   };
   const deleteAddress = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      useDeleteAddress(address).then(result => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         errorAlert.setSingleSuccess("Deleted", result.data);
         props.onClose();
         props.onSuccess(address);
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });

   };

   return (
      <Modal className="col-11 col-sm-10 col-md-8 col-lg-6 pl-4 pr-4"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title={address.id === 0 ? "New Address" : "Update Address"} />

         {/***** Name ****/}
         <div className="row">
            <Input label="Name"
               value={address.name || ""}
               onChange={i => { setAddress({ ...address, name: i.target.value }); }}
               className="col-12" />
            <Input label="First Line"
               value={address.firstLine}
               onChange={i => { setAddress({ ...address, firstLine: i.target.value }); }}
               className="col-12" />
            <Input label="Second Line"
               value={address.secondLine}
               onChange={i => { setAddress({ ...address, secondLine: i.target.value }); }}
               className="col-12" />
            <Input label="City"
               value={address.city}
               onChange={i => { setAddress({ ...address, city: i.target.value }); }}
               className="col-12 col-sm-6" />
            <Input label="Post Code"
               value={address.postcode}
               onChange={i => { setAddress({ ...address, postcode: i.target.value }); }}
               className="col-12 col-sm-6" />
            <TextArea label="Instructions"
               rows={3}
               value={address.instructions}
               onChange={i => { setAddress({ ...address, instructions: i.target.value }); }}
               className="col-12" />
         </div>

         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />

         {/***** buttons ****/}
         <div className="row col-12 p-0 m-0 ">
            {address.id === 0 ?
               <Button children="Create"
                  className="col-12 mt-2 btn-green col-sm-6 btn-lg"
                  onClick={createAddress} />
               :
               <div className="row col-12 col-sm-8 p-0 m-0">
                  <ButtonPopupConfirm title="Update"
                     popupMessage="Are you sure?"
                     className="col-12 mt-2 col-sm-6"
                     btnClassName="btn-green"
                     onConfirmClick={updateAddress}
                  />
                  <ButtonPopupConfirm title="Delete"
                     popupMessage="Are you sure?"
                     className="col-12 col-sm-6 mt-2"
                     btnClassName="btn-red"
                     onConfirmClick={deleteAddress}
                  />
               </div>
            }
            <Button children="Cancel"
               className={`col-12 mt-2 btn-white btn-lg ${address.id === 0 ? "col-sm-6" : "col-sm-4"}`}
               onClick={() => { errorAlert.clear(); props.onClose(); }} />
         </div>
      </Modal >
   );
};

declare type IProps = {
   address: Address;
   isOpen: boolean;
   onClose: () => void;
   onSuccess: (address: Address) => void;
   modalRef?: any;
};
export default AddressModal;
