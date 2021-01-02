import React, { useState } from 'react';
import Modal from '../../components/Modals/Modal';
import { Button } from '../../components/Buttons/Button';
import { TextArea } from '../../components/Inputs/TextArea';
import { Input } from '../../components/Inputs/Input';
import Alert, { AlertObj, useAlert } from '../../components/Texts/Alert';
import { OrderStatusType } from '../../_core/apiModels';




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
      <Modal className="col-11 col-sm-10 col-lg-5 pm-0 pl-4 pr-4 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <>
            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.clear(); }}
            />
            <div className="row  mt-1">
               {(props.type == OrderStatusType.Canceled
                  || props.type == OrderStatusType.FullyRefunded
                  || props.type == OrderStatusType.PartialyRefunded) &&
                  <>
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
                  <Input className="col-12" label="Shipping Reference :" value={message} onChange={(e) => setMessage(e.target.value)} />
               }

               {/***** buttons ****/}
               < div className="row col-12 pm-0 pos-b-sticky bg-white pb-3">
                  <Button children="Save"
                     className={`col-12 col-md-6 mt-2 btn-green btn-lg col-sm-6"}`}
                     onClick={onSave} />
                  <Button children="Cancel"
                     className={`col-12 col-md-6 mt-2 btn-white btn-lg col-sm-6"}`}
                     onClick={() => { props.onClose(); }} />
               </div>
            </div >
         </>
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
