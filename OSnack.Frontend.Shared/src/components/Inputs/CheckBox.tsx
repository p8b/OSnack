import React, { useState } from 'react';

export const CheckBox = (props: IProps) => {
   const [id] = useState(props.id ?? Math.random().toString());
   return (
      <div
         className={`${props?.className}`}
      >
         <input type="checkbox" id={id}
            name={props.label}
            className={`checkbox ${props?.inputClassName}`}
            onChange={i => props!.onChange!(i.target.checked)}
            required={props?.required}
            disabled={props?.disabled} />
         <label className={props?.lblclassName || ''}
            children={props.label}
            htmlFor={id} />
      </div>
   );
};

declare type IProps = {
   inputClassName?: string;
   className?: string;
   required?: boolean;
   disabled?: boolean;
   label: any;
   id?: string;
   lblclassName?: string;
   onChange?: (checked: boolean) => void;
};
