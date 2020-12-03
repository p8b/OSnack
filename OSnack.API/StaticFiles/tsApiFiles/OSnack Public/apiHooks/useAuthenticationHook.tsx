import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { LoginInfo, User, ExternalLoginInfo } from "../../_core/apiModels";
export const useAntiforgeryTokenAuthentication = async (): Promise<void> =>{
        let url_ = API_URL + "/Authentication/Get/AntiforgeryToken";
        url_ = url_.replace(/[?&]$/, "");

        const response = await httpCaller.GET(url_);

        switch(response?.status){

        case 200: 
            return;

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useLoginOfficialAuthentication = async (loginInfo: LoginInfo): Promise<User> =>{
        let url_ = API_URL + "/Authentication/Post/LoginOfficial";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = loginInfo;
        const response = await httpCaller.POST(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: User) => {
                return responseJson;
            });

        case 401: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 403: 
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
export const useLoginSecretAuthentication = async (loginInfo: LoginInfo): Promise<User> =>{
        let url_ = API_URL + "/Authentication/Post/LoginSecret";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = loginInfo;
        const response = await httpCaller.POST(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: User) => {
                return responseJson;
            });

        case 401: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 403: 
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
export const useExternalLoginOfficialAuthentication = async (externalLoginInfo: ExternalLoginInfo): Promise<User> =>{
        let url_ = API_URL + "/Authentication/Post/ExternalLoginOfficial";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = externalLoginInfo;
        const response = await httpCaller.POST(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: User) => {
                return responseJson;
            });

        case 206: 
            return response.json().then((responseJson: User) => {
                return responseJson;
            });

        case 403: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 422: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 401: 
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
export const useExternalLoginSecretAuthentication = async (externalLoginInfo: ExternalLoginInfo): Promise<User> =>{
        let url_ = API_URL + "/Authentication/Post/ExternalLoginSecret";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = externalLoginInfo;
        const response = await httpCaller.POST(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: User) => {
                return responseJson;
            });

        case 206: 
            return response.json().then((responseJson: User) => {
                return responseJson;
            });

        case 403: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 422: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 401: 
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