import React, { useContext, useEffect, useRef, useState } from 'react';
import { Communication, ContactType, Order } from '../../_core/apiModels';
import Modal from '../../components/Modals/Modal';
import { usePostDisputeCommunication } from '../../hooks/OfficialHooks/useCommunicationHook';
import PageHeader from '../../components/Texts/PageHeader';
import { Button } from '../../components/Buttons/Button';
import { AuthContext } from '../../_core/authenticationContext';
import { TextArea } from '../../components/Inputs/TextArea';
import { AlertObj, useAlert } from '../../components/Texts/Alert';




const AddDisputeModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const auth = useContext(AuthContext);
   const [message, setMessage] = useState("");

   useEffect(() => () => { isUnmounted.current = true; }, []);

   const sendMessage = () => {
      errorAlert.PleaseWait(500, isUnmounted);
      usePostDisputeCommunication({
         email: auth.state.user.email,
         type: ContactType.Dispute,
         order_Id: props.order.id,
         isOpen: true,
         messages: [{ body: message }]
      }).then((result) => {
         if (isUnmounted.current) return;
         setMessage("");
         props.onClose(result.data);
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
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
   order: Order;
   isOpen: boolean;
   onClose: (dispute?: Communication) => void;
   modalRef?: any;
};
export default AddDisputeModal;
