import React, { useState } from 'react';
const CopyText = (props: IProps) => {
   const [isCopied, setIsCopied] = useState(false);
   const copy = () => {
      navigator.clipboard.writeText(props.text);
      setIsCopied(true);
      const timer = setInterval(() => {
         setIsCopied(false);
         clearInterval(timer);
      }, 2000);
   };
   return (
      <div className={`custom-tooltip ${props.className || ""}`}
         onClick={copy}>
         {props.text}
         <span id="myToolTip"
            className="custom-tooltiptext"
            children={isCopied ? "Copied" : "Copy"} />
      </div>
   );
};
declare type IProps = {
   text: string;
   className?: string;
};
export default CopyText;