import React from 'react';

export const TextArea = (props: IProps) => {
   const id: string = Math.random().toString();
   const validationClassName = (targetInput: EventTarget & HTMLTextAreaElement) => {
      const regex = RegExp(props.validationPattern ?? "");
      targetInput.classList.remove("class", "default");
      targetInput.classList.remove("class", "valid");
      targetInput.classList.remove("class", "danger");

      if (targetInput.value.replace(" ", "") === "")
         targetInput.classList.add("default");
      else if (regex.test(targetInput.value))
         targetInput.classList.add("valid");
      else
         targetInput.classList.add("danger");
   };

   return (
      <div className={props.className}>
         <label htmlFor={id}
            className={`col-form-label  pm-0 `}
            children={props.label} />
         <textarea value={props.value} id={id}
            onChange={i => {
               props.onChange!(i);
               props.validationPattern ?? validationClassName(i.target);
            }}
            onBlur={(i) => {
               props.onBlur && props.onBlur(i);
            }}
            rows={props.rows}
            disabled={props.disabled}
            className={`form-control ${props?.showDanger ? "danger" : ""} `}
         />
      </div>
   );
};

declare type IProps = {
   label: string;
   value?: string;
   className?: string;
   disabled?: boolean;
   showDanger?: boolean;
   rows: number;
   validationPattern?: string;
   onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
   onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
};