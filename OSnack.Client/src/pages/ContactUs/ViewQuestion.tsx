import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Communication } from 'osnack-frontend-shared/src/_core/apiModels';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../components/Container';
import { useGetQuestionCommunication } from "osnack-frontend-shared/src/hooks/PublicHooks/useCommunicationHook";
import ViewCommunication from 'osnack-frontend-shared/src/components/Communication/ViewCommunication';
import { Access } from '../../_core/appConstant.Variables';
import { extractUri } from 'osnack-frontend-shared/src/_core/appFunc';
import { useHistory } from 'react-router-dom';

const ViewQuestion = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [questionKey] = useState(extractUri(window.location.pathname)[1]);
   const [question, setQuestion] = useState(new Communication());
   const history = useHistory();

   useEffect(() => {
      errorAlert.PleaseWait(500, isUnmounted);
      useGetQuestionCommunication(questionKey).then(result => {
         if (isUnmounted.current) return;
         setQuestion(result.data);
         errorAlert.clear();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
      console.log(question);
      return () => { isUnmounted.current = true; };
   }, []);

   return (
      <>
         <Container>
            <Alert alert={errorAlert.alert}
               className="col-12"
               onClosed={() => { errorAlert.clear(); if (question.id == undefined) history.push("/"); }}
            />
            {question.id == questionKey && questionKey != undefined &&
               <div className="row justify-content-center bg-white p-3">
                  <ViewCommunication access={Access}
                     communication={question}
                  />
               </div>
            }
         </Container>
      </>
   );
};

declare type IProps = {
};
export default ViewQuestion;
