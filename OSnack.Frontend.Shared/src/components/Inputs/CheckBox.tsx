import React from 'react';

export const CheckBox = (props: IProps) => {
   const key: string = Math.random().toString();
   return (
      <>
         <input type="checkbox" id={key}
            className={`checkbox ${props?.className}`}
            onChange={i => props!.onChange!(i.target.checked)}
            required={props?.required}
            disabled={props?.disabled} />
         <label className={props?.lblclassName || ''}
            children={props.label}
            htmlFor={key} />
      </>
   );
};

declare type IProps = {
   className?: string;
   required?: boolean;
   disabled?: boolean;
   label: any;
   lblclassName?: string;
   onChange?: (checked: boolean) => void;
};
