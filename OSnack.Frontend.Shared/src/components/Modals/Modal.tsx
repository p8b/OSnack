import React, { useEffect, useRef } from 'react';
const Modal = (props: IProps) => {
   const modalRow = useRef<HTMLDivElement | null>(null);
   //if (props.isOpen)
   //   document.getElementsByTagName("footer")[0]?.classList.add("footer-behind");
   //else
   //   document.getElementsByTagName("footer")[0]?.classList.remove("footer-behind");

   useEffect(() => {
      document.addEventListener("keyup", keydownHander);
      setfocusToFirstElement();
      return () => {
         document.removeEventListener("keyup", keydownHander);
      };
   }, [props.isOpen]);
   const keydownHander = (ev: KeyboardEvent) => {
      if (ev.keyCode == 9) {
         if (!modalRow.current?.contains(document.activeElement)) {
            console.log(modalRow);
            setfocusToFirstElement();
         }
      }
   };
   const setfocusToFirstElement = () => {
      var focusable = modalRow.current?.querySelectorAll('button, [href], input, select, textarea');
      if (focusable != undefined && focusable.length > 0) {
         var firstFocusable = focusable[0];
         (firstFocusable as any).focus();
      }
   };
   return (
      <>
         {props.isOpen && <div className="modal-backdrop show" />}
         <div tabIndex={-1} className={`modal ${props.isOpen ? ' show d-block ' : " d-none "}`}>
            <div ref={modalRow} className="row h-100 ">
               <div className={`modal-body bg-solid bg-white m-auto p-3 ${props.className ?? ""} `}
                  ref={props.bodyRef}>
                  {props.isOpen && props.children}
               </div>
            </div>
         </div>
      </>
   );
};

interface IProps {
   children: any;
   className?: string;
   isOpen: boolean;
   bodyRef?: any;
}
export default Modal;
