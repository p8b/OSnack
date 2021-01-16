
import React from 'react';

const ButtonCard = (props: IProps) => {
   return (
      <button className={`btn btn-card ${props.className}`} onClick={props.onClick}>
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
