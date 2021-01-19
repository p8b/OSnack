import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import ButtonCard from 'osnack-frontend-shared/src/components/Buttons/ButtonCard';
import { EmailTemplate, EmailTemplateTypes, EmailTemplateTypesList } from 'osnack-frontend-shared/src/_core/apiModels';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Redirect } from 'react-router-dom';
import { useAllTemplateEmail, useGetAllAvailableTemplateTypesEmail } from '../../SecretHooks/useEmailHook';
import Container from '../../components/Container';

const EmailTemplatePanel = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [redirectToEditPage, setRedirectToEditPage] = useState(false);
   const [templateTypes, setTemplateTypes] = useState<EmailTemplateTypes[]>([]);
   const [emailTemplate, setEmailTemplate] = useState(new EmailTemplate());
   const [tempList, setTempList] = useState<EmailTemplate[]>([]);
   const [defaultEmailTemplate, setDefaultEmailTemplate] = useState(new EmailTemplate());

   useEffect(() => {
      reloadTemplateList();

      useGetAllAvailableTemplateTypesEmail().then(result => {
         setTemplateTypes(result.data);
      }).catch(errors => {
         errorAlert.set(errors);
      });
      return () => { isUnmounted.current = true; };
   }, []);

   const reloadTemplateList = () => {
      errorAlert.pleaseWait(isUnmounted);
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
      return <Redirect to={{ pathname: "/EmailTemplate/Edit", state: { emailTemplate, defaultEmailTemplate, templateTypes } }} />;

   return (
      <>
         <PageHeader title="Email Templates" className="line-header" />
         <div className="col-12 text-center my-5 py-5 d-block d-md-none" style={{
            'backgroundColor': 'rgb(255, 221, 70)',
            'fontWeight': 600,
            'color': 'black',
            'padding': '5px',
         }}>This Page is only functional on large screen size.</div>
         <Container className="row col-12 justify-content-center pm-0 d-none d-md-flex">
            <Alert alert={errorAlert.alert} onClosed={errorAlert.clear}
               className="col-12 mb-2" />
            {templateTypes.length > 0 &&
               <ButtonCard cardClassName="d-flex align-items-center" onClick={newTemplate}>
                  <div className="col">
                     <div className="col-12 fas add-icon" />
                     <div children="New Template" />
                  </div>
               </ButtonCard>
            }
            {tempList.length > 0 &&
               tempList.map(temp => {
                  return (
                     <ButtonCard key={Math.random()} cardClassName="d-flex align-items-center"
                        onClick={() => {
                           setEmailTemplate(temp);
                           setRedirectToEditPage(true);
                        }}>

                        <div className={`col-12`}>
                           <div className={`col-12`} />
                           {EmailTemplateTypesList.find(t => t.Value === temp.templateType)?.Name}
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
