import React from "react";

const Container = (props: IProps) => {
   return (<div id={props.id}
      className={`container ${props?.className}`}
      children={props?.children}
      ref={props?.ref} />);
};

interface IProps {
   id?: string;
   children?: any;
   className?: string;
   ref?: any;
}
export default Container;