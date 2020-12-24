import React, { useState } from 'react';
import Modal from '../../components/Modals/Modal';
import { Button } from '../../components/Buttons/Button';
import { TextArea } from '../../components/Inputs/TextArea';
import { Input } from '../../components/Inputs/Input';




const OrderMessageModal = (props: IProps) => {
   const [message, setMessage] = useState(" ");
   return (
      <Modal className="col-11 col-sm-10 col-lg-5 pm-0 pl-4 pr-4 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <>
            <div className="row  mt-1">
               {props.type == OrderMessageType.RefundMessage &&
                  <TextArea className="col-12" label="Refund Message :" rows={4} value={message}
                     onChange={(e) => setMessage(e.target.value)} />
               }
               {props.type == OrderMessageType.ShippingReference &&
                  <Input className="col-12" label="Shipping Reference :" value={message} onChange={(e) => setMessage(e.target.value)} />
               }

               {/***** buttons ****/}
               < div className="row col-12 pm-0 pos-b-sticky bg-white pb-3">
                  <Button children="Save"
                     className={`col-12 col-md-6 mt-2 btn-green btn-lg col-sm-6"}`}
                     onClick={() => { props.onSave!(message); }} />
                  <Button children="Cancel"
                     className={`col-12 col-md-6 mt-2 btn-white btn-lg col-sm-6"}`}
                     onClick={() => { props.onClose(); }} />
               </div>
            </div >
         </>
      </Modal >

   );

};

export enum OrderMessageType {
   RefundMessage = 0,
   ShippingReference = 1,
   RefundValue = 2
}

declare type IProps = {
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;
   onSave?: (mssage: string) => void;
   type: OrderMessageType;
};
export default OrderMessageModal;
