import React, { useEffect, useRef, useState } from 'react';
import { DeliveryOption } from 'osnack-frontend-shared/src/_core/apiModels';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import { usePostDeliveryOption, useDeleteDeliveryOption, usePutDeliveryOption } from '../../SecretHooks/useDeliveryOptionHook';
import ModalFooter from 'osnack-frontend-shared/src/components/Modals/ModalFooter';


const DeliveyOptionModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [deliveryOption, setDeliveyOption] = useState(new DeliveryOption());


   useEffect(() => {
      setDeliveyOption(props.deliveryOption);
   }, [props.deliveryOption]);

   const createDeliveryOption = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      usePostDeliveryOption(deliveryOption).then(result => {
         if (isUnmounted.current) return;
         setDeliveyOption(result.data);
         props.onSuccess();
         errorAlert.clear();
         errorAlert.setSingleSuccess("", "Delivery Option Created.");
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
   };
   const updateDeliveryOption = async () => {

      errorAlert.PleaseWait(500, isUnmounted);
      usePutDeliveryOption(deliveryOption).then(result => {
         if (isUnmounted.current) return;
         setDeliveyOption(result.data);
         props.onSuccess();
         errorAlert.clear();
         errorAlert.setSingleSuccess("", "Delivery Option Updated.");
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });

   };

   const deleteDeliveryOption = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      useDeleteDeliveryOption(deliveryOption).then(() => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         props.onClose();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });

   };
   return (
      <Modal className="col-11 col-sm-10 col-md-8 col-lg-6 pl-4 pr-4"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader className="col-12" title={deliveryOption.id == 0 ? "New Delivey Option" : "Update Delivey Option"} />
         {/***** Name ****/}
         <div className="row">
            <Input label="Name*"
               value={deliveryOption.name}
               onChange={i => setDeliveyOption({ ...deliveryOption, name: i.target.value })}
               className="col-12"
               showDanger={errorAlert.checkExist("nam")}
            />
         </div>
         <div className="row">
            <Input label="Price*"
               type="number"
               disabled={(deliveryOption.isPremitive && deliveryOption.price == 0)}
               positiveNumbersOnly
               value={deliveryOption.price}
               onChange={i => { setDeliveyOption({ ...deliveryOption, price: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExist("price")}
            />
            <Input label="Minimum Order *"
               type="number"
               positiveNumbersOnly
               value={deliveryOption.minimumOrderTotal}
               disabled={(deliveryOption.isPremitive && deliveryOption.minimumOrderTotal == 0)}
               onChange={i => { setDeliveyOption({ ...deliveryOption, minimumOrderTotal: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={errorAlert.checkExist("maxUseQuantity")}

            />
         </div>
         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />

         <ModalFooter
            onCreate={deliveryOption.id != 0 ? undefined : createDeliveryOption}
            onUpdate={deliveryOption.id === 0 ? undefined : updateDeliveryOption}
            onDelete={(deliveryOption.id === 0 || deliveryOption.isPremitive) ? undefined : deleteDeliveryOption}
            onCancel={() => { errorAlert.clear(); props.onClose(); }} />

      </Modal >
   );
};

declare type IProps = {
   deliveryOption: DeliveryOption;
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
   modalRef?: any;
};
export default DeliveyOptionModal;
