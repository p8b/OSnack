
import React, { useEffect, useRef, useState } from 'react';
import { useDetectOutsideClick } from '../../hooks/function/useDetectOutsideClick';
import { Button } from './Button';
const ButtonPopupConfirm = (props: IProps) => {
   useEffect(() => () => { isWait.current = true; }, []);
   const isWait = useRef(false);
   const [id] = useState(Math.random());
   const [toggleDropdown] = useState(React.createRef<HTMLDivElement>());
   const [isOpenDropdown, setIsOpenDropdown] = useDetectOutsideClick([toggleDropdown], false);

   return (
      <div className={`btn-group form dropup p-0 ${props.className}`} ref={toggleDropdown}>
         <div className="col p-0">
            <Button className={`btn-lg mt-auto col-12 m-0 ${props.btnClassName}`}
               onClick={() => { if (isWait.current) return; setIsOpenDropdown(prev => !prev); }}
               children={`${props.title}${isOpenDropdown ? "?" : ""}`}
            />
            {isOpenDropdown && (
               <span aria-labelledby={`${id}`}
                  className={`col text-center dropdown-menu show ${props.spanClassName}`}>
                  <div className="col-12 text-wrap "
                     children={props.popupMessage}
                  />
                  <div className="dropdown-item pm-0 mt-2">
                     <Button className={"btn-sm btn-green col-6 radius-none-l"}
                        onClick={(loadingCallBack, event) => {
                           if (isWait.current) return;
                           props.onConfirmClick!(loadingCallBack, event);
                           //setIsOpenDropdown(false);
                        }}
                        children="Yes"
                        enableLoading={isWait}
                     />

                     <Button className={"btn-sm btn-red col-6 radius-none-r"}
                        onClick={() => setIsOpenDropdown(false)}
                        children="No"
                     />
                  </div>
               </span>
            )}
         </div>
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
