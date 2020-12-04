import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Modal from '../components/Modals/Modal';
import Alert, { AlertObj, useAlert } from '../components/Texts/Alert';
import { useConfirmEmailUser } from '../hooks/PublicHooks/useUserHook';

const ConfrimEmail = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [redirectToHome, setRedirectToHome] = useState(false);

   useEffect(() => {
      errorAlert.PleaseWait(500, isUnmounted);
      useConfirmEmailUser(window.location.pathname).then(() => {
         if (isUnmounted.current) return;
         errorAlert.setSingleSuccess("", "Success");
      }).catch((alert) => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
      return () => { isUnmounted.current = true; };
   }, []);

   if (redirectToHome) return <Redirect to="" />;

   return (
      <Modal className="col-11 col-sm-10 col-md-9 col-lg-4 pl-4 pr-4"
         isOpen={true}>
         <Alert alert={errorAlert.alert} onClosed={() => setRedirectToHome(true)} />
      </Modal>
   );
};

declare type IProps = {
};
export default ConfrimEmail;
