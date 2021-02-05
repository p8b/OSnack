import React, { useEffect, useRef, useState } from 'react';
import { sleep } from '../../_core/appFunc';

export const Button = (props: IProps) => {
   const [id] = useState(props.id ?? Math.random().toString());
   const [btnName] = useState(typeof (props.children) == "string" ? props.children : "Button");
   const [loading, setLoading] = useState(false);
   const [disable, setDisable] = useState(false);
   const isWait = useRef(false);
   const isUnmounted = useRef(false);
   useEffect(() => () => {
      isWait.current = false;
      isUnmounted.current = true;
   }, []);
   const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (props.enableLoading) {
         setDisable(true);
         isWait.current = true;
         sleep(500, props.enableLoading).then(() => {
            isWait.current && !isUnmounted.current &&
               setLoading(true);
         });
         props.onClick!(() => {
            if (props.enableLoading?.current || isUnmounted.current) return;
            setLoading(false);
            setDisable(false);
            isWait.current = false;
         }, event);
      }
      else
         props.onClick && props.onClick!(undefined, event);
   };
   return (
      <button id={id.toString()}
         type="button" name={btnName}
         children={props.children}
         className={`btn ${props?.className} ${loading ? "loading" : ""}`}
         onClick={onClick}
         disabled={props?.disabled || disable || false}
      />
   );
};


declare type IProps = {
   id?: string | number;
   children?: any;
   className?: string;
   disabled?: boolean;
   enableLoading?: React.MutableRefObject<boolean>;
   onClick?: (loadingCallBack?: () => void, event?: React.MouseEvent<HTMLButtonElement>) => void;
};
