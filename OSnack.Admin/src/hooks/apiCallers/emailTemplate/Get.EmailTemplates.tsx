import { AlertObj, AlertTypes, Error } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { EmailTemplate, ServerVariables } from "../../../_core/apiModel-Admin";

export const useGetServerVariables = async () => {
   let alert: AlertObj = new AlertObj([], AlertTypes.Error);
   let List: ServerVariables[] = [];
   try {
      const response = await httpCaller.get(`${API_URL}/EmailTemplate/GetServerVariables`);

      switch (response?.status) {
         case 200: // Ok Response
            await response.json().then((data: ServerVariables[]) => {
               List = data;
            });
            break;
         case 417: //Expectation Failed
            await response.json().then((data: Error[]) => {
               alert.List = data;
            });
            break;
         default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
      if (response == null)
         alert.List.push(CommonErrors.BadServerConnection);
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }
   return { alert, List };
};

export const useGetAllEmailTemplates = async () => {
   let alert: AlertObj = new AlertObj([], AlertTypes.Error);
   let templateList: EmailTemplate[] = [];
   try {
      const response = await httpCaller.get(`${API_URL}/EmailTemplate/Get/All`);

      switch (response?.status) {
         case 200: // Ok Response
            await response.json().then((data: EmailTemplate[]) => {
               templateList = data;
            });
            break;
         case 422: //Unprocessable Entity
         case 417: //Expectation Failed
            await response.json().then((data: Error[]) => {
               alert.List = data;
            });
            break;
         default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
      if (response == null)
         alert.List.push(CommonErrors.BadServerConnection);
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }
   return { alert, templateList };
};

export const useGetEmailTemplate = async (template: EmailTemplate) => {
   let alert: AlertObj = new AlertObj([], AlertTypes.Error);
   let defaultTemplate: EmailTemplate = new EmailTemplate();
   try {
      const response = await httpCaller.get(`${API_URL}/EmailTemplate/Get/${template.id}`);

      switch (response?.status) {
         case 200: // Ok Response
            await response.json().then((data: { template: EmailTemplate; defaultTemplate: EmailTemplate; }) => {
               template = data.template;
               defaultTemplate = data.defaultTemplate;
            });
            break;
         case 422: //Unprocessable Entity
         case 417: //Expectation Failed
            await response.json().then((data: Error[]) => {
               alert.List = data;
            });
            break;
         default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
      if (response == null)
         alert.List.push(CommonErrors.BadServerConnection);
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }
   return { alert, template, defaultTemplate };
};