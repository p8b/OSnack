import React, { useEffect, useRef, useState } from 'react';
import { Communication, ContactType } from '../../_core/apiModels';
import Modal from '../../components/Modals/Modal';
import { IReturnUseAddMessageOfficialCommunication, useAddMessageOfficialCommunication } from '../../hooks/OfficialHooks/useCommunicationHook';
import PageHeader from '../../components/Texts/PageHeader';
import { TextArea } from '../../components/Inputs/TextArea';
import Alert, { AlertObj, useAlert } from '../../components/Texts/Alert';
import { ClientAppAccess } from '../../_core/constant.Variables';
import { Toggler } from '../Inputs/Toggler';
import ModalFooter from './ModalFooter';

const CommunicationModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [message, setMessage] = useState("");
   const [disputeStatus, setDisputeStatus] = useState(true);
   const [dispute, setDispute] = useState(new Communication());
   const messagesEndRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => () => { isUnmounted.current = true; }, []);

   useEffect(() => {
      setDispute(props.dispute);
      setDisputeStatus(props.dispute.isOpen!);
   }, [props.dispute]);

   useEffect(() => {
      scrollToBottom();
   }, [dispute]);

   const scrollToBottom = () => {
      messagesEndRef!.current != null && messagesEndRef!.current!.scrollIntoView();
   };

   const sendMessage = () => {
      errorAlert.PleaseWait(500, isUnmounted);
      switch (props.access) {
         case ClientAppAccess.Official:
            useAddMessageOfficialCommunication({
               ...dispute,
               messages: [...props.dispute.messages!, { body: message }]
            }).then(onSuccess).catch(onError);
         case ClientAppAccess.Secret:
            props.useAddMessageSecretCommunication!({
               ...dispute,
               messages: [...props.dispute.messages!, { body: message }],
               isOpen: disputeStatus
            }).then(onSuccess).catch(onError);
         default:
      }
   };

   const deleteQuestion = () => {
      errorAlert.PleaseWait(500, isUnmounted);
      props.useDeleteCommunication!(dispute).then(() => {
         if (isUnmounted.current) return;
         props.onClose();
      }).catch(onError);
   };

   const onSuccess = (result: IReturnUseAddMessageOfficialCommunication) => {
      if (isUnmounted.current) return;
      setMessage("");
      setDispute(result.data);
      errorAlert.setSingleSuccess("updated", `${result.data.type == ContactType.Dispute ? "Dispute" : "Question"} is Updated`);
   };

   const onError = (errors: AlertObj) => {
      if (isUnmounted.current) return;
      errorAlert.set(errors);
   };

   const getChatCss = (isCustomer: boolean | undefined) => {

      switch (props.access) {

         case ClientAppAccess.Secret:
            return isCustomer ? "send" : "receive";
         case ClientAppAccess.Official:
            return !isCustomer ? "send" : "receive";
         default:
            return "";
      }
   };

   return (
      <Modal className="col-11 col-sm-10 col-lg-6 pl-4 pr-4 pb-0 pt-0 "
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <>
            <div className="col-12 pos-t-sticky bg-white pt-3">
               <PageHeader title={`${props.dispute.type == ContactType.Dispute ? "Dispute" : "Question"} ${props.dispute.isOpen ? "" : "Closed"}`} />
               <div className="row">
                  <div className="col">Name : {props.dispute.fullName}</div>
                  {props.access == ClientAppAccess.Secret &&
                     <Toggler
                        className="toggler-xlg circle col pb-3"
                        lblValueTrue="Dispute Open"
                        lblValueFalse="Dispute Closed"
                        value={disputeStatus}
                        onChange={i => { setDisputeStatus(i); }}
                     />
                  }
               </div>
            </div>
            <div className="col-12 pm-0 bg-light-gray">
               {dispute.id != undefined && dispute.messages!.map(message => {
                  return (
                     <div key={message.id} className={`col-10 chat ${getChatCss(message.isCustomer)}`}>
                        <div className="col-12">{message.body}</div>
                        <span className="col-12 time">{new Date(message.date!).ToShortDateTime()}</span>
                     </div>


                  );
               })
               }
               <div ref={messagesEndRef} />
            </div>
            {/***** buttons ****/}
            <div className="col-12 pm-0 pos-b-sticky bg-white pb-3">

               {disputeStatus &&
                  <TextArea className="col-12 " label="Message*" rows={3} value={message}
                     onChange={(i) => { setMessage(i.target.value); }} />
               }
               <Alert alert={errorAlert.alert}
                  className="col-12 mb-2"
                  onClosed={() => { errorAlert.clear(); }}
               />
               <ModalFooter
                  upatedText="Submit"
                  onUpdate={(dispute.isOpen || props.access == ClientAppAccess.Secret) ? sendMessage : undefined}
                  onDelete={(props.dispute.type === ContactType.Dispute || props.access != ClientAppAccess.Secret) ? undefined : deleteQuestion}
                  onCancel={() => { errorAlert.clear(); props.onClose(); }} />
            </div>
         </>
      </Modal >

   );

};

declare type IProps = {
   useAddMessageSecretCommunication?: (modifyCommunication: Communication) => Promise<IReturnUseAddMessageOfficialCommunication>;
   useDeleteCommunication?: (communication: Communication) => Promise<{ data: string, status?: number; }>;
   access: ClientAppAccess;
   dispute: Communication;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;

};
export default CommunicationModal;
