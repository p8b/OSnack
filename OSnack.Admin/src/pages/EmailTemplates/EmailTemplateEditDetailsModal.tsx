import React, { useState, useEffect } from "react";
import PageHeader from "osnack-frontend-shared/src/components/Texts/PageHeader";
import CopyText from "osnack-frontend-shared/src/components/Texts/CopyText";
import Modal from "osnack-frontend-shared/src/components/Modals/Modal";
import { Input } from "osnack-frontend-shared/src/components/Inputs/Input";
import { Button } from "osnack-frontend-shared/src/components/Buttons/Button";

import { EmailTemplate, EmailTemplateClassNames, EmailTemplateClassNamesList, EmailTemplateServerClass, EmailTemplateTypes, EmailTemplateTypesList } from "osnack-frontend-shared/src/_core/apiModels";
import Alert, { AlertObj, useAlert } from "osnack-frontend-shared/src/components/Texts/Alert";
import InputDropdown from "osnack-frontend-shared/src/components/Inputs/InputDropDown";
import { useGetServerVariablesEmail } from "../../SecretHooks/useEmailHook";

const EmailTemplateEditDetailsModal = (props: IProps) => {
   const errorAlert = useAlert(new AlertObj());
   const [template, setTemplate] = useState(props.emailTemplate);
   const [isNewTemplate, setIsNewTemplate] = useState(true);
   const [serverClasses, setServerClasses] = useState<EmailTemplateServerClass[]>([]);

   useEffect(() => {
      useGetServerVariablesEmail().then(result => {
         console.log(result.data);
         setServerClasses(result.data);
      }).catch(alert => {
         errorAlert.set(alert);
      });
   }, []);
   useEffect(() => {
      if (props.emailTemplate.id && props.emailTemplate.id > 0)
         setIsNewTemplate(false);
      else
         setIsNewTemplate(true);

      setTemplate(props.emailTemplate);
   }, [props.isOpen]);
   useEffect(() => {
      errorAlert.set(props.alert || new AlertObj());
   }, [props.alert]);

   const onSubmit = async () => {
      props.onSubmit(template);
   };

   const isTemplateDeleted = () => {
      if (props.alert?.List.find(e => e.key === "Deleted") == undefined)
         return false;
      return true;
   };

   return (
      <Modal className="col-11 col-sm-10 col-md-8 col-lg-6 pl-4 pr-4"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title={`Template Details`} />
         <div className="row" >
            <Input label="Name" className="col-12 col-sm-6"
               disabled={template.templateType != EmailTemplateTypes.Others}
               value={template.name}
               showDanger={errorAlert.checkExist("name")}
               onChange={i => setTemplate({ ...template, name: i.target?.value })}
            />
            <InputDropdown dropdownTitle={`${template.templateType != undefined ? EmailTemplateTypesList.find(t => t.Value == template.templateType)?.Name : "Select Option"}`}
               label="Type *"
               disabled={template.templateType != undefined && template.id! > 0}
               className="col-12 col-sm-6">
               {EmailTemplateTypesList.map(t =>
                  <div className="dropdown-item cursor-pointer" key={t.Id}
                     onClick={() => {
                        setTemplate({ ...template, name: t.Name, templateType: t.Value });
                     }} >
                     {t.Name}
                  </div>
               )}
            </InputDropdown>
            <div className="col-12 col-sm-6 pm-0">
               <Input label="Token URL Path*" className="col-12"
                  value={template.tokenUrlPath}
                  disabled={template.serverClasses?.find(c => c.value == EmailTemplateClassNames.Token) == undefined}
                  showDanger={errorAlert.checkExist("TokenUrlPath")}
                  onChange={i => setTemplate({ ...template, tokenUrlPath: i.target?.value })}
               />
               <Input label="Subject *" className="col-12"
                  value={template.subject}
                  showDanger={errorAlert.checkExist("Subject")}
                  onChange={i => setTemplate({ ...template, subject: i.target?.value })}
               />
            </div>
            <div className="col-12 col-sm-6 pm-0">
               <InputDropdown dropdownTitle={`${serverClasses.length == 0 ? "No Options" : "Select Option"}`}
                  label="Server Variables Required"
                  disabled={serverClasses.length == 0}
                  className="col-12">
                  {serverClasses.map(sc =>
                     <div className="dropdown-item cursor-pointer" key={sc.value}
                        onClick={() => {
                           let arr: EmailTemplateServerClass[] = [sc];
                           if (template.serverClasses != undefined && template.serverClasses!.length > 0)
                              arr = arr.concat(template.serverClasses!);

                           setServerClasses(serverClasses.filter(SC => SC != sc));
                           setTemplate({ ...template, serverClasses: arr });
                        }} >
                        {EmailTemplateClassNamesList.find(c => c.Value == sc.value)?.Name}
                     </div>
                  )}
                  {serverClasses.length == 0 &&
                     <div className="dropdown-item cursor-pointer">
                        No Options
                     </div>
                  }
               </InputDropdown>
               <div className="row col-12 justify-content-center">
                  {template.serverClasses?.map(sc =>
                     <div className={`badge col-auto m-1`} key={sc.value}>
                        <CopyText text={EmailTemplateClassNamesList.find(c => c.Value == sc.value)?.Name || ""} />

                        <span className="" onClick={() => {
                           let arr: EmailTemplateServerClass[] = [sc];
                           if (template.serverClasses!.length > 0)
                              arr = arr.concat(serverClasses);

                           setTemplate({ ...template, serverClasses: template.serverClasses!.filter(SV => SV != sc) });
                           setServerClasses(arr);
                        }}
                           children="X"
                        />
                     </div>
                  )}
               </div>
            </div>
            <div className="col-12 mt-2">
               <Alert alert={errorAlert.alert} className="col-12 mb-1"
                  onClosed={() => errorAlert.clear()}
               />
               {!isTemplateDeleted() &&
                  <>
                     <Button children={`${isNewTemplate ? "Continue" : "Edit"}`} className="btn-lg col-12 col-sm-6 mt-2 btn-green"
                        onClick={onSubmit} />
                     <Button children="Cancel" className="btn-lg col-12 col-sm-6 mt-2 btn-white"
                        onClick={() => { errorAlert.clear(); props.onCancel(); }} />
                  </>
               }
            </div>
         </div>
      </Modal >
   );
};

type IProps = {
   isOpen: boolean,
   alert?: AlertObj,
   clearAlert?: () => void,
   emailTemplate: EmailTemplate,
   onSubmit: (template: EmailTemplate) => void;
   onCancel: () => void;
   modalRef?: any;
};

export default EmailTemplateEditDetailsModal;
