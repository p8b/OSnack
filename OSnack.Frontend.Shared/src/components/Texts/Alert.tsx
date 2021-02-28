import React, { useEffect, useRef, useState } from 'react';
import { sleep } from '../../_core/appFunc';

const Alert = (props: IProps) => {
   return (
      <div className={`row col-12 m-0 my-2 py-2 alert ${props.alert?.Type} ${props?.className ?? ""} ${(props.alert?.List && props.alert?.List.length === 0) ? "d-none" : ""}`}>
         <div className="row col pm-0">
            {props.alert?.List &&
               props.alert!.List.filter(e => !e.excludeFromDisplay).map((error: ErrorDto, index) =>
                  <div className="col-12 pm-0 my-auto" key={error.key || index} children={error.value} />)
            }
         </div>
         <div className="col-auto pm-0 text-right "
            children={<a className="mb-auto" onClick={props.onClosed} children="✘" />}
         />
      </div>
   );
};
export default Alert;
export const useAlert: IUseAlert = (init) => {
   const [alert, setAlert] = useState(init);
   const isWait = useRef(false);
   const isUnmounted = useRef(false);
   useEffect(() => () => {
      isWait.current = false;
      isUnmounted.current = true;
   }, []);

   const pleaseWait = (isCanceled: React.MutableRefObject<boolean>, ms: number = 500) => {
      isWait.current = true;
      setAlert({ ...alert, List: [], Type: AlertTypes.default });
      sleep(ms, isCanceled).then(() => {
         if (alert.List.length === 0 && isWait.current && !isUnmounted.current)
            setAlert({ ...alert, List: [new ErrorDto("0", "Just a moment please...")], Type: AlertTypes.Warning });
      });
   };
   const setSingleSuccess = (key: string, value: string) => {
      if (isUnmounted.current) return;
      isWait.current = false;
      setAlert({ ...alert, List: [new ErrorDto(key, value)], Type: AlertTypes.Success });
   };
   const setSingleWarning = (key: string, value: string) => {
      if (isUnmounted.current) return;
      isWait.current = false;
      setAlert({ ...alert, List: [new ErrorDto(key, value)], Type: AlertTypes.Warning });
   };
   const setSingleError = (key: string, value: string) => {
      if (isUnmounted.current) return;
      isWait.current = false;
      setAlert({ ...alert, List: [new ErrorDto(key, value)], Type: AlertTypes.Error });
   };
   const setSingleDefault = (key: string, value: string) => {
      if (isUnmounted.current) return;
      isWait.current = false;
      setAlert({ ...alert, List: [new ErrorDto(key, value)], Type: AlertTypes.default });
   };
   const set = (value: AlertObj) => {
      if (isUnmounted.current) return;
      isWait.current = false;
      setAlert({ ...alert, List: value.List, Type: value.Type });
   };
   const clear = () => {
      if (isUnmounted.current) return;
      isWait.current = false;
      setAlert({ ...alert, List: [], Type: AlertTypes.default });
   };

   const checkExist = (inputName: string = "") => {
      if (isUnmounted.current) return false;
      if (alert.List != undefined)
         return !!alert.List!.find(t => t.key?.toLowerCase() === inputName?.toLowerCase());
      return false;
   };
   const checkExistFilterRequired = (inputName: string = "") => {
      if (isUnmounted.current) return false;
      const includesError = !!alert.List!.find(t => t.key!.toLowerCase() === inputName.toLowerCase() && (t.value as string).includes("Required" || "required"));
      const returnVal = !!alert.List!.find(t => t.key!.toLowerCase() === inputName.toLowerCase());
      var currentError = alert.List.find(t => t.key!.toLowerCase() == inputName.toLowerCase());
      if (includesError && !currentError?.excludeFromDisplay) {
         currentError!.excludeFromDisplay = true;
         var List = alert.List.filter(t => t.key!.toLowerCase() !== inputName.toLowerCase());
         if (!List.find(t => t.key!.includes("ErrorRemoved")))
            List.push(new ErrorDto("ErrorRemoved", "Highlighted Fields Are Required."));
         List.push(currentError!);
         set(new AlertObj(List, alert.Type));
      }
      return returnVal;
   };
   return {
      alert,
      set,
      pleaseWait,
      clear,
      setSingleSuccess,
      setSingleWarning,
      setSingleError,
      setSingleDefault,
      checkExist,
      checkExistFilterRequired
   };
};

export type IUseAlert = (init: AlertObj) => IUseAlertReturn;
export interface IUseAlertReturn {
   alert: AlertObj;
   set: (value: AlertObj) => void;
   pleaseWait: (isCanceled: React.MutableRefObject<boolean>, ms?: number) => void;
   clear: () => void;
   setSingleSuccess: (key: string, value: string) => void;
   setSingleWarning: (key: string, value: string) => void;
   setSingleError: (key: string, value: string) => void;
   setSingleDefault: (key: string, value: string) => void;
   checkExist: (inputName: string) => boolean;
   checkExistFilterRequired: (inputName: string) => boolean;
};
interface IProps {
   className?: string;
   alert?: AlertObj;
   onClosed?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export enum AlertTypes {
   default = "default",
   Success = "success",
   Error = "error",
   Warning = "warning"
};
export class ErrorDto {
   key: string;
   value: string;
   excludeFromDisplay: boolean = false;
   constructor(key?: string, value?: string) {
      this.key = key ?? "";
      this.value = value ?? "";
   }
}
export class AlertObj {
   List: ErrorDto[];
   Type: AlertTypes;
   httpStatus: number | string;
   isCleared = false;

   constructor(list?: ErrorDto[], type?: AlertTypes, status?: number | string) {
      this.List = list ?? [];
      this.Type = type ?? AlertTypes.default;
      this.httpStatus = status ?? 0;
   }
}
