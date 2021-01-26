import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from '../components/Modals/Modal';
import Alert, { AlertObj, useAlert } from '../components/Texts/Alert';
import { useConfirmEmailUser } from '../hooks/PublicHooks/useUserHook';

const ConfrimEmail = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const [isOpen, setIsOpen] = useState(true);

   useEffect(() => {
      errorAlert.pleaseWait(isUnmounted);
      useConfirmEmailUser(window.location.pathname).then(() => {
         if (isUnmounted.current) return;
         errorAlert.setSingleSuccess("", "Success");
      }).catch((errors) => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
      return () => { isUnmounted.current = true; };
   }, []);

   useEffect(() => { !isOpen && history.push("/"); }, [isOpen]);

   return (
      <Modal className="col-11 col-sm-10 col-md-9 col-lg-4 pl-4 pr-4"
         isOpen={isOpen}>
         <Alert className="p-5" alert={errorAlert.alert} onClosed={() => setIsOpen(false)} />
      </Modal>
   );
};

declare type IProps = {
};
export default ConfrimEmail;
