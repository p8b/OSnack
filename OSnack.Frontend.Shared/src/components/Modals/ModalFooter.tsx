import React from 'react';
import { Button } from '../Buttons/Button';
import ButtonPopupConfirm from '../Buttons/ButtonPopupConfirm';
const ModalFooter = (props: IProps) => {
   return (
      <div className="row pm-0 ">
         { props.onCreate &&
            <Button children={props.createText || "Create"}
               className={`col-12 col-md mt-2 btn-green btn-lg ${props.classNameCreate}`}
               onClick={props.onCreate} />
         }
         { props.onUpdate &&
            <ButtonPopupConfirm title={props.upatedText || "Update"}
               popupMessage={props.deleteConfirmText || "Are you sure?"}
               className={`col-12 col-md mt-2 ${props.classNameUpdate}`}
               btnClassName="btn-green"
               onConfirmClick={props.onUpdate}
            />
         }
         { props.onDelete &&
            <ButtonPopupConfirm title={props.deleteText || "Delete"}
               popupMessage={props.deleteConfirmText || "Are you sure?"}
               className={`col-12 col-md mt-2 ${props.deleteConfirmText}`}
               btnClassName="btn-red"
               onConfirmClick={props.onDelete}
            />
         }
         { props.onCancel &&
            <Button children={props.cancelText || "Cancel"}
               className={`col-12 col-md mt-2 btn-white btn-lg ${props.classNameCancel}`}
               onClick={props.onCancel} />
         }
      </div>
   );
};

interface IProps {
   createText?: string;
   upatedText?: string;
   deleteText?: string;
   cancelText?: string;
   classNameCreate?: string;
   classNameUpdate?: string;
   classNameDelete?: string;
   classNameCancel?: string;
   updateConfirmText?: string;
   deleteConfirmText?: string;
   onCreate?: () => void;
   onUpdate?: () => void;
   onDelete?: () => void;
   onCancel?: () => void;
}
export default ModalFooter;
