import React from 'react';
import { Button } from '../Buttons/Button';

const TableRowButtons = (props: IProps) => {

   let classNames = "col-12";
   if (props.btn1ClassName != undefined || props.btn2ClassName != undefined)
      classNames = "col-6";
   if (props.btn1ClassName != undefined && props.btn2ClassName != undefined)
      classNames = "col-4";

   return (
      <>
         {props.btnClassName != "" &&
            <Button className={`${classNames} ${props.btnClassName}  m-0 mt-1 mt-xl-0`}
               onClick={props.btnClick}
               children={props.btnChildren}
            />}
         {props.btn1ClassName != undefined &&
            <Button className={`${classNames} ${props.btn1ClassName}  m-0 mt-1 mt-xl-0`}
               onClick={props.btn1Click}
               children={props.btn2Children}
            />}
         {props.btn2ClassName != undefined &&
            <Button className={`${classNames} ${props.btn2ClassName}  m-0 mt-1 mt-xl-0`}
               onClick={props.btn2Click}
               children={props.btn2Children}
            />}
      </>
   );
};


interface IProps {
   btnClassName: string;
   btnChildren?: any;
   btnClick?: () => void;
   btn1ClassName?: string;
   btn1Children?: any;
   btn1Click?: () => void;
   btn2ClassName?: string;
   btn2Children?: any;
   btn2Click?: () => void;
}
export default TableRowButtons;
