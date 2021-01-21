
import React, { useState } from 'react';

const ButtonCard = (props: IProps) => {
   const [btnName] = useState(typeof (props.children) == "string" ? props.children : "Button");
   return (
      <button className={`btn btn-card ${props.className}`} onClick={props.onClick} name={btnName}>
         <div className={`${props?.cardClassName}`}>
            {props.children}
         </div>
      </button>
   );
};

declare type IProps = {
   children?: any;
   className?: string;
   cardClassName?: string;
   onClick?: () => void;
};
export default ButtonCard;
