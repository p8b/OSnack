import React, { useEffect, useRef, useState } from 'react';
import { Communication, ContactType } from '../../_core/apiModels';
import { IReturnUseAddMessageOfficialCommunication, useAddMessageOfficialCommunication } from '../../hooks/OfficialHooks/useCommunicationHook';
import PageHeader from '../Texts/PageHeader';
import { TextArea } from '../Inputs/TextArea';
import Alert, { AlertObj, useAlert } from '../Texts/Alert';
import { ClientAppAccess } from '../../_core/constant.Variables';
import { Toggler } from '../Inputs/Toggler';
import ModalFooter from '../Modals/ModalFooter';
import DropDown from '../Buttons/DropDown';

const ViewCommunication = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [message, setMessage] = useState("");
   const [communicationStatus, setCommunicationStatus] = useState(false);
   const [communication, setCommunication] = useState(new Communication());
   const messagesEndRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => () => { isUnmounted.current = true; }, []);

   useEffect(() => {
      setCommunication(props.communication);
      setCommunicationStatus(props.communication.isOpen ?? false);
   }, [props.communication]);

   useEffect(() => {
      messagesEndRef!.current && messagesEndRef!.current!.scrollIntoView();
   }, [communication]);

   const deleteCommunication = () => {
      errorAlert.PleaseWait(500, isUnmounted);
      props.useDeleteCommunication!(communication.id || null).then(() => {
         if (isUnmounted.current) return;
         props.onClose!();
      }).catch(onError);
   };
   const sendMessage = () => {
      errorAlert.PleaseWait(500, isUnmounted);
      switch (props.access) {
         case ClientAppAccess.Official:
            useAddMessageOfficialCommunication({
               ...communication,
               messages: [...props.communication.messages!, { body: message }]
            }).then(onSuccess).catch(onError);
         case ClientAppAccess.Secret:
            props.useAddMessageSecretCommunication!({
               ...communication,
               messages: [...props.communication.messages!, { body: message }],
               isOpen: communicationStatus
            }).then(onSuccess).catch(onError);
         default:
      }
   };
   const deleteMessage = (messageId?: number) => {
      errorAlert.PleaseWait(500, isUnmounted);
      props.useDeleteMessageCommunication!(communication.id ?? null, messageId ?? 0).then(result => {
         if (isUnmounted.current) return;
         setCommunication(result.data);
         errorAlert.clear();
      }).catch(onError);
   };

   const onSuccess = (result: IReturnUseAddMessageOfficialCommunication) => {
      if (isUnmounted.current) return;
      setMessage("");
      setCommunication(result.data);
      errorAlert.setSingleSuccess("updated", `${result.data.type == ContactType.Dispute ? "Dispute" : "Question"} is Updated`);
   };

   const onError = (errors: AlertObj) => {
      if (isUnmounted.current) return;
      errorAlert.set(errors);
   };

   const getChatCss = (isCustomer?: boolean) => {
      switch (props.access) {
         case ClientAppAccess.Secret:
            return isCustomer ? "incoming" : "outgoing";
         case ClientAppAccess.Official:
            return !isCustomer ? "incoming" : "outgoing";
         default:
            return "";
      }
   };
   return (
      <>
         <div className="col-12 pm-0 pos-t-sticky pt-3 bg-white">
            <PageHeader title={`${communication.type === ContactType.Dispute ? "Dispute" : "Question"} ${communication.isOpen ? "" : "Closed"}`} />
            {props.access == ClientAppAccess.Secret &&
               <Toggler
                  className="toggler-lg circle col pb-3"
                  lblValueTrue="Dispute Open"
                  lblValueFalse="Dispute Closed"
                  value={communicationStatus}
                  onChange={val => { setCommunicationStatus(val); }}
               />
            }
         </div>
         {communication.id != undefined && (communication.messages?.length ?? 0) > 0 &&
            <div className="col-12 m-0 pt-1 pb-1 bg-light-gray overflow-y-auto">
               {communication.messages!.map(message => {
                  return (
                     <div key={message.id} className={`col-10 chat ${getChatCss(message.isCustomer)}`}>
                        <div className="col-12">{message.body}</div>
                        <div className="row col-12 pm-0">
                           <div className="col text-gray small-text line-limit-1">
                              {new Date(message.date!).ToShortDateTime()} - {message.isCustomer ? communication.fullName : "Customer Support"}
                           </div>
                           {props.access === ClientAppAccess.Secret && !message.isCustomer &&
                              <DropDown className="col-auto"
                                 title="...">
                                 <button className="dropdown-item"
                                    onClick={() => { deleteMessage(message.id); }} >
                                    Delete
                           </button>
                              </DropDown>
                           }
                        </div>
                     </div>
                  );
               })
               }
               <div ref={messagesEndRef} />
            </div>
         }
         {/***** buttons ****/}
         <div className="col-12 pm-0 pos-b-sticky bg-white pb-3 pt-2">
            {communicationStatus &&
               <TextArea className="col-12 mt-4 p-0" label="Message*" rows={3} value={message}
                  onChange={(i) => { setMessage(i.target.value); }} />
            }
            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.clear(); }}
            />
            <ModalFooter
               createText="Send"
               cancelText="Close"
               onCreate={(communicationStatus || communication.isOpen) ? sendMessage : undefined}
               onDelete={(communication.type != ContactType.Dispute && props.access === ClientAppAccess.Secret && !communication.isOpen) ? deleteCommunication : undefined}
               onCancel={props.onClose}
            />
         </div>
      </>
   );

};

declare type IProps = {
   useAddMessageSecretCommunication?: (modifyCommunication: Communication) => Promise<{ data: Communication, status?: number; }>;
   useDeleteCommunication?: (communicationId: string | null) => Promise<{ data: string, status?: number; }>;
   useDeleteMessageCommunication?: (communicationId: string | null, messageId: number) => Promise<{ data: Communication, status?: number; }>;
   useUpdateStatusCommunication?: (communicationId: string | null, status: boolean) => Promise<{ data: Communication, status?: number; }>;
   access: ClientAppAccess;
   communication: Communication;
   onClose?: () => void;
};
export default ViewCommunication;
