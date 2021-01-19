import React from 'react';
import DropDown from '../Buttons/DropDown';

const InputDropdown = (props: IProps) => {
   return (
      <div className={`pb-3 ${props.className}`}>
         {props.label &&
            <label children={props.label}
               className={`col-form-label pm-0 ${props.labelClassName}`} />
         }

         <DropDown
            title={
               <div className={`col input-dropdown ${props.showDanger ? "danger" : ""}`}>
                  <div className={`row pm-0 `}>
                     <div className={`line-limit-1 col pm-0 no-shadow  ${props.titleClassName}`}>{props.dropdownTitle}</div>
                     <div className="dropdown-icon col-auto pm-0" />
                  </div>
               </div>
            }
            className={`${props.dropdownClassName}`}
            disabled={props.disabled}
            preventCloseOnClickInsideMenu={props.preventCloseOnClickInsideMenu}>
            {props.children}
         </DropDown>
      </div>
   );
};

interface IProps {
   label?: string;
   dropdownTitle: any;
   dropdownClassName?: string;
   className?: string;
   labelClassName?: string;
   titleClassName?: string;
   showDanger?: boolean;
   children: any;
   preventCloseOnClickInsideMenu?: boolean;
   disabled?: boolean;
}
export default InputDropdown;
