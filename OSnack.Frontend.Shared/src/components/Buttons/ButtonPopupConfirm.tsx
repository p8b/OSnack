
import React, { useState } from 'react';
import { useDetectOutsideClick } from '../../hooks/function/useDetectOutsideClick';
const ButtonPopupConfirm = (props: IProps) => {
   const [id] = useState(Math.random());
   const [toggleDropdown] = useState(React.createRef<HTMLDivElement>());
   const [isOpenDropdown, setIsOpenDropdown] = useDetectOutsideClick([toggleDropdown], false);

   return (
      <div className={`btn-group form dropup p-0 ${props.className}`} ref={toggleDropdown}>
         <div className="col p-0">
            <button id={`${id}`} type="button" className={`btn btn-lg mt-auto col-12 m-0 ${props.btnClassName}`}
               onClick={() => setIsOpenDropdown(prev => !prev)}
               children={`${props.title}${isOpenDropdown ? "?" : ""}`}
            />
            {isOpenDropdown && (
               <span aria-labelledby={`${id}`}
                  className={`col text-center dropdown-menu show ${props.spanClassName}`}>
                  <div className="col-12 text-wrap "
                     children={props.popupMessage}
                  />
                  <div className="dropdown-item p-0 m-0 mt-2">
                     <button type="button" className={"btn btn-sm btn-green col-6 radius-none-l"}
                        onClick={() => {
                           props.onConfirmClick!();
                           setIsOpenDropdown(false);
                        }}
                        children="Yes"
                     />

                     <button type="button" className={"btn btn-sm btn-red col-6 radius-none-r"}
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
   onConfirmClick?(): void;
};
export default ButtonPopupConfirm;
