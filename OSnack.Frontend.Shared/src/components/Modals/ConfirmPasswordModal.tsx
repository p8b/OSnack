import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import { Input } from "../Inputs/Input";
import { Button } from "../Buttons/Button";
import Alert, { AlertObj, useAlert } from "../Texts/Alert";
import { useConfirmCurrentUserPasswordAuthentication } from "../../hooks/OfficialHooks/useAuthenticationHook";

const ConfirmPasswordModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [password, setPassword] = useState("");

   useEffect(() => () => { isUnmounted.current = true; }, []);
   useEffect(() => {
      if (!props.isOpen)
         errorAlert.clear();
   }, [props.isOpen]);

   const onSubmit = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      useConfirmCurrentUserPasswordAuthentication(password).then(user => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         props.onSuccess(password);
         setPassword("");
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };
   return (
      <Modal className="col-11 col-sm-10 col-md-9 col-lg-4 pl-4 pr-4"
         isOpen={props.isOpen}>
         <p>Please Confirm your current password to continue.</p>
         <Input label="Password" type="password" key="password"
            value={password}
            onChange={i => setPassword(i.target.value)}
         />
         <Alert alert={errorAlert.alert} onClosed={() => errorAlert.clear()} />
         <Button children="Continue" className="btn-lg col-12 col-sm-6 mt-2 btn-lg  btn-green"
            onClick={onSubmit} />

         <Button children="Cancel" className="btn-lg col-12 col-sm-6 mt-2  btn-lg btn-white"
            onClick={props.onCancel} />
      </Modal >
   );
};
declare type IProps = {
   isOpen: boolean,
   onSuccess: (currentPassword: string) => void;
   onCancel: () => void;
};

export default ConfirmPasswordModal;
