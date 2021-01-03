import React, { useEffect, useRef, useState } from 'react';
import { Communication } from '../../_core/apiModels';
import Modal from '../../components/Modals/Modal';
import { IReturnUseAddMessageOfficialCommunication, useAddMessageOfficialCommunication } from '../../hooks/OfficialHooks/useCommunicationHook';
import PageHeader from '../../components/Texts/PageHeader';
import { Button } from '../../components/Buttons/Button';
import { TextArea } from '../../components/Inputs/TextArea';
import { AlertObj, useAlert } from '../../components/Texts/Alert';
import { ClientAppAccess } from '../../_core/constant.Variables';
import { Toggler } from '../Inputs/Toggler';




const DisputeModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [message, setMessage] = useState("");
   const [disputeStatus, setDisputeStatus] = useState(true);
   const [dispute, setDispute] = useState(new Communication());
   const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

   const onSuccess = (result: IReturnUseAddMessageOfficialCommunication) => {
      if (isUnmounted.current) return;
      setMessage("");
      setDispute(result.data);
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
      <Modal className="col-11 col-sm-10 col-lg-6 pm-0 pl-4 pr-4 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <>
            <PageHeader title={`Dispute ${props.dispute.isOpen ? "" : "Closed"}`} />
            <div className=" mt-1">
               <div className="col-12 pm-0">
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
                  {props.access == ClientAppAccess.Secret &&
                     <Toggler
                        className="toggler-xlg circle col-12 pb-3"
                        lblValueTrue="Dispute Open"
                        lblValueFalse="Dispute Closed"
                        value={disputeStatus}
                        onChange={i => { setDisputeStatus(i); }}
                     />
                  }
                  {dispute.isOpen &&
                     <TextArea className="col-12 " label="Message*" rows={3} value={message}
                        onChange={(i) => { setMessage(i.target.value); }} />
                  }
                  <div className="row col-12 pm-0">
                     {(dispute.isOpen || props.access == ClientAppAccess.Secret) &&
                        <Button children="Submit"
                           className={`col-12 col-md-6 mt-2 btn-green btn-lg"}`}
                           onClick={sendMessage} />

                     }
                     <Button children="Close"
                        className={`col-12 ${(dispute.isOpen || props.access == ClientAppAccess.Secret) ? "col-md-6" : ""}  mt-2 btn-white btn-lg`}
                        onClick={() => { props.onClose(); }} />
                  </div>
               </div>
            </div >
         </>
      </Modal >

   );

};

declare type IProps = {
   useAddMessageSecretCommunication?: (modifyCommunication: Communication) => Promise<IReturnUseAddMessageOfficialCommunication>;
   access: ClientAppAccess;
   dispute: Communication;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;

};
export default DisputeModal;
