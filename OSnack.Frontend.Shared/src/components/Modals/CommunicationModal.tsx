import React from 'react';
import { Communication } from '../../_core/apiModels';
import Modal from '../../components/Modals/Modal';
import { ClientAppAccess } from '../../_core/constant.Variables';
import ViewCommunication from '../Communication/ViewCommunication';

const CommunicationModal = (props: IProps) => {

   return (
      <Modal className="col-11 col-sm-10 col-lg-6  pt-0 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <ViewCommunication access={props.access}
            useAddMessageSecretCommunication={props.useAddMessageSecretCommunication}
            useDeleteCommunication={props.useDeleteCommunication}
            dispute={props.dispute}
            onClose={props.onClose}
         />
      </Modal >

   );

};

declare type IProps = {
   useAddMessageSecretCommunication?: (modifyCommunication: Communication) => Promise<{ data: Communication, status?: number; }>;
   useDeleteCommunication?: (communication: Communication) => Promise<{ data: string, status?: number; }>;
   access: ClientAppAccess;
   dispute: Communication;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;

};
export default CommunicationModal;
