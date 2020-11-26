import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Modal from '../components/Modals/Modal';
import Alert, { AlertObj } from '../components/Texts/Alert';
import { useConfirmEmailWithToken } from '../hooks/apiCallers/user/Put.User';
import { sleep } from '../_core/appFunc';

const ConfrimEmail = (props: IProps) => {
   const isUnmounted = useRef(false);
   const [alert, setAlert] = useState(new AlertObj().PleaseWait);
   const [redirectToHome, setRedirectToHome] = useState(false);

   useEffect(() => {

      sleep(500, isUnmounted).then(() => { setAlert(alert.PleaseWait); });
      useConfirmEmailWithToken(window.location.pathname).then(result => {
         if (isUnmounted.current) return;
         if (result.isSuccess) {
            setAlert(alert.addSingleSuccess("Success"));
         }
         else {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         }
      });
      return () => { isUnmounted.current = true; };
   }, []);

   if (redirectToHome) return <Redirect to="" />;

   return (
      <Modal className="col-11 col-sm-10 col-md-9 col-lg-4 pl-4 pr-4"
         isOpen={true}>
         <Alert alert={alert} onClosed={() => setRedirectToHome(true)} />
      </Modal>
   );
};

declare type IProps = {
};
export default ConfrimEmail;
