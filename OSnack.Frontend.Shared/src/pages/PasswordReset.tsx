import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Input } from '../components/Inputs/Input';
import Modal from '../components/Modals/Modal';
import ModalFooter from '../components/Modals/ModalFooter';
import Alert, { AlertObj, AlertTypes, ErrorDto, useAlert } from '../components/Texts/Alert';
import PageHeader from '../components/Texts/PageHeader';
import { useUpdatePasswordWithTokenUser } from '../hooks/PublicHooks/useUserHook';

const ConfrimEmail = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [redirectToHome, setRedirectToHome] = useState(false);
   const [isDone, setIsDone] = useState(true);
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");

   useEffect(() => {
      errorAlert.pleaseWait(isUnmounted);
      useUpdatePasswordWithTokenUser({
         pathName: window.location.pathname,
         password: password,
         justCheckToken: true
      }).then((result) => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         setIsDone(false);
      }).catch((errors) => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
   }, []);

   const onSubmit = () => {
      let errors = new AlertObj([], AlertTypes.Error);
      if (password == "")
         errors.List.push(new ErrorDto('0', "Password Is Required"));
      if (password !== confirmPassword)
         errors.List.push(new ErrorDto('0', "Passwords mismatch."));

      if (errors.List.length > 0) {
         errorAlert.set(errors);
      }
      else {
         errorAlert.pleaseWait(isUnmounted);
         useUpdatePasswordWithTokenUser({
            pathName: window.location.pathname,
            password: password,
            justCheckToken: false
         }).then((result) => {
            if (isUnmounted.current) return;
            errorAlert.setSingleSuccess("", "Password Updated");
            setIsDone(true);
         }).catch((errors) => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
         });
      };
   };

   if (redirectToHome) return <Redirect to="" />;

   return (
      <Modal className="col-11 col-sm-10 col-md-9 col-lg-4 pl-4 pr-4"
         isOpen={true}>
         {!isDone &&
            <>
               <PageHeader title="New Password" />
               <Input label="New Password" type="password"
                  value={password}
                  onChange={i => setPassword(i.target.value)}
               />
               <Input label="Confirm New Password" type="password"
                  value={confirmPassword}
                  onChange={i => setConfirmPassword(i.target.value)}
               />
               <Alert alert={errorAlert.alert} onClosed={() => errorAlert.clear()} />
               <ModalFooter
                  createText="Continue"
                  cancelText="Close"
                  onCreate={onSubmit}
                  onCancel={() => setRedirectToHome(true)}
               />
            </>
         }
         {isDone &&
            <Alert alert={errorAlert.alert} onClosed={() => setRedirectToHome(true)} />
         }
      </Modal>
   );
};

declare type IProps = {
};
export default ConfrimEmail;
