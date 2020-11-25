import React, { useEffect, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import ButtonCard from 'osnack-frontend-shared/src/components/Buttons/ButtonCard';
import { useGetAllEmailTemplates, } from '../../hooks/apiCallers/emailTemplate/Get.EmailTemplates';
import { EmailTemplate } from '../../_core/apiModel-Admin';
import Alert, { AlertObj } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { sleep } from 'osnack-frontend-shared/src/_core/appFunc';
import { Redirect } from 'react-router-dom';

const EmailTemplatePanel = (props: IProps) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [redirectToEditPage, setRedirectToEditPage] = useState(false);
   const [emailTemplate, setEmailTemplate] = useState(new EmailTemplate());
   const [tempList, setTempList] = useState<EmailTemplate[]>([]);
   const [defaultEmailTemplate, setDefaultEmailTemplate] = useState(new EmailTemplate());

   const newTemplate = () => {
      setEmailTemplate(new EmailTemplate());
      setRedirectToEditPage(true);
   };

   const reloadTemplateList = () => {
      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useGetAllEmailTemplates().then((result) => {
         setTempList(result.templateList);
         setDefaultEmailTemplate(result.templateList.find(tl => tl.isDefaultTemplate) || new EmailTemplate());
         setAlert(alert.Clear);
      });
   };

   useEffect(() => {
      reloadTemplateList();
   }, []);

   if (redirectToEditPage)
      return (<Redirect to={{ pathname: "EmailTemplate/Edit", state: { emailTemplate, defaultEmailTemplate } }} />);
   return (
      <>
         <PageHeader title="Email Templates" className="line-header-lg" />
         <Alert alert={alert}
            className="col-12 mb-2"
            onClosed={() => { setAlert(alert.Clear); }}
         />
         <div id="test" className="row justify-content-center">
            <ButtonCard cardClassName="d-flex align-items-center"
               onClick={newTemplate}>
               <div className="col ">
                  <div className="col-12 fas add-icon" />
                        New Template
                      </div>
            </ButtonCard>
            {tempList.length > 0 &&
               tempList.map(temp => {
                  return (
                     <ButtonCard key={temp.id} cardClassName="d-flex align-items-center"
                        onClick={() => {
                           setEmailTemplate(temp);
                           setRedirectToEditPage(true);
                        }}>

                        <img id={`${temp.id}`} />
                        <div className={`col ${temp.locked ? "lock-icon" : "unlock-icon"}`}>
                           {temp.name}
                        </div>
                     </ButtonCard>
                  );
               })
            }
         </div>
      </>
   );
};

declare type IProps = {
};
export default EmailTemplatePanel;
