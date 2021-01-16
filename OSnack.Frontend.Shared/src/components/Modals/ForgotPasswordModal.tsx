import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import PageHeader from "../Texts/PageHeader";
import { Input } from "../Inputs/Input";
import Alert, { AlertObj, useAlert } from "../Texts/Alert";
import { useRequestPasswordResetUser } from "../../hooks/PublicHooks/useUserHook";
import ModalFooter from "./ModalFooter";

const ForgotPasswordModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [email, setEmail] = useState(props.email);
   const [isTokenSent, setIsTokenSent] = useState(false);

   useEffect(() => () => { isUnmounted.current = true; }, []);

   const onSubmit = (loadingCallBack?: () => void) => {
      errorAlert.clear();
      //Submit password reset request
      if (!isTokenSent) {
         errorAlert.pleaseWait(isUnmounted);
         useRequestPasswordResetUser(email).then(() => {
            if (isUnmounted.current) return;
            setIsTokenSent(true);
            errorAlert.setSingleSuccess("", "The Link to reset your password was sent to your email. Please check your Spam folder.");
            loadingCallBack!();
         }).catch((errors) => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
            loadingCallBack!();
         });
      }
   };

   return (
      <Modal className="col-11 col-sm-10 col-md-9 col-lg-4 pl-4 pr-4"
         isOpen={props.isOpen}>
         {!isTokenSent &&
            <>
               <PageHeader title="Forgot Password?" />
               <p>Don't worry, we will email you a link to reset you password.</p>
               <Input label="Email *" type="email" key="email"
                  value={email}
                  onChange={i => setEmail(i.target.value)}
               />
            </>
         }
         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => errorAlert.clear()}
         />
         <ModalFooter
            createText="Submit"
            onCreate={!isTokenSent ? onSubmit : undefined}
            enableLoadingCreate={isUnmounted}
            onCancel={props.onCancel}
         />
      </Modal >
   );
};
declare type IProps = {
   email: string,
   isOpen: boolean,
   onCancel: () => void;
};

export default ForgotPasswordModal;
