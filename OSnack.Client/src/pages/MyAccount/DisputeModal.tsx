import React, { useRef, useState } from 'react';
import { Communication } from 'osnack-frontend-shared/src/_core/apiModels';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import { useAddMessageCommunication } from 'osnack-frontend-shared/src/hooks/OfficialHooks/useCommunicationHook';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { TextArea } from 'osnack-frontend-shared/src/components/Inputs/TextArea';
import { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';




const DisputeModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [message, setMessage] = useState("");


   const sendMessage = () => {
      errorAlert.PleaseWait(500, isUnmounted);
      useAddMessageCommunication({
         ...props.dispute,
         messages: [...props.dispute.messages!, { body: message }]
      }).then((result) => {
         if (isUnmounted.current) return;
         setMessage("");
         errorAlert.setSingleSuccess("submit", result.data);
         props.onClose();

      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };
   return (
      <Modal className="col-11 col-sm-10 col-lg-4 pm-0 pl-4 pr-4 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <>
            <PageHeader title="Dispute Order" />
            <div className="row  mt-1">
               {props.dispute.id != undefined && props.dispute.messages!.map(message => {
                  return (
                     <div className={`col-12 chat ${!message.isCustomer && "darker"}`}>
                        <span className="time-right">{new Date(message.date!).ToShortDateTime()}</span>
                        <div className="small-text">{!message.isCustomer ? "Admin" : "Customer"} </div>
                        <p>{message.body}</p>
                     </div>


                  );
               })

               }
               <TextArea className="col-12" label="Message*" rows={3} value={message}
                  onChange={(i) => { setMessage(i.target.value); }} />

               {/***** buttons ****/}
               <div className="row col-12 pm-0 pos-b-sticky bg-white pb-3">
                  <Button children="Submit"
                     className={`col-12 col-md-6 mt-2 btn-green btn-lg col-sm-6"}`}
                     onClick={sendMessage} />
                  <Button children="Close"
                     className="col-12  mt-2 btn-white btn-lg col-sm-6"
                     onClick={() => { props.onClose(); }} />
               </div>
            </div >
         </>
      </Modal >

   );

};

declare type IProps = {
   dispute: Communication;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;
};
export default DisputeModal;
