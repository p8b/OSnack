import React from 'react';
import { Communication } from '../../_core/apiModels';
import Modal from '../../components/Modals/Modal';
import { ClientAppAccess } from '../../_core/constant.Variables';
import ViewCommunication from '../Communication/ViewCommunication';
import { IReturnUsePutOfficialCommunication } from '../../hooks/OfficialHooks/useCommunicationHook';

const CommunicationModal = (props: IProps) => {

   return (
      <Modal className="col-11 col-sm-10 col-lg-6  pt-0 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <ViewCommunication access={props.access}
            usePutSecretCommunication={props.usePutSecretCommunication}
            useDeleteCommunication={props.useDeleteCommunication}
            communication={props.communication}
            onClose={props.onClose}
         />
      </Modal >

   );

};

declare type IProps = {
   usePutSecretCommunication?: (communicationId: string | null, messageBody: string | null, status: boolean) => Promise<IReturnUsePutOfficialCommunication>;
   useDeleteCommunication?: (communicationId: string | null) => Promise<{ data: string, status?: number; }>;
   access: ClientAppAccess;
   communication: Communication;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;

};
export default CommunicationModal;
