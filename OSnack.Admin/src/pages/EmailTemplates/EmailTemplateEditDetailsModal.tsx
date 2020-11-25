import React, { useState, useEffect } from "react";
import PageHeader from "osnack-frontend-shared/src/components/Texts/PageHeader";
import CopyText from "osnack-frontend-shared/src/components/Texts/CopyText";
import Modal from "osnack-frontend-shared/src/components/Modals/Modal";
import { Input } from "osnack-frontend-shared/src/components/Inputs/Input";
import { Button } from "osnack-frontend-shared/src/components/Buttons/Button";

import { EmailTemplate, ServerVariables } from "../../_core/apiModel-Admin";
import { useModifyEmailTemplateDetails } from '../../hooks/apiCallers/emailTemplate/Put.EmailTemplate';
import Alert, { AlertObj } from "osnack-frontend-shared/src/components/Texts/Alert";
import InputDropdown from "osnack-frontend-shared/src/components/Inputs/InputDropDown";
import { sleep } from "osnack-frontend-shared/src/_core/appFunc";

const EmailTemplateEditDetailsModal = (props: IProps) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [template, setTemplate] = useState(props.emailTemplate);
   const [isNewTemplate, setIsNewTemplate] = useState(true);
   const [isTokenUrlRequired, setIsTokenUrlRequired] = useState(false);
   const [serverVariables, setServerVariables] = useState<ServerVariables[]>([]);
   useEffect(() => {
      if (template.id != null && template.id != 0)
         setIsNewTemplate(false);
      else
         setIsNewTemplate(true);

      let arr = props.serverVariables;
      for (var i = 0; i < template.serverVariables?.length; i++) {
         arr = arr.filter(sv => sv.enumValue != template.serverVariables[i].enumValue);
         if (template.serverVariables[i].replacementValue == "@@TokenUrl@@")
            setIsTokenUrlRequired(true);
      }
      setServerVariables(arr);

      if (props.alert != null && props.alert.List.length > 0) {
         setAlert(props.alert);
      }
   }, [props.emailTemplate]);
   useEffect(() => {
      const temp = template.serverVariables?.find(sv => sv.replacementValue == "@@TokenUrl@@");
      if (temp != undefined && template.serverVariables.includes(temp)) {
         setIsTokenUrlRequired(true);
      } else {
         setIsTokenUrlRequired(false);
      }
   }, [template.serverVariables]);
   useEffect(() => {
      setAlert(props.alert || new AlertObj());
   }, [props.alert]);
   const onSubmit = async () => {
      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      if (template.id != null && template.id > 0) {
         useModifyEmailTemplateDetails(template).then(result => {
            if (result.alert.List.length > 0) {
               alert.List = result.alert.List;
               alert.Type = result.alert.Type;
               setAlert(alert);
            }
            else {
               setAlert(alert.Clear);
               props.onSubmit(template);
            }
         });
      } else {
         props.onSubmit({ ...template, id: 0 });
      }
   };

   return (
      <Modal className="col-11 col-sm-10 col-md-8 col-lg-6 pl-4 pr-4"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title={`Template Details`} />
         <div className="row" >
            <Input label="Name *" className="col-10"
               value={template.name}
               disabled={template.locked}
               showDanger={alert.checkExist("name")}
               onChange={i => setTemplate({ ...template, name: i.target?.value })}
            />
            <button className={`col-2 btn ${template.locked ? "lock-icon" : "unlock-icon"}`}
               children={`${template.locked ? "lock" : "unlock"}`}
               onClick={() => setTemplate((prev) => ({ ...prev, locked: !prev.locked }))} />
            <div className="col-12 col-sm-6 p-0 m-0">
               <Input label="Subject *" className="col-12"
                  value={template.subject}
                  showDanger={alert.checkExist("Subject")}
                  onChange={i => setTemplate({ ...template, subject: i.target?.value })}
               />
               <Input label="Token URL Path*" className="col-12"
                  value={template.tokenUrlPath}
                  disabled={!isTokenUrlRequired}
                  showDanger={alert.checkExist("TokenUrlPath")}
                  onChange={i => setTemplate({ ...template, tokenUrlPath: i.target?.value })}
               />
            </div>
            <div className="col-12 col-sm-6 p-0 m-0">
               <InputDropdown dropdownTitle={"Select Option"}
                  label="Server Variables Required"
                  className="col-12">
                  {serverVariables.map(sv =>
                     <div className="dropdown-item" key={Math.random()}
                        onClick={() => {
                           let arr: ServerVariables[] = [sv];
                           if (template.serverVariables?.length > 0)
                              arr = arr.concat(template.serverVariables);

                           setServerVariables(serverVariables.filter(SV => SV != sv));
                           setTemplate({ ...template, serverVariables: arr });
                        }} >
                        {sv.replacementValue}
                     </div>
                  )}
               </InputDropdown>
               <div className="row col-12 justify-content-center">
                  {template.serverVariables?.map(sv =>
                     <div className={`badge col-auto m-1 ${alert.checkExist(sv.replacementValue) ? "red" : ""}`} key={sv.enumValue}>
                        <CopyText text={sv.replacementValue} />

                        <span className="" onClick={() => {
                           let arr: ServerVariables[] = [sv];
                           if (template.serverVariables?.length > 0)
                              arr = arr.concat(serverVariables);

                           setTemplate({ ...template, serverVariables: template.serverVariables.filter(SV => SV != sv) });
                           setServerVariables(arr);
                        }}
                           children="X"
                        />
                     </div>
                  )}
               </div>
            </div>
            <div className="col-12 mt-2">
               <Alert alert={alert} className="col-12 mb-1"
                  onClosed={() => setAlert(alert.Clear)}
               />
               <Button children={`${isNewTemplate ? "Continue" : "Edit"}`} className="btn-lg col-12 col-sm-6 mt-2 btn-green"
                  onClick={onSubmit} />
               <Button children="Cancel" className="btn-lg col-12 col-sm-6 mt-2 btn-white"
                  onClick={() => { setAlert(alert.Clear); props.onCancel(); }} />
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
   serverVariables: ServerVariables[],
   onSubmit: (template: EmailTemplate) => void;
   onCancel: () => void;
   modalRef?: any;
};

export default EmailTemplateEditDetailsModal;