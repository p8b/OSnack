import React from 'react';
import { Button } from '../Buttons/Button';
import ButtonPopupConfirm from '../Buttons/ButtonPopupConfirm';
const ModalFooter = (props: IProps) => {
   return (
      <div className="row pm-0 ">
         { props.onCreate &&
            <Button children={props.createText || "Create"}
               className={`col-12 col-md mt-2 btn-green btn-lg ${props.classNameCreate}`}
               onClick={props.onCreate}
               enableLoading={props.enableLoadingCreate} />
         }
         { props.onUpdate &&
            <ButtonPopupConfirm title={props.updateText || "Update"}
               popupMessage={props.updateConfirmText || "Are you sure?"}
               className={`col-12 col-md mt-2 ${props.classNameUpdate}`}
               btnClassName="btn-green"
               onConfirmClick={props.onUpdate}
               enableLoading={props.enableLoadingUpdate}
            />
         }
         { props.onDelete &&
            <ButtonPopupConfirm title={props.deleteText || "Delete"}
               popupMessage={props.deleteConfirmText || "Are you sure?"}
               className={`col-12 col-md mt-2 ${props.deleteConfirmText}`}
               btnClassName="btn-red"
               onConfirmClick={props.onDelete}
               enableLoading={props.enableLoadingDelete}
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
   updateText?: string;
   deleteText?: string;
   cancelText?: string;
   classNameCreate?: string;
   classNameUpdate?: string;
   classNameDelete?: string;
   enableLoadingCreate?: React.MutableRefObject<boolean>;
   enableLoadingUpdate?: React.MutableRefObject<boolean>;
   enableLoadingDelete?: React.MutableRefObject<boolean>;
   classNameCancel?: string;
   updateConfirmText?: string;
   deleteConfirmText?: string;
   onCreate?: (loadingCallBack?: () => void, event?: React.MouseEvent<HTMLButtonElement>) => void;
   onUpdate?: (loadingCallBack?: () => void, event?: React.MouseEvent<HTMLButtonElement>) => void;
   onDelete?: (loadingCallBack?: () => void, event?: React.MouseEvent<HTMLButtonElement>) => void;
   onCancel?: (loadingCallBack?: () => void, event?: React.MouseEvent<HTMLButtonElement>) => void;
}
export default ModalFooter;
