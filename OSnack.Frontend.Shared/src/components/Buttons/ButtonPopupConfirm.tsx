
import React, { useEffect, useRef, useState } from 'react';
import { useDetectOutsideClick } from '../../hooks/function/useDetectOutsideClick';
import { Button } from './Button';
const ButtonPopupConfirm = (props: IProps) => {
   const isUnmount = useRef(false);
   const loadingCallBackSave = useRef<() => void | undefined>();
   const [toggleDropdown] = useState(React.createRef<HTMLDivElement>());
   const [isOpenDropdown, setIsOpenDropdown] = useDetectOutsideClick([toggleDropdown], false);
   useEffect(() => () => { isUnmount.current = true; }, []);
   useEffect(() => {
      if (!isOpenDropdown && props.enableLoading && loadingCallBackSave.current) {
         loadingCallBackSave.current!();
      }
   }, [isOpenDropdown]);



   return (
      <div className={`col btn-group form dropup p-0 ${props.className}`} ref={toggleDropdown}>
         <Button className={`btn-lg mt-auto col-12 m-0 ${props.btnClassName}`}
            onClick={(loadingCallBack, event) => {
               if (isUnmount.current) return;
               if (props.enableLoading)
                  loadingCallBackSave.current = loadingCallBack;
               setIsOpenDropdown(prev => !prev);
            }}
            children={`${props.title}${isOpenDropdown ? "?" : ""}`}
            enableLoading={props.enableLoading}
         />
         <span className={`col text-center dropdown-menu ${isOpenDropdown ? "show" : ""} ${props.spanClassName}`}>
            <div className="col-12 text-wrap "
               children={props.popupMessage}
            />
            <div className="dropdown-item pm-0 mt-2">
               <Button className={"btn-sm btn-green col-6 radius-none-l"}
                  onClick={(loadingCallBack, event) => {
                     if (isUnmount.current) return;
                     if (props.enableLoading)
                        props.onConfirmClick!(loadingCallBackSave.current, event);
                     else
                        props.onConfirmClick!(undefined, event);
                     setIsOpenDropdown(false);
                  }}
                  children="Yes"
               />

               <Button className={"btn-sm btn-red col-6 radius-none-r"}
                  onClick={() => { setIsOpenDropdown(false); }}
                  children="No"
               />
            </div>
         </span>
      </div>
   );
};

declare type IProps = {
   title?: string;
   className?: string;
   btnClassName?: string;
   spanClassName?: string;
   popupMessage?: string;
   onConfirmClick?: (loadingCallBack?: () => void, event?: React.MouseEvent<HTMLButtonElement>) => void;
   enableLoading?: React.MutableRefObject<boolean>;
};
export default ButtonPopupConfirm;
