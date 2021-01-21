
import React, { RefObject, useEffect, useState } from 'react';
import { useDetectOutsideClick } from '../../hooks/function/useDetectOutsideClick';
const DropDown = (props: IProps) => {
   const [btnName] = useState(typeof (props.children) == "string" ? props.children : "Button");
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
      <div className={`col p-0 dropdown ${props.className!}`} ref={dropDown}>
         <button disabled={props.disabled} className={`col p-0 btn-no-style ${isOpen ? "show" : ""}`}
            name={btnName}
            onClick={() => setIsOpen((prev) => !prev)}
            ref={(props.buttonRef || dropDownButton)}>
            {React.isValidElement(props.title) ? props.title :
               <span className={`line-limit-1  ${props?.titleClassName!} ${props.disabled ? "disabled" : ""}`}
                  children={props.title}
               />
            }
         </button>
         <span className={`col dropdown-menu text-center dropdown-menu-right bg-white ${props.menuClassName ?? ""} ${isOpen ? " show" : ""}`}>
            {props.children}
         </span>
      </div>
   );
};

declare type IProps = {
   className?: string;
   titleClassName?: string;
   menuClassName?: string;
   preventCloseOnClickInsideMenu?: boolean;
   title: any;
   children: any;
   disabled?: boolean;
   buttonRef?: RefObject<HTMLButtonElement>;
   forceOpen?: boolean;
};
export default DropDown;
