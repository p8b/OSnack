import React, { useEffect, useRef, useState } from 'react';
import { Communication, ContactType, Message } from '../../_core/apiModels';
import { IReturnUsePutOfficialCommunication, usePutOfficialCommunication } from '../../hooks/OfficialHooks/useCommunicationHook';
import PageHeader from '../Texts/PageHeader';
import { TextArea } from '../Inputs/TextArea';
import Alert, { AlertObj, useAlert } from '../Texts/Alert';
import { AppAccess } from '../../_core/appConst';
import { Toggler } from '../Inputs/Toggler';
import ModalFooter from '../Modals/ModalFooter';

const ShowCommunication = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [message, setMessage] = useState("");
   const [communicationStatus, setCommunicationStatus] = useState(false);
   const [communication, setCommunication] = useState(new Communication());
   const messagesEndRef = useRef<HTMLDivElement | null>(null);
   const containerRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => () => { isUnmounted.current = true; }, []);

   useEffect(() => {
      setCommunication(props.communication);
      setCommunicationStatus(props.communication.status ?? false);
   }, [props.communication]);

   useEffect(() => {
      if (props.isInModal)
         messagesEndRef!.current && messagesEndRef!.current!.scrollIntoView();
      else
         if (messagesEndRef!.current != undefined) {
            if (messagesEndRef.current!.offsetTop < containerRef.current!.scrollTop) {
               containerRef.current!.scrollTop = messagesEndRef.current!.offsetTop;
            } else {
               const offsetBottom = messagesEndRef.current!.offsetTop + messagesEndRef.current!.offsetHeight;
               const scrollBottom = containerRef.current!.scrollTop + containerRef.current!.offsetHeight;
               if (offsetBottom > scrollBottom) {
                  containerRef.current!.scrollTop = offsetBottom - containerRef.current!.offsetHeight;
               }
            }
         }
   }, [communication]);

   const deleteCommunication = (loadingCallBack?: () => void) => {
      errorAlert.pleaseWait(isUnmounted);
      props.useDeleteCommunication!(communication.id || null).then(() => {
         if (isUnmounted.current) return;
         props.onClose!();
         loadingCallBack!();
      }).catch((errors) => onError(errors, loadingCallBack));
   };
   const sendMessage = (loadingCallBack?: () => void) => {
      errorAlert.pleaseWait(isUnmounted);
      switch (props.access) {
         case AppAccess.Client:
            usePutOfficialCommunication({ body: message }, communication.id ?? null)
               .then((result) => onSuccess(result, loadingCallBack))
               .catch((errors) => onError(errors, loadingCallBack));
            break;
         case AppAccess.Admin:
            props.usePutSecretCommunication!({ body: message }, communication.id ?? null, communicationStatus)
               .then((result) => onSuccess(result, loadingCallBack))
               .catch((errors) => onError(errors, loadingCallBack));
            break;
         default:
            break;
      }
   };

   const onSuccess = (result: IReturnUsePutOfficialCommunication, loadingCallBack?: () => void) => {
      if (isUnmounted.current) return;
      setMessage("");
      setCommunication(result.data);
      errorAlert.setSingleSuccess("updated", `${result.data.type == ContactType.Dispute ? "Dispute" : "Question"} is Updated`);
      loadingCallBack!();
      props.onClose && props.onClose!();
   };

   const onError = (errors: AlertObj, loadingCallBack?: () => void) => {
      if (isUnmounted.current) return;
      errorAlert.set(errors);
      loadingCallBack!();
   };

   const getChatCss = (isCustomer?: boolean) => {
      switch (props.access) {
         case AppAccess.Admin:
            return isCustomer ? "incoming" : "outgoing";
         case AppAccess.Client:
            return !isCustomer ? "incoming" : "outgoing";
         default:
            return "";
      }
   };
   return (
      <>
         <div className={`col-12 pm-0 ${props.isInModal && "pos-t-sticky"} pt-3 bg-white`}>
            <PageHeader title={`${communication.type === ContactType.Dispute ? "Dispute" : "Communication"} ${communication.status ? "" : "Closed"}`} />
            {props.access == AppAccess.Admin &&
               <Toggler
                  className="toggler-lg circle col pb-3"
                  lblValueTrue={`${communication.type === ContactType.Dispute ? "Dispute" : "Communication"} Open`}
                  lblValueFalse={`${communication.type === ContactType.Dispute ? "Dispute" : "Communication"} Closed`}
                  value={communicationStatus}
                  onChange={val => { setCommunicationStatus(val); }}
               />
            }
         </div>
         {communication.id != undefined && (communication.messages?.length ?? 0) > 0 &&
            <div className={`col-12 m-0 pt-1 pb-1 bg-light-gray ${!props.isInModal && "show-scroll"}`} ref={containerRef}>
               {communication.messages!.map(message => {
                  return (
                     <div key={message.id} className={`col-10 chat ${getChatCss(message.isCustomer)}`}>
                        <div className="col-12">{message.body}</div>
                        <div className="row col-12 pm-0">
                           <div className="col text-gray small-text line-limit-1">
                              {new Date(message.date!).ToShortDateTime()} - {message.isCustomer ? communication.fullName : "Customer Support"}
                           </div>
                        </div>
                     </div>
                  );
               })
               }
               <div ref={messagesEndRef} />
            </div>
         }
         {/***** buttons ****/}
         <div className={`col-12 pm-0 ${props.isInModal && "pos-t-sticky"} bg-white pb-3 pt-2`}>
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
               classNameCreate={props.isInModal ? undefined : "col-md-auto ml-auto"}
               onCreate={(communicationStatus || communication.status) ? sendMessage : undefined}
               onDelete={(communication.type != ContactType.Dispute && props.access === AppAccess.Admin && !communication.status) ? deleteCommunication : undefined}
               enableLoadingCreate={isUnmounted}
               enableLoadingDelete={isUnmounted}
               onCancel={props.onClose}
            />
         </div>
      </>
   );

};

declare type IProps = {
   usePutSecretCommunication?: (message: Message, communicationId: string | null, status: boolean) => Promise<{ data: Communication, status?: number; }>;
   useDeleteCommunication?: (communicationId: string | null) => Promise<{ data: string, status?: number; }>;
   access: AppAccess;
   communication: Communication;
   onClose?: () => void;
   isInModal?: boolean;
};
export default ShowCommunication;
