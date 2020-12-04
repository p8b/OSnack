import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from '../components/Buttons/Button';
import { Input } from '../components/Inputs/Input';
import Modal from '../components/Modals/Modal';
import Alert, { AlertObj, AlertTypes, ErrorDto, useAlert } from '../components/Texts/Alert';
import PageHeader from '../components/Texts/PageHeader';
import { useUpdatePasswordWithTokenUser } from '../hooks/PublicHooks/useUserHook';

const ConfrimEmail = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [redirectToHome, setRedirectToHome] = useState(false);
   const [isDone, setIsDone] = useState(true);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");

   useEffect(() => {
      errorAlert.PleaseWait(500, isUnmounted);
      useUpdatePasswordWithTokenUser({
         pathName: window.location.pathname,
         email: email,
         password: password,
         justCheckToken: true
      }).then((user) => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         setIsDone(false);
      }).catch((alert) => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   }, []);

   const onSubmit = () => {
      let errors = new AlertObj([], AlertTypes.Error);
      if (email == "")
         errors.List.push(new ErrorDto('0', "Email Is Required"));
      if (password == "")
         errors.List.push(new ErrorDto('0', "Password Is Required"));
      if (password !== confirmPassword)
         errors.List.push(new ErrorDto('0', "Passwords mismatch."));

      if (errors.List.length > 0) {
         errorAlert.set(errors);
      }
      else {


         errorAlert.PleaseWait(500, isUnmounted);
         useUpdatePasswordWithTokenUser({
            pathName: window.location.pathname,
            email: email,
            password: password,
            justCheckToken: false
         }).then((user) => {
            if (isUnmounted.current) return;
            errorAlert.setSingleSuccess("", "Password Updated");
            setIsDone(true);
         }).catch((alert) => {
            if (isUnmounted.current) return;
            errorAlert.set(alert);
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

               <Input label="Email" type="email"
                  value={email}
                  onChange={i => setEmail(i.target.value)}
               />
               <Input label="New Password" type="password"
                  value={password}
                  onChange={i => setPassword(i.target.value)}
               />
               <Input label="Confirm New Password" type="password"
                  value={confirmPassword}
                  onChange={i => setConfirmPassword(i.target.value)}
               />
               <Alert alert={errorAlert.alert} onClosed={() => errorAlert.clear()} />
               <Button children="Continue" className="btn-lg col-12 col-sm-6 mt-2 btn-lg  btn-green"
                  onClick={onSubmit} />
               <Button children="Close" className="btn-lg col-12 col-sm-6 mt-2 btn-lg  btn-white"
                  onClick={() => setRedirectToHome(true)} />
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
