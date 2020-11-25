import React, { CSSProperties } from 'react';

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
            children={props.alert!.List.map((error: Error) => <div key={error.key} children={error.value} />)}
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


export class Error {
   key?: string;
   value?: string | any;
   constructor(key?: string | number, value?: string | any) {
      this.key = key?.toString();
      this.value = value;
   };

};

export class AlertObj {
   List: Error[] = [];
   Type?: AlertTypes;
   isCleared = false;

   constructor(list?: Error[], type?: AlertTypes) {
      this.List = list ?? [];
      this.Type = type;
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
            this.List.push(new Error("ErrorRemoved", "Highlighted Fields Are Required."));
      }
      return returnVal;
   }
   PleaseWait = () => {
      if (!this.isCleared && this.List.length === 0) {
         this.List = [new Error("0", "Just a moment please...")];
         this.Type = AlertTypes.Warning;
      }
      return new AlertObj(this.List, this.Type);
   };
   Loading = () => {
      if (!this.isCleared && this.List.length === 0) {
         this.List = [new Error("0", "Loading...")];
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
      this.List = [new Error("0", msg)];
      this.Type = AlertTypes.Warning;
      return new AlertObj(this.List, this.Type);
   }
   addSingleSuccess(msg: string) {
      this.List = [new Error("0", msg)];
      this.Type = AlertTypes.Success;
      return new AlertObj(this.List, this.Type);
   }
}



