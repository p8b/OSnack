import React, { useEffect, useRef, useState } from 'react';
import { sleep } from '../../_core/appFunc';

export const Button = (props: IProps) => {
   const [loading, setLoading] = useState(false);
   const [disable, setDisable] = useState(false);
   const isWait = useRef(false);
   useEffect(() => () => { isWait.current = true; }, []);
   const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (props.enableLoading) {
         setDisable(true);
         isWait.current = true;
         sleep(500, props.enableLoading).then(() => {
            isWait.current &&
               setLoading(true);
         });
         props.onClick!(() => {
            if (props.enableLoading?.current) return;
            setLoading(false);
            setDisable(false);
            isWait.current = false;
         }, event);
      }
      else
         props.onClick && props.onClick!(undefined, event);
   };
   return (
      <button id="send" key={props.key} type="button" children={props.children}
         className={`btn ${props?.className} ${loading && "loading"}`}
         onClick={onClick}
         disabled={props?.disabled || disable || false}
      />
   );
};


declare type IProps = {
   key?: string | number | null | undefined;
   children?: any;
   className?: string;
   disabled?: boolean;
   enableLoading?: React.MutableRefObject<boolean>;
   onClick?: (loadingCallBack?: () => void, event?: React.MouseEvent<HTMLButtonElement>) => void;
};
