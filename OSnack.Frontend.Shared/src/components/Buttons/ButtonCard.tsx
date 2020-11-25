
import React from 'react';

const ButtonCard = (props: IProps) => {
   return (
      <button className="btn btn-card" onClick={props.onClick}>
         <div className={`${props?.cardClassName}`}>
            {props.children}
         </div>
      </button>
   );
};

declare type IProps = {
   children?: any;
   cardClassName?: string;
   onClick?: () => void;
};
export default ButtonCard;
