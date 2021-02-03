import React, { useEffect } from "react";

const Container = (props: IProps) => {
   useEffect(() => {
      if (props.id !== null && props.extendBottom) {
         //sizeChange();
         //window.addEventListener("resize", sizeChange);
      }
      if (props.id !== null && props.extendTop) {
         scrollChange();
         window.addEventListener("scroll", scrollChange);
      }

      return () => {
         //window.removeEventListener("resize", sizeChange);
         window.removeEventListener("scroll", scrollChange);
      };
   }, []);

   //const sizeChange = () => {
   //   let container = document.getElementById(props.id ?? "");
   //   if (props.extendBottom && container !== null)
   //      (container as HTMLElement).style.marginBottom = `${document.getElementById("footer")?.scrollHeight}px`;
   //};

   const scrollChange = () => {
      let container = document.getElementById(props.id ?? "");
      if (props.extendTop && container !== null && window.pageYOffset > 0) {
         document.getElementById("logo")?.classList.add("small");
         document.getElementById("navbar")?.classList.add("transition");
      }
      else {
         document.getElementById("logo")?.classList.remove("small");
         document.getElementById("navbar")?.classList.remove("transition");
      }
   };
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
   extendBottom?: boolean;
   extendTop?: boolean;
}
export default Container;
