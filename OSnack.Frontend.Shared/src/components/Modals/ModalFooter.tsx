import React from 'react';
import { Button } from '../Buttons/Button';
import ButtonPopupConfirm from '../Buttons/ButtonPopupConfirm';
const ModalFooter = (props: IProps) => {
   return (
      <div className="row col-12 pm-0 ">
         {props.IsNew ?
            <Button children={props.createText || "Create"}
               className="col-12 mt-2 btn-green col-sm-6 btn-lg"
               onClick={props.onCreate} />
            :
            <div className="row col-12 col-sm-8 pm-0">
               <ButtonPopupConfirm title={props.upatedText || "Update"}
                  popupMessage={props.confirmText || "Are you sure?"}
                  className="col-12 mt-2 col-sm-6"
                  btnClassName="btn-green"
                  onConfirmClick={props.onUpdate}
               />
               <ButtonPopupConfirm title={props.deleteText || "Delete"}
                  popupMessage={props.confirmText || "Are you sure?"}
                  className="col-12 col-sm-6 mt-2"
                  btnClassName="btn-red"
                  onConfirmClick={props.onDelete}
               />
            </div>
         }
         <Button children={props.deleteText || "Cancel"}
            className={`col-12 mt-2 btn-white btn-lg ${props.IsNew ? "col-sm-6" : "col-sm-4"}`}
            onClick={props.onClose} />
      </div>
   );
};

interface IProps {
   createText?: string;
   upatedText?: string;
   deleteText?: string;
   cancelText?: string;
   confirmText?: string;
   IsNew: boolean;
   onCreate: () => void;
   onUpdate: () => void;
   onDelete: () => void;
   onClose: () => void;
}
export default ModalFooter;
