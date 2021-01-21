import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { EmailTemplate, EmailTemplateAndDefaultEmailTemplate, EmailTemplateTypes } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseAllTemplateEmail={ data:EmailTemplate[] , status?: number;};
export const useAllTemplateEmail = (): Promise<IReturnUseAllTemplateEmail> =>{
    let url_ = API_URL + "/Email/Get/AllTemplate";
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:EmailTemplate[]) => {
                    return { data: data, status: response?.status };
                });

            case 417: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            default:
                CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
    });
}
export type IReturnUseGetTemplateEmail={ data:EmailTemplateAndDefaultEmailTemplate , status?: number;};
export const useGetTemplateEmail = (templateId: number): Promise<IReturnUseGetTemplateEmail> =>{
    let url_ = API_URL + "/Email/GetTemplate/{templateId}";
    if (templateId !== null && templateId !== undefined)
    url_ = url_.replace("{templateId}", encodeURIComponent("" + templateId));
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:EmailTemplateAndDefaultEmailTemplate) => {
                    return { data: data, status: response?.status };
                });

            case 417: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            default:
                CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
    });
}
export type IReturnUseGetAllAvailableTemplateTypesEmail={ data:EmailTemplateTypes[] , status?: number;};
export const useGetAllAvailableTemplateTypesEmail = (): Promise<IReturnUseGetAllAvailableTemplateTypesEmail> =>{
    let url_ = API_URL + "/Email/GetAllAvailableTemplateTypes";
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:EmailTemplateTypes[]) => {
                    return { data: data, status: response?.status };
                });

            case 417: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            default:
                CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
    });
}
export type IReturnUsePostTemplateEmail={ data:EmailTemplate , status?: number;};
export const usePostTemplateEmail = (emailTemplate: EmailTemplate): Promise<IReturnUsePostTemplateEmail> =>{
    let url_ = API_URL + "/Email/PostTemplate";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = emailTemplate;
    return httpCaller.POST(url_, content_).then(response => {

        switch(response?.status){

            case 201: 
                return response?.json().then((data:EmailTemplate) => {
                    return { data: data, status: response?.status };
                });

            case 422: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            case 417: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            default:
                CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
    });
}
export type IReturnUsePutTemplateEmail={ data:EmailTemplate , status?: number;};
export const usePutTemplateEmail = (emailTemplate: EmailTemplate): Promise<IReturnUsePutTemplateEmail> =>{
    let url_ = API_URL + "/Email/PutTemplate";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = emailTemplate;
    return httpCaller.PUT(url_, content_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:EmailTemplate) => {
                    return { data: data, status: response?.status };
                });

            case 422: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            case 417: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            default:
                CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
    });
}