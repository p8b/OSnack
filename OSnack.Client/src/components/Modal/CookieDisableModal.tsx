import React, { useEffect, useState } from 'react';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';


const CookieDisableModal = (props: IProps) => {
   const [cookieEnable, setCookieEnable] = useState(navigator.cookieEnabled);
   useEffect(() => {
      setCookieEnable(navigator.cookieEnabled);
   }, [navigator.cookieEnabled]);

   return (
      <Modal className="col-12 col-sm-11 col-md-9 col-lg-6 p-5"
         isOpen={!cookieEnable}>
         <div className="display-6 text-center">Your browser cookies is blocked.<br />We needs cookies for our website be functional.</div>
      </Modal >
   );
};

declare type IProps = {
};
export default CookieDisableModal;
