import React from 'react';
import DropDown from '../Buttons/DropDown';

const InputDropdown = (props: IProps) => {
   return (
      <div className={`pb-3 m-0 ${props.className}`}>
         <label children={props.label}
            className={`col-form-label pm-0 `} />

         <DropDown title={props.dropdownTitle}
            className="w-100 "
            disabled={props.disabled}
            preventCloseOnClickInsideMenu={props.preventCloseOnClickInsideMenu}
            titleClassName={`btn input-dropdown no-shadow w-100 dropdown-icon ${props.showDanger ? "danger" : ""}`}>
            {props.children}
         </DropDown>
      </div>
   );
};

interface IProps {
   label: string;
   dropdownTitle: string;
   className?: string;
   showDanger?: boolean;
   children: any;
   preventCloseOnClickInsideMenu?: boolean;
   disabled?: boolean;
}
export default InputDropdown;
