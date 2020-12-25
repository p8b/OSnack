import React, { useState } from 'react';
const CopyText = (props: IProps) => {
   const [isCopied, setIsCopied] = useState(false);
   const copy = () => {
      navigator.clipboard.writeText(props.copyValue || props.text);
      setIsCopied(true);
      const timer = setInterval(() => {
         setIsCopied(false);
         clearInterval(timer);
      }, 2000);
   };
   return (

      <div className={`${props.noStyle ? "" : "custom-tooltip cursor-pointer"} ${props.className || ""}`}
         onClick={copy}>
         {props.text}
         {!props.noStyle &&
            <span id="myToolTip"
               className="custom-tooltip-text"
               children={isCopied ? "Copied" : "Copy"} />
         }
      </div>
   );
};
declare type IProps = {
   text: string;
   copyValue?: string;
   noStyle?: boolean;
   className?: string;
};
export default CopyText;
