import React, { useEffect, useRef, useState } from 'react';
import EmailEditor from 'react-email-editor';
import ButtonPopupConfirm from 'osnack-frontend-shared/src/components/Buttons/ButtonPopupConfirm';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { EmailTemplate, EmailTemplateRequiredClass, EmailTemplateTypes } from 'osnack-frontend-shared/src/_core/apiModels';
import { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import CopyText from 'osnack-frontend-shared/src/components/Texts/CopyText';
import { sleep } from 'osnack-frontend-shared/src/_core/appFunc';
import EmailTemplateEditDetailsModal from './EmailTemplateEditDetailsModal';
import { Redirect, useHistory } from 'react-router-dom';
import { useDeleteTemplateEmail, useGetAllAvailableTemplateTypesEmail, useGetTemplateEmail, usePostTemplateEmail, usePutTemplateEmail } from '../../SecretHooks/useEmailHook';
import InputDropdown from 'osnack-frontend-shared/src/components/Inputs/InputDropDown';

const EmailTemplatesEdit = (props: IProps) => {
   const history = useHistory();
   const isUnmounted = useRef(false);
   const emailEditorRef = useRef<any>();
   const errorAlert = useAlert(new AlertObj());

   const [template, setTemplate] = useState(new EmailTemplate());
   const [defaultTemplate, setDefaultTemplate] = useState(new EmailTemplate());
   const [templateTypes, setTemplateTypes] = useState<EmailTemplateTypes[]>([]);
   const [selectedServerClass, setSelectedServerClass] = useState<EmailTemplateRequiredClass>();
   const [isSaved, setIsSaved] = useState(false);
   const [isEditorLoaded, setIsEditorLoaded] = useState(false);
   const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
   const [isTemplateRecognised, setIsTemplateRecognised] = useState(true);
   const [isDefaultTemplateUsed, setIsDefaultTemplateUsed] = useState(false);
   const [initialLockedStatus, setInitialLockedStatus] = useState<boolean | undefined>(true);

   useEffect(() => {
      if (props.location.state == undefined) {
         setIsTemplateRecognised(false);
         return;
      }

      setTemplate(props.location.state.emailTemplate);
      setInitialLockedStatus(props.location.state.emailTemplate.templateType != EmailTemplateTypes.Others);
      setDefaultTemplate(props.location.state.defaultEmailTemplate);

      if (props.location.state.emailTemplate.id && props.location.state.emailTemplate.id > 0)
         useGetTemplateEmail(props.location.state.emailTemplate.id).then(
            result => {
               setTemplate(result.data.emailTemplate != undefined ? result.data.emailTemplate : new EmailTemplate());
               setInitialLockedStatus(result.data.emailTemplate?.templateType != EmailTemplateTypes.Others);
               setDefaultTemplate(result.data.defaultEmailTemplate ? result.data.defaultEmailTemplate : new EmailTemplate());
            }).catch(errors => {
               errorAlert.set(errors);
            });
      else
         useGetAllAvailableTemplateTypesEmail().then(result => {
            setTemplateTypes(result.data);
         }).catch(errors => {
            errorAlert.set(errors);
         });

      if (props.location.state.emailTemplate.id == 0)
         setIsOpenDetailsModal(true);

      /// needed for after the first time the email editor is loaded
      setIsDefaultTemplateUsed(false);
      return () => {
         isUnmounted.current = true;
      };
   }, []);

   useEffect(() => {
      loadDesgin();
   }, [template]);

   const saveTemplate = () => {
      if (!isEditorLoaded) return;
      errorAlert.PleaseWait(500, isUnmounted);

      emailEditorRef.current?.editor!.exportHtml(async (data: { design: any; html: string; }) => {
         if (isUnmounted.current) return;

         let emailTemp = template;
         emailTemp.html = data.html;
         emailTemp.design = data.design;
         var resultTemplate: EmailTemplate | undefined;
         if (template.id == 0)
            await usePostTemplateEmail(template).then((result) => {
               resultTemplate = result.data;
            }).catch((errors) => {
               errorAlert.set(errors);
               setIsOpenDetailsModal(true);
            });
         else if (template.id != null)
            await usePutTemplateEmail(template).then((result) => {
               resultTemplate = result.data;
            }).catch((errors) => {
               errorAlert.set(errors);
               setIsOpenDetailsModal(true);
            });

         if (resultTemplate != undefined) {
            setIsOpenDetailsModal(false);
            errorAlert.clear();
            setIsSaved(true);
            setTemplate(resultTemplate);
            setInitialLockedStatus(resultTemplate?.templateType != EmailTemplateTypes.Others);
            sleep(3000, isUnmounted).then(() => { setIsSaved(false); });
         }
      });
   };
   const onDelete = async () => {
      errorAlert.PleaseWait(500, isUnmounted);
      useDeleteTemplateEmail(template).then(result => {
         if (isUnmounted.current) return;
         errorAlert.setSingleSuccess("Deleted", result.data);
         sleep(3000, isUnmounted).then(() => { setIsTemplateRecognised(false); });
      }).catch((alert) => {
         if (isUnmounted.current) return;
         errorAlert.clear();
         setIsOpenDetailsModal(true);
      });
   };

   const insertDefault = async () => {
      if (defaultTemplate != undefined
         && template.design != null
         && !isDefaultTemplateUsed
         && emailEditorRef.current.editor != undefined) {

         const temp = defaultTemplate.design;
         setIsDefaultTemplateUsed(true);
         (temp?.body.rows[0] as any).columns[0].contents
            = (temp?.body.rows[0] as any).columns[0].contents.concat((template.design?.body.rows[0] as any).columns[0].contents);
         emailEditorRef.current.editor.loadDesign(temp);
      }
   };
   const UnlayerLoaded = () => {
      setIsEditorLoaded(true);
      /// Needed for first time the email editor is loaded
      loadDesgin();
   };
   const loadDesgin = () => {
      try {
         if (template.design != null && emailEditorRef.current.editor != undefined)
            emailEditorRef.current.editor.loadDesign(template.design);
         else if (emailEditorRef.current.editor != undefined) {
            // used to load the template design after the first time Unlayer editor is loaded
            emailEditorRef.current.editor.loadDesign(defaultTemplate.design);
         }
      } catch (e) { }
   };

   const renderInsertDefaultTemplateButton = () => {
      if (template.templateType != EmailTemplateTypes.DefaultTemplate && !isDefaultTemplateUsed)
         return <Button onClick={insertDefault} children="Add Default" className="btn-lg btn-blue ml-auto" />;
      else
         return <></>;
   };
   const renderDeleteButton = () => {
      if (template.templateType != EmailTemplateTypes.DefaultTemplate && template.id && template.id > 0 && !initialLockedStatus)
         return <ButtonPopupConfirm title=""
            popupMessage="Are your Sure?"
            onConfirmClick={onDelete}
            btnClassName="btn-lg btn-red delete-icon" />;
      else
         return <></>;
   };

   if (!isTemplateRecognised) {
      return <Redirect to="/EmailTemplate" />;
   }
   return (
      <>
         <PageHeader title={`${template.id == 0 ? "New Template" : "Edit " + template.name?.replace(/([A-Z])/g, ' $1')}`} className="line-header line-limit-1" />
         <div className="row col-12 mb-2" >

            <Button onClick={() => history.push("/EmailTemplate")} children="Back" className="mr-auto btn-lg back-icon" />
            {renderInsertDefaultTemplateButton()}
            <Button onClick={() => { setIsOpenDetailsModal(true); }} children="Details" className="btn-lg btn-white edit-icon" />
            {renderDeleteButton()}
            <Button onClick={saveTemplate} children={`Save${isSaved ? "d" : ""}`} className={`btn-lg btn-green ${isSaved ? "tick-icon" : "save-icon"}`} />
         </div>
         <div className="row pm-0 pl-3 pr-3">
            {template.serverClasses != undefined && template.serverClasses!.length > 0 &&
               <InputDropdown dropdownTitle={`Server Model${selectedServerClass == undefined ? "s" : ": " + selectedServerClass.value}`}
                  className="col-auto pb-0">
                  {template.serverClasses?.map(sc =>
                     <div className="dropdown-item cursor-pointer pl-0 pr-0" key={Math.random()}
                        onClick={() => { setSelectedServerClass(sc); }}>
                        {sc.value}
                     </div>
                  )}
               </InputDropdown>
            }
            {selectedServerClass != undefined &&
               selectedServerClass.classProperties?.map(v =>
                  <div className="col-auto pm-0 mt-auto mb-auto" key={Math.random()}>
                     <CopyText className="badge blue pl-2 pr-2 ml-1 mr-1" text={v.templateName?.ReplaceAll('@@', '').replace(/([A-Z])/g, ' $1') || ''} copyValue={v.templateName} />
                  </div>
               )
            }
         </div>

         <div id="template-container" className="container-width-scroll">
            <EmailEditor ref={emailEditorRef} onLoad={UnlayerLoaded}
               minHeight={(window.innerHeight - (document.getElementById("template-container")?.getBoundingClientRect().top || 0) - 30)} />
         </div>
         <EmailTemplateEditDetailsModal emailTemplate={template}
            templateTypes={templateTypes}
            alert={errorAlert.alert}
            clearAlert={() => errorAlert.clear()}
            isOpen={isOpenDetailsModal || (errorAlert.alert.List.length > 0)}
            onCancel={() => { setIsOpenDetailsModal(false); errorAlert.clear(); }}
            onSubmit={(temp) => {
               errorAlert.clear();
               setIsOpenDetailsModal(false);
               setTemplate(temp);
            }}
         />
      </>
   );
};

declare type IProps = {
   location: {
      state: {
         defaultEmailTemplate: EmailTemplate,
         emailTemplate: EmailTemplate;
      };
   };
};
export default EmailTemplatesEdit;
