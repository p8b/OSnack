import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from '../components/Buttons/Button';
import { Input } from '../components/Inputs/Input';
import Modal from '../components/Modals/Modal';
import Alert, { AlertObj, AlertTypes, Error } from '../components/Texts/Alert';
import PageHeader from '../components/Texts/PageHeader';
import { useResetPasswordWithToken } from '../hooks/apiCallers/user/Put.User';
import { sleep } from '../_core/appFunc';

const ConfrimEmail = (props: IProps) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [redirectToHome, setRedirectToHome] = useState(false);
   const [isDone, setIsDone] = useState(true);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");

   useEffect(() => {

      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useResetPasswordWithToken(window.location.pathname, email, password, true).then(result => {
         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            setAlert(alert.Clear);
            setIsDone(false);
         }
      });
   }, []);

   const onSubmit = () => {
      let errors = new AlertObj([], AlertTypes.Error);
      if (email == "")
         errors.List.push(new Error('0', "Email Is Required"));
      if (password == "")
         errors.List.push(new Error('0', "Password Is Required"));
      if (password !== confirmPassword)
         errors.List.push(new Error('0', "Passwords mismatch."));

      if (errors.List.length > 0) {
         setAlert(errors);
      }
      else {


         sleep(500).then(() => { setAlert(alert.PleaseWait); });
         useResetPasswordWithToken(window.location.pathname, email, password).then(result => {
            if (result.alert.List.length > 0) {
               alert.List = result.alert.List;
               alert.Type = result.alert.Type;
               setAlert(alert);
            }
            else {
               setAlert(alert.addSingleSuccess("Password Updated"));
               setIsDone(true);
            }
         });
      }
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
               <Alert alert={alert} onClosed={() => setAlert(alert.Clear)} />
               <Button children="Continue" className="btn-lg col-12 col-sm-6 mt-2 btn-lg  btn-green"
                  onClick={onSubmit} />
               <Button children="Close" className="btn-lg col-12 col-sm-6 mt-2 btn-lg  btn-white"
                  onClick={() => setRedirectToHome(true)} />
            </>
         }
         {isDone &&
            <Alert alert={alert} onClosed={() => setRedirectToHome(true)} />
         }
      </Modal>
   );
};

declare type IProps = {
};
export default ConfrimEmail;
