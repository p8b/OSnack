import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import PageHeader from "../Texts/PageHeader";
import { Input } from "../Inputs/Input";
import { Button } from "../Buttons/Button";
import Alert, { AlertObj, useAlert } from "../Texts/Alert";
import { useRequestPasswordResetUser } from "../../hooks/PublicHooks/useUserHook";

const ForgotPasswordModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [email, setEmail] = useState(props.email);
   const [isTokenSent, setIsTokenSent] = useState(false);

   useEffect(() => () => { isUnmounted.current = true; }, []);

   const onSubmit = async () => {
      errorAlert.clear();
      //Submit password reset request
      if (!isTokenSent) {
         errorAlert.pleaseWait(isUnmounted);
         useRequestPasswordResetUser(email).then(() => {
            if (isUnmounted.current) return;
            setIsTokenSent(true);
            errorAlert.setSingleSuccess("", "The Link to reset your password was sent to your email. Please check your Spam folder.");
         }).catch((errors) => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
         });
      }
   };

   return (
      <Modal className="col-11 col-sm-10 col-md-9 col-lg-4 pl-4 pr-4"
         isOpen={props.isOpen}>
         {!isTokenSent &&
            /***** Submit new password reset request ****/
            <>
               <PageHeader title="Forgot Password?" />
               <p>Don't worry, we will email you a link to reset you password.</p>
               <Input label="Email *" type="email" key="email"
                  value={email}
                  onChange={i => setEmail(i.target.value)}
               />

               <Alert alert={errorAlert.alert}
                  className="col-12 mb-2"
                  onClosed={() => errorAlert.clear()}
               />

               <Button children="Continue" className="btn-lg col-12 col-sm-6 mt-2 btn-lg  btn-green"
                  onClick={onSubmit} />

               <Button children="Cancel" className="btn-lg col-12 col-sm-6 mt-2  btn-lg btn-white"
                  onClick={props.onCancel} />
            </>
         }
         {isTokenSent &&
            <>
               <Alert alert={errorAlert.alert}
                  className="col-12 mb-2"
                  onClosed={() => errorAlert.clear()}
               />

               <Button children="Close" className="btn-lg col-12 btn-lg btn-white"
                  onClick={props.onCancel} />
            </>

         }
      </Modal >
   );
};
declare type IProps = {
   email: string,
   isOpen: boolean,
   onCancel: () => void;
};

export default ForgotPasswordModal;
