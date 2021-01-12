import React, { useState } from 'react';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import { TextArea } from 'osnack-frontend-shared/src/components/Inputs/TextArea';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { OrderStatusType } from 'osnack-frontend-shared/src/_core/apiModels';
import ModalFooter from 'osnack-frontend-shared/src/components/Modals/ModalFooter';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';




const OrderMessageModal = (props: IProps) => {
   const [message, setMessage] = useState("");
   const [refundValue, setRefundValue] = useState(0);
   const errorAlert = useAlert(new AlertObj());

   const onSave = () => {
      if (message.trim() == "") {
         errorAlert.setSingleError("message", `Please Enter ${props.type == OrderStatusType.Confirmed ? "Shipping Reference" : "Refund Message"} `);
         return;
      }

      if (refundValue > props.totalPrice) {
         errorAlert.setSingleError("refundValue", `Refund value is more than Total Price. £${props.totalPrice}`);
         return;
      }
      props.onSave!(message, refundValue);
   };

   return (
      <Modal className="col-12 col-sm-11 col-lg-9 m-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>

         {(props.type == OrderStatusType.Canceled
            || props.type == OrderStatusType.FullyRefunded
            || props.type == OrderStatusType.PartialyRefunded) &&
            <>
               <PageHeader title="Refund" />
               {props.type == OrderStatusType.PartialyRefunded &&

                  <Input label="Refund Value* (£)"
                     type="number"
                     positiveNumbersOnly
                     value={refundValue}
                     onChange={i => { setRefundValue(i.target.value as unknown as number); }}
                     className="col-12"
                     showDanger={errorAlert.checkExistFilterRequired("Price")}

                  />

               }
               <TextArea className="col-12" label="Refund Message :" rows={4} value={message}
                  onChange={(e) => setMessage(e.target.value)} />
            </>
         }
         {props.type == OrderStatusType.Confirmed &&
            <>
               <PageHeader title="Shipping" />
               <Input className="col-12" label="Reference :" value={message} onChange={(e) => setMessage(e.target.value)} />
            </>
         }

         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />
         <ModalFooter
            createText="Save"
            onCreate={onSave}
            onCancel={() => { errorAlert.clear(); props.onClose(); }}
         />
      </Modal >
   );
};


declare type IProps = {
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;
   totalPrice: number;
   onSave?: (message: string, refundValue: number) => void;
   type: OrderStatusType;
};
export default OrderMessageModal;
