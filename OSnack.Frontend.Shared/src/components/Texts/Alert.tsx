import React, { CSSProperties, useRef, useState } from 'react';
import { sleep } from '../../_core/appFunc';

const Alert = (props: IProps) => {
   let bgColor = 'rgb(0, 0, 0)';
   let textColor = 'black';
   switch (props.alert!.Type) {
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
   Success = 0,
   Error = 1,
   Warning = 2,
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
   checkExist(inputName: string = "") {
      return !!this.List!.find(t => t.key!.toLowerCase() === inputName.toLowerCase());
   }
   checkExistFilterRequired(inputName: string = "") {

      const includesError = !!this.List!.find(t => t.key!.toLowerCase() === inputName.toLowerCase() && (t.value as string).includes("Required" || "required"));
      const returnVal = !!this.List!.find(t => t.key!.toLowerCase() === inputName.toLowerCase());
      if (includesError) {
         this.List = this.List.filter(t => t.key!.toLowerCase() !== inputName.toLowerCase());
         if (!this.List!.find(t => t.key!.includes("ErrorRemoved")))
            this.List.push(new ErrorDto("ErrorRemoved", "Highlighted Fields Are Required."));
      }
      return returnVal;
   }
   PleaseWait = () => {
      if (!this.isCleared && this.List.length === 0) {
         this.List = [new ErrorDto("0", "Just a moment please...")];
         this.Type = AlertTypes.Warning;
         return new AlertObj(this.List, this.Type);
      }
      else {
         return this;
      }
   };
   Loading = () => {
      if (!this.isCleared && this.List.length === 0) {
         this.List = [new ErrorDto("0", "Loading...")];
         this.Type = AlertTypes.Warning;
      }
      return new AlertObj(this.List, this.Type);
   };
   Clear = () => {
      this.List = [];
      this.isCleared = true;
      return new AlertObj();
   };
   addSingleWarning(msg: string) {
      this.List = [new ErrorDto("0", msg)];
      this.Type = AlertTypes.Warning;
      return new AlertObj(this.List, this.Type);
   }
   addSingleSuccess(msg: string, key: string = "0") {
      this.List = [new ErrorDto(key, msg)];
      this.Type = AlertTypes.Success;
      return new AlertObj(this.List, this.Type);
   }
}

export const useAlert = (init: AlertObj) => {
   const [alert, setAlert] = useState(init);
   const isWaitNeeded = useRef(true);

   const PleaseWait = (waitms: number = 500, isCancel: React.MutableRefObject<boolean> = useRef(false)) => {
      sleep(waitms, (isCancel && isWaitNeeded)).then(() => {
         setAlert(new AlertObj([new ErrorDto("0", "Just a moment please...")], AlertTypes.Warning));
      });
   };
   const SetSingleSuccess = (key: string, value: string) => {
      isWaitNeeded.current == false;
      setAlert(new AlertObj([new ErrorDto(key, value)], AlertTypes.Success));
   };
   const SetSingleWarning = (key: string, value: string) => {
      isWaitNeeded.current == false;
      setAlert(new AlertObj([new ErrorDto(key, value)], AlertTypes.Warning));
   };
   const set = (value: AlertObj) => {
      isWaitNeeded.current == false;
      setAlert(value);
   };
   const Clear = () => {
      isWaitNeeded.current == false;
      setAlert(new AlertObj());
   };
   return { alert, set, PleaseWait, Clear, SetSingleSuccess, SetSingleWarning };
};
