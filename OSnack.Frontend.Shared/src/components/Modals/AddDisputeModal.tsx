import React, { useContext, useEffect, useRef, useState } from 'react';
import { Communication, ContactType, Order } from '../../_core/apiModels';
import Modal from '../../components/Modals/Modal';
import { usePostDisputeCommunication } from '../../hooks/OfficialHooks/useCommunicationHook';
import PageHeader from '../../components/Texts/PageHeader';
import { AuthContext } from '../../_core/authenticationContext';
import { TextArea } from '../../components/Inputs/TextArea';
import Alert, { AlertObj, useAlert } from '../../components/Texts/Alert';
import ModalFooter from './ModalFooter';




const AddDisputeModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const auth = useContext(AuthContext);
   const [message, setMessage] = useState("");

   useEffect(() => () => { isUnmounted.current = true; }, []);

   const sendMessage = (loadingCallBack?: () => void) => {
      errorAlert.pleaseWait(isUnmounted);
      usePostDisputeCommunication({
         email: auth.state.user.email,
         type: ContactType.Dispute,
         order_Id: props.order.id,
         status: true,
         messages: [{ body: message }]
      }).then((result) => {
         if (isUnmounted.current) return;
         setMessage("");
         props.onClose(result.data);
         loadingCallBack!();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
         loadingCallBack!();
      });
   };

   return (
      <Modal className="col-11 col-sm-10 col-lg-4 pm-0 pl-4 pr-4 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <>
            <PageHeader title="Dispute" />
            <div className="row  mt-1">
               <TextArea className="col-12" label="Message*" rows={3} value={message}
                  onChange={(i) => { setMessage(i.target.value); }} />

               <Alert alert={errorAlert.alert}
                  className="col-12 mb-2"
                  onClosed={() => errorAlert.clear()} />
               <ModalFooter
                  createText="Submit"
                  onCreate={sendMessage}
                  enableLoadingCreate={isUnmounted}
                  onCancel={() => { errorAlert.clear(); props.onClose(); }}
               />
            </div >
         </>
      </Modal >

   );

};

declare type IProps = {
   order: Order;
   isOpen: boolean;
   onClose: (dispute?: Communication) => void;
   modalRef?: any;
};
export default AddDisputeModal;
