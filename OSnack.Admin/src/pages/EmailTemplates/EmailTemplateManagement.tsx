import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import ButtonCard from 'osnack-frontend-shared/src/components/Buttons/ButtonCard';
import { EmailTemplate, EmailTemplateTypes } from 'osnack-frontend-shared/src/_core/apiModels';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Redirect } from 'react-router-dom';
import { useAllTemplateEmail } from '../../SecretHooks/useEmailHook';
import Container from '../../components/Container';

const EmailTemplatePanel = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [redirectToEditPage, setRedirectToEditPage] = useState(false);
   const [emailTemplate, setEmailTemplate] = useState(new EmailTemplate());
   const [tempList, setTempList] = useState<EmailTemplate[]>([]);
   const [defaultEmailTemplate, setDefaultEmailTemplate] = useState(new EmailTemplate());



   useEffect(() => {
      reloadTemplateList();
      return () => { isUnmounted.current = true; };
   }, []);

   const reloadTemplateList = () => {
      errorAlert.PleaseWait(500, isUnmounted);
      useAllTemplateEmail().then(result => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         setTempList(result.data);
         setDefaultEmailTemplate(result.data.find(tl => tl.templateType == EmailTemplateTypes.DefaultTemplate) || new EmailTemplate());
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
   };
   const newTemplate = () => {
      setEmailTemplate(new EmailTemplate());
      setRedirectToEditPage(true);
   };

   if (redirectToEditPage)
      return <Redirect to={{ pathname: "/EmailTemplate/Edit", state: { emailTemplate, defaultEmailTemplate } }} />;

   return (
      <>
         <PageHeader title="Email Templates" className="line-header" />
         <Container id="test" className="justify-content-center p-0">
            <Alert alert={errorAlert.alert} onClosed={errorAlert.clear}
               className="col-12 mb-2" />
            <ButtonCard cardClassName="d-flex align-items-center" onClick={newTemplate}>
               <div className="col ">
                  <div className="col-12 fas add-icon" />
                  <div children="New Template" />
               </div>
            </ButtonCard>
            {tempList.length > 0 &&
               tempList.map(temp => {
                  return (
                     <ButtonCard key={Math.random()} cardClassName="d-flex align-items-center"
                        onClick={() => {
                           setEmailTemplate(temp);
                           setRedirectToEditPage(true);
                        }}>

                        <div className={`col-12`}>
                           <div className={`col-12 ${temp.templateType != EmailTemplateTypes.Others ? "lock-icon" : "unlock-icon"}`} />
                           {temp.name?.replace(/([A-Z])/g, ' $1')}
                        </div>
                     </ButtonCard>
                  );
               })
            }
         </Container>
      </>
   );
};

declare type IProps = {
};
export default EmailTemplatePanel;
