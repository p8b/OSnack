import React from 'react';
import DropDown from '../Buttons/DropDown';

const InputDropdown = (props: IProps) => {
   return (
      <div className={`pm-0 pb-3  ${props.className}`}>
         <label children={props.label}
            className={`col-form-label pm-0 ${props.labelClassName}`} />

         <DropDown title={props.dropdownTitle}
            className="w-100 "
            disabled={props.disabled}
            preventCloseOnClickInsideMenu={props.preventCloseOnClickInsideMenu}
            titleClassName={`btn input-dropdown no-shadow dropdown-icon ${props.titleClassName} ${props.showDanger ? "danger" : ""}`}>
            {props.children}
         </DropDown>
      </div>
   );
};

interface IProps {
   label: string;
   dropdownTitle: any;
   className?: string;
   labelClassName?: string;
   titleClassName?: string;
   showDanger?: boolean;
   children: any;
   preventCloseOnClickInsideMenu?: boolean;
   disabled?: boolean;
}
export default InputDropdown;
