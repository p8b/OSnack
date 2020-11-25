import React, { useEffect, useRef, useState } from 'react';
import EmailEditor from 'react-email-editor';
import ButtonPopupConfirm from 'osnack-frontend-shared/src/components/Buttons/ButtonPopupConfirm';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { EmailTemplate, ServerVariables } from '../../_core/apiModel-Admin';
import { AlertObj } from 'osnack-frontend-shared/src/components/Texts/Alert';;
import { useCreateEmailTemplate } from '../../hooks/apiCallers/emailTemplate/Post.EmailTemplate';
import { useModifyEmailTemplateDesign } from '../../hooks/apiCallers/emailTemplate/Put.EmailTemplate';
import { useDeleteEmailTemplate } from '../../hooks/apiCallers/emailTemplate/Delete.EmailTemplate';
import CopyText from 'osnack-frontend-shared/src/components/Texts/CopyText';
import { sleep } from 'osnack-frontend-shared/src/_core/appFunc';
import EmailTemplateEditDetailsModal from './EmailTemplateEditDetailsModal';
import { useGetServerVariables } from '../../hooks/apiCallers/emailTemplate/Get.EmailTemplates';
import { useHistory } from 'react-router-dom';

const EmailTemplatesEdit = (props: IProps) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
   const [unlayerOnLoaded, setUnlayerOnLoaded] = useState(false);
   const [template, setTemplate] = useState(props.location.state.emailTemplate);
   const [defaultTemplate] = useState(props.location.state.defaultEmailTemplate || undefined);
   const [isDefaultTemplateUsed, setIsDefaultTemplateUsed] = useState(false);
   const [serverVariables, setServerVariables] = useState<ServerVariables[]>([]);

   const emailEditorRef = useRef<any>();
   const history = useHistory();

   useEffect(() => {
      useGetServerVariables().then(result => {
         setServerVariables(result.List);
      });

      if (props.location.state.emailTemplate.id == 0)
         setIsOpenDetailsModal(true);

      /// needed for after the first time the email editor is loaded
      loadDesgin();
      setIsDefaultTemplateUsed(false);
   }, []);

   const saveTemplate = () => {
      if (!unlayerOnLoaded) return;
      setAlert(alert.PleaseWait);
      emailEditorRef.current?.editor!.exportHtml(async (data: { design: any; html: string; }) => {
         let emailTemp = template;
         emailTemp.html = data.html;
         emailTemp.design = data.design;
         var result: { alert: AlertObj; } = { alert: new AlertObj() };
         if (template.id == 0)
            result = await useCreateEmailTemplate(template);
         else if (template.id != null)
            result = await useModifyEmailTemplateDesign(template);

         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
            setIsOpenDetailsModal(true);
         }
         else {
            //setUnlayerOnLoaded(false);
            //setAlert(alert.Clear);
            //props.onSave();
         }
      });
   };
   const onDelete = async () => {
      sleep(500).then(() => { setAlert(alert.PleaseWait); });
      useDeleteEmailTemplate(template).then(result => {
         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
            setIsOpenDetailsModal(true);
         }
         else {
            //setAlert(alert.Clear);
            //props.onSave();
         }
      });
   };

   const insertDefault = async () => {
      if (!isDefaultTemplateUsed && emailEditorRef.current.editor != undefined) {
         const temp = defaultTemplate.design;
         setIsDefaultTemplateUsed(true);

         (temp?.body.rows[0] as any).columns[0].contents = (temp?.body.rows[0] as any).columns[0].contents.concat((template.design?.body.rows[0] as any).columns[0].contents);
         emailEditorRef.current.editor.loadDesign(temp);
      }
   };
   const UnlayerLoaded = () => {
      setUnlayerOnLoaded(true);
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
         return <Button onClick={insertDefault} children="Insert Default" className="btn-lg btn-green" />;
      else
         return <></>;
   };
   const renderDeleteButton = () => {
      if (!template.isDefaultTemplate && !template.locked && template.id != null && template.id > 0)
         return <ButtonPopupConfirm title="Delete"
            popupMessage="Are your Sure?"
            onConfirmClick={onDelete}
            btnClassName="btn-lg btn-red delete-icon" />;
      else
         return <></>;
   };

   return (
      <>
         <PageHeader title={`${template.id == 0 ? "New" : "Edit"} Template`} className="line-header-lg" />
         <div className="row col-12 mb-2" >

            <Button onClick={() => history.push("/EmailTemplate")} children="Back" className="mr-auto btn-lg back-icon" />
            <Button onClick={saveTemplate} children="Save" className="ml-auto btn-lg btn-green  save-icon" />
            {renderInsertDefaultTemplateButton}
            {renderDeleteButton}
            <Button onClick={() => { setIsOpenDetailsModal(true); }} children="Edit Details" className="btn-lg btn-white edit-icon" />
         </div>
         {template.serverVariables?.length > 0 &&
            <div className="row m-4">
               <div className="m-1">Required Server Variables:</div>
               {template.serverVariables?.map((sv: any) =>
                  <div className="badge col-auto m-1" key={sv.enumValue}>
                     <CopyText text={sv.replacementValue} />
                  </div>
               )}
            </div>
         }

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
