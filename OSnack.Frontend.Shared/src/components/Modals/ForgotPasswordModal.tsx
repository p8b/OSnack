import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import PageHeader from "../Texts/PageHeader";
import { Input } from "../Inputs/Input";
import { Button } from "../Buttons/Button";
import { useRequestPasswordResetToken } from "../../hooks/apiCallers/user/Post.User";
import Alert, { AlertObj } from "../Texts/Alert";
import { sleep } from "../../_core/appFunc";

const ForgotPasswordModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const [alert, setAlert] = useState(new AlertObj());
   const [email, setEmail] = useState(props.email);
   const [isTokenSent, setIsTokenSent] = useState(false);

   useEffect(() => () => { isUnmounted.current = true; }, []);

   const onSubmit = async () => {
      setAlert(alert.Clear);
      //Submit password reset request
      if (!isTokenSent) {
         sleep(500, isUnmounted).then(() => { setAlert(alert.PleaseWait); });
         useRequestPasswordResetToken(email).then(result => {
            if (isUnmounted.current) return;
            if (!result.isTokenSent && result.alert.List.length > 0) {
               alert.List = result.alert.List;
               alert.Type = result.alert.Type;
               setAlert(alert);
            } else {
               setIsTokenSent(true);
               setAlert(alert.addSingleSuccess("The Link to reset your password was sent to your email. Please check your Spam folder."));
            }
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

               <Alert alert={alert}
                  className="col-12 mb-2"
                  onClosed={() => setAlert(alert.Clear)}
               />

               <Button children="Continue" className="btn-lg col-12 col-sm-6 mt-2 btn-lg  btn-green"
                  onClick={onSubmit} />

               <Button children="Cancel" className="btn-lg col-12 col-sm-6 mt-2  btn-lg btn-white"
                  onClick={props.onCancel} />
            </>
         }
         {isTokenSent &&
            <>
               <Alert alert={alert}
                  className="col-12 mb-2"
                  onClosed={() => setAlert(alert.Clear)}
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