import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Communication } from 'osnack-frontend-shared/src/_core/apiModels';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../components/Container';
import { useGetQuestionCommunication } from "osnack-frontend-shared/src/hooks/PublicHooks/useCommunicationHook";
import { useGetDisputeSecretCommunication } from "../../SecretHooks/useCommunicationHook";
import ShowCommunication from 'osnack-frontend-shared/src/components/Communication/ShowCommunication';
import { Access } from '../../_core/appConstant.Variables';
import { extractUri } from 'osnack-frontend-shared/src/_core/appFunc';
import { useHistory } from 'react-router-dom';
import { useDeleteCommunication, usePutSecretCommunication } from '../../SecretHooks/useCommunicationHook';

const ViewCommunication = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [communicationKey] = useState(extractUri(window.location.pathname)[1]);
   const [isDispute] = useState(extractUri(window.location.pathname)[0].toLowerCase() == "viewdispute" ? true : false);
   const [communication, setCommunication] = useState(new Communication());
   const history = useHistory();

   useEffect(() => {
      errorAlert.pleaseWait(isUnmounted);
      if (!isDispute)
         useGetQuestionCommunication(communicationKey).then(result => {
            if (isUnmounted.current) return;
            setCommunication(result.data);
            errorAlert.clear();
         }).catch(errors => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
         });
      else {
         useGetDisputeSecretCommunication(communicationKey).then(result => {
            if (isUnmounted.current) return;
            setCommunication(result.data);
            errorAlert.clear();
         }).catch(errors => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
         });
      }
      return () => { isUnmounted.current = true; };
   }, []);

   return (
      <>
         <Container className="container-fluid">
            <Alert alert={errorAlert.alert}
               className="col-12"
               onClosed={() => { errorAlert.clear(); if (communication.id == undefined) history.push("/"); }}
            />
            {communication.id == communicationKey && communicationKey != undefined &&
               <div className="row justify-content-center bg-white p-3">
                  <ShowCommunication access={Access}
                     communication={communication}
                     useDeleteCommunication={useDeleteCommunication}
                     usePutSecretCommunication={usePutSecretCommunication}
                  />
               </div>
            }
         </Container>
      </>
   );
};

declare type IProps = {
};
export default ViewCommunication;
