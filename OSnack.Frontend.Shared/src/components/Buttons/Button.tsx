import React from 'react';

export const Button = (props: IProps) =>
   <button key={props.key} type="button" children={props.children}
      className={`btn ${props?.className}`}
      onClick={props.onClick}
      disabled={props?.disabled || false}
   />;


declare type IProps = {
   key?: string | number | null | undefined;
   children?: any;
   className?: string;
   disabled?: boolean;
   onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};


