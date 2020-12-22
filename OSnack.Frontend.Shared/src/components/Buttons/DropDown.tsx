
import React, { RefObject, useEffect, useState } from 'react';
import { useDetectOutsideClick } from '../../hooks/function/useDetectOutsideClick';
const DropDown = (props: IProps) => {
   const [dropDown] = useState(React.createRef<HTMLDivElement>());
   const [dropDownButton] = useState(React.createRef<HTMLButtonElement>());
   const [outsideClickDropDownButton, setOutsideClickDropDownButton] = useDetectOutsideClick([props.buttonRef || dropDownButton], false);
   const [outsideClickDropDown, setOutsideClickDropDown] = useDetectOutsideClick([dropDown], false);
   const [isOpen, setIsOpen] = useState(false);

   useEffect(() => {
      if (!props.preventCloseOnClickInsideMenu)
         setIsOpen(outsideClickDropDownButton);
   }, [outsideClickDropDownButton]);
   useEffect(() => {
      if (props.preventCloseOnClickInsideMenu)
         setIsOpen(outsideClickDropDown);
   }, [outsideClickDropDown]);
   useEffect(() => {
      setOutsideClickDropDownButton(isOpen);
      setOutsideClickDropDown(isOpen);
   }, [isOpen]);

   useEffect(() => {
      if (props.forceOpen)
         setIsOpen(true);
   }, [props.forceOpen]);

   return (
      <div className={`dropdown ${props.className}`} ref={dropDown}>
         <div className="col p-0">
            <button disabled={props.disabled} className={`col p-0 btn-no-style ${isOpen ? "show" : ""}`}
               onClick={() => setIsOpen((prev) => !prev)}
               ref={(props.buttonRef || dropDownButton)}>
               <div aria-disabled={props.disabled} className={` line-limit-1 ${props?.titleClassName} ${props.disabled ? "disabled" : ""}`}>
                  {props.title}
               </div>
            </button>
            <span className={`col dropdown-menu text-center dropdown-menu-right bg-white ${isOpen ? " show" : ""}`}>
               {props.children}
            </span>
         </div>
      </div>
   );
};

declare type IProps = {
   className?: string;
   titleClassName?: string;
   preventCloseOnClickInsideMenu?: boolean;
   title: any;
   children: any;
   disabled?: boolean;
   buttonRef?: RefObject<HTMLButtonElement>;
   forceOpen?: boolean;
};
export default DropDown;
