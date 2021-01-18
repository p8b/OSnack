import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import { Input } from "../Inputs/Input";
import Alert, { AlertObj, useAlert } from "../Texts/Alert";
import { useConfirmCurrentUserPasswordAuthentication } from "../../hooks/OfficialHooks/useAuthenticationHook";
import ModalFooter from "./ModalFooter";

const ConfirmPasswordModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [password, setPassword] = useState("");

   useEffect(() => () => { isUnmounted.current = true; }, []);
   useEffect(() => {
      if (!props.isOpen)
         errorAlert.clear();
   }, [props.isOpen]);

   const onSubmit = (loadingCallBack?: () => void) => {
      errorAlert.pleaseWait(isUnmounted);
      useConfirmCurrentUserPasswordAuthentication(password).then(user => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         props.onSuccess(password, loadingCallBack);
         setPassword("");
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
         loadingCallBack!();
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
         <ModalFooter
            createText="Continue"
            onCreate={onSubmit}
            enableLoadingCreate={isUnmounted}
            onCancel={() => { errorAlert.clear(); props.onClose(); }}
         />
      </Modal >
   );
};
declare type IProps = {
   isOpen: boolean,
   onSuccess: (currentPassword: string, loadingCallBack?: () => void) => void;
   onClose: () => void;
};

export default ConfirmPasswordModal;
