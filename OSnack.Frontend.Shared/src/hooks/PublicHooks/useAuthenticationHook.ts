import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { UserAndIsAuthenticated, ExternalLoginDetails, User, LoginInfo } from "../../_core/apiModels";
export type IReturnUseSilenceAuthentication={ data:UserAndIsAuthenticated , status?: number;};
export const useSilenceAuthentication = (): Promise<IReturnUseSilenceAuthentication> =>{
    let url_ = API_URL + "/Authentication/Get/Silence";
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:UserAndIsAuthenticated) => {
                    return { data: data, status: response?.status };
                });

            case 401: 
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
export type IReturnUseExternalLoginAuthentication={ data:User , status?: number;};
export const useExternalLoginAuthentication = (externalLoginInfo: ExternalLoginDetails): Promise<IReturnUseExternalLoginAuthentication> =>{
    let url_ = API_URL + "/Authentication/Post/ExternalLogin";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = externalLoginInfo;
    return httpCaller.POST(url_, content_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:User) => {
                    return { data: data, status: response?.status };
                });

            case 206: 
                return response?.json().then((data:User) => {
                    return { data: data, status: response?.status };
                });

            case 403: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            case 422: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            case 401: 
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
export type IReturnUseLoginAuthentication={ data:User , status?: number;};
export const useLoginAuthentication = (loginInfo: LoginInfo): Promise<IReturnUseLoginAuthentication> =>{
    let url_ = API_URL + "/Authentication/Post/Login";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = loginInfo;
    return httpCaller.POST(url_, content_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:User) => {
                    return { data: data, status: response?.status };
                });

            case 401: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            case 403: 
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