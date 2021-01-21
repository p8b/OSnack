import React, { useEffect, useState } from 'react';

export const Input = (props: IProps) => {
   const [id] = useState(props.id ?? Math.random().toString());
   const [lblPos, setLblPos] = useState("lower");
   const [lblInvalidInput, setLblInvalidInput] = useState("");

   const validationClassName = (targetInput: EventTarget & HTMLInputElement) => {
      const regex = RegExp(props.validationPattern || "");
      targetInput.classList.remove("class", "default");
      targetInput.classList.remove("class", "valid");
      targetInput.classList.remove("class", "danger");

      if (targetInput.value.ReplaceAll(" ", "") === "")
         targetInput.classList.add("default");
      else if (regex.test(targetInput.value))
         targetInput.classList.add("valid");
      else
         targetInput.classList.add("danger");
   };

   const lblPosition = (val: string) => {

      //@ts-ignore
      if (val === "" && document.getElementById(id).checkValidity())
         setLblPos("lower");
      else
         setLblPos("");
   };
   useEffect(() => {
      lblPosition(props.value?.toString() || "");
   }, [props.value]);
   return (
      <div className={`mb-3 ${props.className}`}>
         <label children={`${props.label ?? "input label"} ${lblInvalidInput}`} htmlFor={id} onClick={() => { document.getElementById(id)?.focus(); }}
            className={`col-form-label pm-0 ${lblPos} ${props.label ?? "d-none"}`} />
         <input id={id} ref={props.ref} type={props?.type || "text"}
            className={`line-limit-1 ${props.showDanger ? "danger" : ""} ${props.showValid ? "valid" : ""} ${props.inputClassName || ""}`}
            name="Quantity"
            value={props.value ?? ""}
            onFocus={i => { lblPosition("initial"); }}
            step="any"
            onChange={i => {
               props.onChange(i);
               props.validationPattern && validationClassName(i.target);
            }}
            onBlur={(i) => {
               lblPosition(i.target.value);
               props.onBlur && props.onBlur(i);
            }}
            placeholder={props.placeholder}
            min={props.positiveNumbersOnly ? "0" : undefined}
            disabled={props.disabled || false}
            onKeyDown={e => {
               if (e.key === 'Enter' && props.onPressedEnter)
                  props.onPressedEnter!();
               const invalidChars = ["-", "+", "e", "E"];
               if (props.positiveNumbersOnly && invalidChars.includes(e.key)) {
                  e.preventDefault();
               }
            }}
            onKeyUp={() => {
               //@ts-ignore
               if (!document.getElementById(id).checkValidity()) {
                  setLblInvalidInput("(Invalid Value)");
               } else {
                  setLblInvalidInput("");
               }
            }}
         />
         {props.inputRightLable &&
            <span className="input-right-label"
               children={props.inputRightLable} />
         }
      </div>
   );
};

interface IProps {
   id?: string;
   ref?: React.RefObject<HTMLInputElement>;
   label?: string;
   placeholder?: string;
   value: string | number | undefined;
   className?: string;
   inputClassName?: string;
   inputRightLable?: string;
   type?: string;
   disabled?: boolean;
   showDanger?: boolean;
   showValid?: boolean;
   validationPattern?: string;
   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
   onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
   onPressedEnter?: () => void;
   positiveNumbersOnly?: boolean;
}
