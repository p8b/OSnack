import React from 'react';
import { Communication, Message } from '../../_core/apiModels';
import Modal from '../../components/Modals/Modal';
import { AppAccess } from '../../_core/constant.Variables';
import ShowCommunication from '../Communication/ShowCommunication';
import { IReturnUsePutOfficialCommunication } from '../../hooks/OfficialHooks/useCommunicationHook';

const CommunicationModal = (props: IProps) => {

   return (
      <Modal className="col-11 col-sm-10 col-lg-6  pt-0 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <ShowCommunication access={props.access}
            usePutSecretCommunication={props.usePutSecretCommunication}
            useDeleteCommunication={props.useDeleteCommunication}
            communication={props.communication}
            onClose={props.onClose}
            isInModal={true}
         />
      </Modal >

   );

};

declare type IProps = {
   usePutSecretCommunication?: (message: Message, communicationId: string | null, status: boolean) => Promise<IReturnUsePutOfficialCommunication>;
   useDeleteCommunication?: (communicationId: string | null) => Promise<{ data: string, status?: number; }>;
   access: AppAccess;
   communication: Communication;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;

};
export default CommunicationModal;
