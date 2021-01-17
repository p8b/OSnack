import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { LoginInfo, User, ExternalLoginDetails } from "../../_core/apiModels";
export type IReturnUseAntiforgeryTokenAuthentication={ data: null , status?: number;};
export const useAntiforgeryTokenAuthentication = async (): Promise<IReturnUseAntiforgeryTokenAuthentication> =>{
        let url_ = API_URL + "/Authentication/Get/AntiforgeryToken";
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

                case 200: 
                        return { data: null, status: 200 };

                default:
                        CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                        throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
  
}
export type IReturnUseLoginOfficialAuthentication={ data:User , status?: number;};
export const useLoginOfficialAuthentication = async (loginInfo: LoginInfo): Promise<IReturnUseLoginOfficialAuthentication> =>{
        let url_ = API_URL + "/Authentication/Post/LoginOfficial";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = loginInfo;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: User = await response?.json();
                        return { data: responseData, status: response?.status };

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
  
}
export type IReturnUseLoginSecretAuthentication={ data:User , status?: number;};
export const useLoginSecretAuthentication = async (loginInfo: LoginInfo): Promise<IReturnUseLoginSecretAuthentication> =>{
        let url_ = API_URL + "/Authentication/Post/LoginSecret";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = loginInfo;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: User = await response?.json();
                        return { data: responseData, status: response?.status };

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
  
}
export type IReturnUseExternalLoginOfficialAuthentication={ data:User , status?: number;};
export const useExternalLoginOfficialAuthentication = async (externalLoginInfo: ExternalLoginDetails): Promise<IReturnUseExternalLoginOfficialAuthentication> =>{
        let url_ = API_URL + "/Authentication/Post/ExternalLoginOfficial";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = externalLoginInfo;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

                case 202: 
                        var responseData: User = await response?.json();
                        return { data: responseData, status: response?.status };

                case 206: 
                        var responseData: User = await response?.json();
                        return { data: responseData, status: response?.status };

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
  
}
export type IReturnUseExternalLoginSecretAuthentication={ data:User , status?: number;};
export const useExternalLoginSecretAuthentication = async (externalLoginInfo: ExternalLoginDetails): Promise<IReturnUseExternalLoginSecretAuthentication> =>{
        let url_ = API_URL + "/Authentication/Post/ExternalLoginSecret";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = externalLoginInfo;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

                case 202: 
                        var responseData: User = await response?.json();
                        return { data: responseData, status: response?.status };

                case 206: 
                        var responseData: User = await response?.json();
                        return { data: responseData, status: response?.status };

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
  
}