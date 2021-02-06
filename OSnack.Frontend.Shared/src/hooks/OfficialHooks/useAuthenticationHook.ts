import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/appConst";
import { User } from "../../_core/apiModels";
export type IReturnUseLogoutAuthentication={ data: null , status?: number;};
export const useLogoutAuthentication = (): Promise<IReturnUseLogoutAuthentication> =>{
    let url_ = API_URL + "/Authentication/Get/Logout";
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return { data: null, status: 200 };

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
export type IReturnUseConfirmCurrentUserPasswordAuthentication={ data:User , status?: number;};
export const useConfirmCurrentUserPasswordAuthentication = (password: string): Promise<IReturnUseConfirmCurrentUserPasswordAuthentication> =>{
    let url_ = API_URL + "/Authentication/Post/ConfirmCurrentUserPassword";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = password;
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