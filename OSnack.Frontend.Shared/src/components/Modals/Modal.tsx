import React from 'react';
const Modal = (props: IProps) => {
   //if (props.isOpen)
   //   document.getElementsByTagName("footer")[0]?.classList.add("footer-behind");
   //else
   //   document.getElementsByTagName("footer")[0]?.classList.remove("footer-behind");

   return (
      <>
         {props.isOpen && <div className="modal-backdrop show" />}
         <div tabIndex={-1} className={`modal ${props.isOpen ? ' show d-block ' : " d-none "}`}>
            <div className="row h-100 ">
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
