import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { Input } from "../Inputs/Input";
import { Button } from "../Buttons/Button";
import { useConfirmCurrentUserPassword } from "../../hooks/apiCallers/authentication/Post.Authentication";
import Alert, { AlertObj } from "../Texts/Alert";
import { sleep } from "../../_core/appFunc";

const ConfirmPasswordModal = (props: IProps) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [password, setPassword] = useState("");

   useEffect(() => {
      if (!props.isOpen) {
         setAlert(alert.Clear);
      }
   }, [props.isOpen]);

   const onSubmit = async () => {
      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useConfirmCurrentUserPassword(password).then(result => {
         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            setAlert(alert.Clear);
            props.onSuccess(password);
            setPassword("");
         }
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
         <Alert alert={alert} onClosed={() => setAlert(alert.Clear)} />
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