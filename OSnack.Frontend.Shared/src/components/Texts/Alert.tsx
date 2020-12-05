import React, { CSSProperties, useRef, useState } from 'react';
import { sleep } from '../../_core/appFunc';

const Alert = (props: IProps) => {
   let bgColor = 'rgb(0, 0, 0)';
   let textColor = 'black';
   switch (props.alert!.Type) {
      case AlertTypes.default:
         bgColor = 'white';
         textColor = 'black';
         break;
      case AlertTypes.Warning:
         bgColor = 'rgb(255, 221, 70)';
         textColor = 'black';
         break;
      case AlertTypes.Error:
         bgColor = 'rgb(135, 35, 35)';
         textColor = 'white';
         break;
      case AlertTypes.Success:
         bgColor = 'rgb(35, 135, 62)';
         textColor = 'white';
         break;
      default:
         break;
   }
   let style: CSSProperties = {
      'backgroundColor': bgColor,
      'fontWeight': 600,
      'color': textColor,
      'padding': '5px',
   };
   return (
      <div style={style} className={`row col-12 m-0 mt-2 mb-2 ${props?.className ?? ""} ${(props.alert!.List.length === 0) ? "d-none" : ""}`}>
         <div className="col-11"
            children={props.alert!.List.map((error: ErrorDto) => <div key={error.key} children={error.value} />)}
         />
         <div className="col-1 p-0 pr-2 text-right"
            children={<a onClick={props.onClosed} children="✘" />}
         />
      </div>
   );
};

interface IProps {
   className?: string;
   alert?: AlertObj;
   onClosed?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}
export default Alert;

export enum AlertTypes {
   default = 0,
   Success = 1,
   Error = 2,
   Warning = 3,
};
export class ErrorDto {
   key?: string | undefined;
   value?: string | undefined;
   constructor(key: string = "", value: string = "") {
      this.key = key;
      this.value = value;
   }
}
export class AlertObj {
   List: ErrorDto[] = [];
   Type?: AlertTypes;
   httpStatus?: number | string;
   isCleared = false;

   constructor(list?: ErrorDto[], type?: AlertTypes, status?: number | string) {
      this.List = list ?? [];
      this.Type = type;
      this.httpStatus = status;
   }
}

export const useAlert = (init: AlertObj) => {
   const [alert, setAlert] = useState(init);
   const isWaitCanceled = useRef(false);

   const PleaseWait = (ms: number = 500, isCanceled: React.MutableRefObject<boolean> = useRef(false)) => {
      isWaitCanceled.current = false;

      sleep(ms, isCanceled).then(() => {
         if (alert.List.length === 0 && !isWaitCanceled.current)
            setAlert({ ...alert, List: [new ErrorDto("0", "Just a moment please...")], Type: AlertTypes.Warning });
      });
   };
   const setSingleSuccess = (key: string, value: string) => {
      isWaitCanceled.current = true;
      setAlert({ ...alert, List: [new ErrorDto(key, value)], Type: AlertTypes.Success });
   };
   const setSingleWarning = (key: string, value: string) => {
      isWaitCanceled.current = true;
      setAlert({ ...alert, List: [new ErrorDto(key, value)], Type: AlertTypes.Warning });
   };
   const set = (value: AlertObj) => {
      isWaitCanceled.current = true;
      setAlert({ ...alert, List: value.List, Type: value.Type });
   };
   const clear = () => {
      isWaitCanceled.current = true;
      setAlert({ ...alert, List: [], Type: AlertTypes.default });
   };

   const checkExist = (inputName: string = "") => {
      return !!alert.List!.find(t => t.key?.toLowerCase() === inputName?.toLowerCase());
   };
   const checkExistFilterRequired = (inputName: string = "") => {

      const includesError = !!alert.List!.find(t => t.key!.toLowerCase() === inputName.toLowerCase() && (t.value as string).includes("Required" || "required"));
      const returnVal = !!alert.List!.find(t => t.key!.toLowerCase() === inputName.toLowerCase());
      if (includesError) {
         var List = alert.List.filter(t => t.key!.toLowerCase() !== inputName.toLowerCase());
         if (!List.find(t => t.key!.includes("ErrorRemoved")))
            List.push(new ErrorDto("ErrorRemoved", "Highlighted Fields Are Required."));
         set(new AlertObj(List, alert.Type));
      }
      return returnVal;
   };
   return { alert, set, PleaseWait, clear, setSingleSuccess, setSingleWarning, checkExist, checkExistFilterRequired };
};
