
import React, { useState } from 'react';
import { useDetectOutsideClick } from '../../hooks/function/useDetectOutsideClick';
const DropDown = (props: IProps) => {
   const [myAccDropDownButton] = useState(React.createRef<HTMLDivElement>());
   const [outsideClickMyAccDropDown, setOutsideClickMyAccDropDown] = useDetectOutsideClick(myAccDropDownButton, false);
   return (
      <div className={`dropdown ${props.className}`} ref={myAccDropDownButton}>
         <div className="col p-0">
            <button tabIndex={0} className={`col btn-no-style ${outsideClickMyAccDropDown ? " show" : ""} `}
               onClick={() => setOutsideClickMyAccDropDown((prev) => !prev)}>
               <div className={` line-limit-1 ${props?.titleClassName}`}>
                  {props.title}
               </div>
            </button>
            <span className={`col dropdown-menu text-center dropdown-menu-right bg-white 
                                    ${outsideClickMyAccDropDown ? " show" : ""}`}>
               {props.children}
            </span>
         </div>
      </div>
   );
};

declare type IProps = {
   className?: string;
   titleClassName?: string;
   title: any;
   children: any;
};
export default DropDown;
