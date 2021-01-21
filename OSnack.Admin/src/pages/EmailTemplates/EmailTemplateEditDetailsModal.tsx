import React, { useState, useEffect } from "react";
import PageHeader from "osnack-frontend-shared/src/components/Texts/PageHeader";
import Modal from "osnack-frontend-shared/src/components/Modals/Modal";
import { Input } from "osnack-frontend-shared/src/components/Inputs/Input";
import { Button } from "osnack-frontend-shared/src/components/Buttons/Button";

import { EmailTemplate, EmailTemplateTypes, EmailTemplateTypesList } from "osnack-frontend-shared/src/_core/apiModels";
import Alert, { AlertObj, useAlert } from "osnack-frontend-shared/src/components/Texts/Alert";
import InputDropdown from "osnack-frontend-shared/src/components/Inputs/InputDropDown";

const EmailTemplateEditDetailsModal = (props: IProps) => {
   const errorAlert = useAlert(new AlertObj());
   const [template, setTemplate] = useState(props.emailTemplate);
   const [isNewTemplate, setIsNewTemplate] = useState(true);

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

   const onSubmit = () => {
      props.onSubmit(template);
   };

   const isTemplateDeleted = () => {
      if (props.alert?.List.find(e => e.key === "Deleted") == undefined)
         return false;
      return true;
   };

   return (
      <Modal className="col-12 col-sm-11 col-md-9 col-lg-6"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title={`Template Details`} />
         <div className="row" >
            <InputDropdown dropdownTitle={`${template.templateType != undefined ? EmailTemplateTypesList.find(t => t.Value == template.templateType)?.Name : "Select Option"}`}
               label="Type *"
               disabled={template.templateType != undefined && template.id! > 0}
               className="col-12 col-sm-6">
               {props.templateTypes && props.templateTypes.map((t, index) =>
                  <div className="dropdown-item cursor-pointer" key={index}
                     onClick={() => {
                        setTemplate({ ...template, templateType: t });
                     }} >
                     {EmailTemplateTypes[t].replace(/([A-Z])/g, ' $1')}
                  </div>
               )}
            </InputDropdown>
            <Input label="Subject *" className="col-12 col-sm-6"
               value={template.subject}
               showDanger={errorAlert.checkExist("Subject")}
               onChange={i => setTemplate({ ...template, subject: i.target?.value })}
            />
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
   templateTypes?: EmailTemplateTypes[],
   clearAlert?: () => void,
   emailTemplate: EmailTemplate,
   onSubmit: (template: EmailTemplate) => void;
   onCancel: () => void;
   modalRef?: any;

};

export default EmailTemplateEditDetailsModal;
