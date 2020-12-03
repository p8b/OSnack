import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { EmailTemplate, MultiResultOfEmailTemplateAndEmailTemplate, ServerVariables } from "../../_core/apiModels";
export const usePostEmailTemplate = async (emailTemplate: EmailTemplate): Promise<EmailTemplate> =>{
        let url_ = API_URL + "/EmailTemplate/Post";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = emailTemplate;
        const response = await httpCaller.POST(url_, content_);

        switch(response?.status){

        case 201: 
            return response.json().then((responseJson: EmailTemplate) => {
                return responseJson;
            });

        case 422: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const usePutEmailTemplate = async (emailTemplate: EmailTemplate): Promise<EmailTemplate> =>{
        let url_ = API_URL + "/EmailTemplate/Put";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = emailTemplate;
        const response = await httpCaller.PUT(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: EmailTemplate) => {
                return responseJson;
            });

        case 422: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useDeleteEmailTemplate = async (emailTemplate: EmailTemplate): Promise<string> =>{
        let url_ = API_URL + "/EmailTemplate/Delete";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = emailTemplate;
        const response = await httpCaller.DELETE(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: string) => {
                return responseJson;
            });

        case 422: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useAllEmailTemplate = async (): Promise<EmailTemplate[]> =>{
        let url_ = API_URL + "/EmailTemplate/Get/All";
        url_ = url_.replace(/[?&]$/, "");

        const response = await httpCaller.GET(url_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: EmailTemplate[]) => {
                return responseJson;
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useGetEmailTemplate = async (templateId: number): Promise<MultiResultOfEmailTemplateAndEmailTemplate> =>{
        let url_ = API_URL + "/EmailTemplate/Get/{templateId}";
        if (templateId === undefined || templateId === null)
            throw new Error("The parameter 'templateId' must be defined.");
        url_ = url_.replace("{templateId}", encodeURIComponent("" + templateId));
        url_ = url_.replace(/[?&]$/, "");

        const response = await httpCaller.GET(url_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: MultiResultOfEmailTemplateAndEmailTemplate) => {
                return responseJson;
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useGetServerVariablesEmailTemplate = async (): Promise<ServerVariables[]> =>{
        let url_ = API_URL + "/EmailTemplate/GetServerVariables";
        url_ = url_.replace(/[?&]$/, "");

        const response = await httpCaller.GET(url_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: ServerVariables[]) => {
                return responseJson;
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}