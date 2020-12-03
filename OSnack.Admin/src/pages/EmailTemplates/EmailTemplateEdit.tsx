import React, { useEffect, useRef, useState } from 'react';
import EmailEditor from 'react-email-editor';
import ButtonPopupConfirm from 'osnack-frontend-shared/src/components/Buttons/ButtonPopupConfirm';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { EmailTemplate, MultiResultOfEmailTemplateAndEmailTemplate, ServerVariables } from 'osnack-frontend-shared/src/_core/apiModels';
import { AlertObj } from 'osnack-frontend-shared/src/components/Texts/Alert';;
import {
   usePostEmailTemplate, usePutEmailTemplate, useDeleteEmailTemplate,
   useGetEmailTemplate, useGetServerVariablesEmailTemplate
} from 'osnack-frontend-shared/src/hooks/apiHooks/useEmailTemplateHook';
import CopyText from 'osnack-frontend-shared/src/components/Texts/CopyText';
import { sleep } from 'osnack-frontend-shared/src/_core/appFunc';
import EmailTemplateEditDetailsModal from './EmailTemplateEditDetailsModal';
import { Redirect, useHistory } from 'react-router-dom';

const EmailTemplatesEdit = (props: IProps) => {
   const history = useHistory();
   const isUnmounted = useRef(false);
   const emailEditorRef = useRef<any>();
   const [alert, setAlert] = useState(new AlertObj());

   const [template, setTemplate] = useState(new EmailTemplate());
   const [defaultTemplate, setDefaultTemplate] = useState(new EmailTemplate());
   const [serverVariables, setServerVariables] = useState<ServerVariables[]>([]);
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
      setInitialLockedStatus(props.location.state.emailTemplate.locked);
      setDefaultTemplate(props.location.state.defaultEmailTemplate);

      if (props.location.state.emailTemplate.id > 0)
         useGetEmailTemplate(props.location.state.emailTemplate.id).then(
            (result: MultiResultOfEmailTemplateAndEmailTemplate) => {
               setTemplate(result.part1 ? result.part1 : new EmailTemplate());
               setInitialLockedStatus(result.part1?.locked);
               setDefaultTemplate(result.part2 ? result.part2 : new EmailTemplate());
            });

      //useGetEmailTemplate(props.location.state.emailTemplate).then(result => {
      //   if (!isUnmounted.current) {
      //      setTemplate(result.template);
      //      setInitialLockedStatus(result.template.locked);
      //      setDefaultTemplate(result.defaultTemplate);
      //   }
      //});


      useGetServerVariablesEmailTemplate().then(result => {
         setServerVariables(result);
      });


      if (props.location.state.emailTemplate.id == 0)
         setIsOpenDetailsModal(true);

      /// needed for after the first time the email editor is loaded
      setIsDefaultTemplateUsed(false);
      return () => { isUnmounted.current = true; };
   }, []);
   useEffect(() => {
      loadDesgin();
   }, [template]);

   const saveTemplate = () => {
      if (!isEditorLoaded) return;

      sleep(500, isUnmounted).then(() => { setAlert(alert.PleaseWait); });

      emailEditorRef.current?.editor!.exportHtml(async (data: { design: any; html: string; }) => {
         if (isUnmounted.current) return;

         let emailTemp = template;
         emailTemp.html = data.html;
         emailTemp.design = data.design;
         var result: { alert: AlertObj; template: EmailTemplate; }
            = { alert: new AlertObj(), template: new EmailTemplate() };
         if (template.id == 0)
            await usePostEmailTemplate(template).then((emailTemplate) => {
               result.template = emailTemplate;
            }).catch((alert) => {
               result.alert = alert;
            });
         //   result = await usePostEmailTemplate(template);
         else if (template.id != null)
            await usePutEmailTemplate(template).then((emailTemplate) => {
               result.template = emailTemplate;
            }).catch((alert) => {
               result.alert = alert;
            });

         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
            setIsOpenDetailsModal(true);
         }
         else {
            setIsOpenDetailsModal(false);
            setAlert(alert.Clear);
            setIsSaved(true);
            setTemplate(result.template);
            setInitialLockedStatus(result.template.locked);
            sleep(3000, isUnmounted).then(() => { setIsSaved(false); });
         }
      });
   };
   const onDelete = async () => {
      sleep(500, isUnmounted).then(() => { setAlert(alert.PleaseWait); });
      useDeleteEmailTemplate(template).then((message) => {
         if (isUnmounted.current) return;
         setAlert(alert.addSingleSuccess("Deleted", message));
         sleep(3000, isUnmounted).then(() => { setIsTemplateRecognised(false); });
      }).catch((alert) => {
         if (isUnmounted.current) return;
         setAlert(alert);
         setIsOpenDetailsModal(true);
      });

      //useDeleteEmailTemplate(template).then(result => {
      //   if (isUnmounted.current) return;

      //   if (result.alert.List.length > 0) {
      //      alert.List = result.alert.List;
      //      alert.Type = result.alert.Type;
      //      setAlert(alert);
      //      setIsOpenDetailsModal(true);
      //   }
      //   else {
      //      setAlert(alert.addSingleSuccess("Deleted", "Deleted"));
      //      sleep(3000, isUnmounted).then(() => { setIsTemplateRecognised(false); });
      //   }
      //});
   };

   const insertDefault = async () => {
      if (defaultTemplate != undefined
         && template.design != null
         && !isDefaultTemplateUsed
         && emailEditorRef.current.editor != undefined) {

         const temp = defaultTemplate.design;
         setIsDefaultTemplateUsed(true);
         console.log(template.design);
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
      if (!template.isDefaultTemplate && !isDefaultTemplateUsed)
         return <Button onClick={insertDefault} children="Add Default" className="btn-lg btn-blue ml-auto" />;
      else
         return <></>;
   };
   const renderDeleteButton = () => {
      if (!template.isDefaultTemplate && template.id > 0 && !initialLockedStatus)
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
         <PageHeader title={`${template.id == 0 ? "New" : "Edit"} Template`} className="line-header-lg" />
         <div className="row col-12 mb-2" >

            <Button onClick={() => history.push("/EmailTemplate")} children="Back" className="mr-auto btn-lg back-icon" />
            {renderInsertDefaultTemplateButton()}
            <Button onClick={() => { setIsOpenDetailsModal(true); }} children="Details" className="btn-lg btn-white edit-icon" />
            {renderDeleteButton()}
            <Button onClick={saveTemplate} children={`Save${isSaved ? "d" : ""}`} className={`btn-lg btn-green ${isSaved ? "tick-icon" : "save-icon"}`} />
         </div>
         <div className="row col-12 ml-2">
            <div className="col-12 m-0 p-0">Name: {template.name}</div>
            {template.serverVariables && template.serverVariables?.length > 0 &&
               <>
                  <div>Required Server Variables:</div>
                  {template.serverVariables?.map((sv: any) =>
                     <div className="badge col-auto ml-1 mt-1 mt-sm-0" key={sv.enumValue}>
                        <CopyText text={sv.replacementValue} />
                     </div>
                  )}
               </>
            }
         </div>

         <div className="container-width-scroll">
            <EmailEditor ref={emailEditorRef} onLoad={UnlayerLoaded} />
         </div>
         <EmailTemplateEditDetailsModal emailTemplate={template}
            alert={alert}
            clearAlert={() => setAlert(alert.Clear)}
            isOpen={isOpenDetailsModal || alert.List.length > 0}
            onCancel={() => { setIsOpenDetailsModal(false); setAlert(alert.Clear); }}
            onSubmit={(temp) => {
               setAlert(alert.Clear);
               setIsOpenDetailsModal(false);
               setTemplate(temp);
            }}
            serverVariables={serverVariables}
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

