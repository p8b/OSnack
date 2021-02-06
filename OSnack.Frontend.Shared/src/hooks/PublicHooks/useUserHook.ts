import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/appConst";
import { User } from "../../_core/apiModels";
export type IReturnUseCreateCustomerUser={ data:User , status?: number;};
export const useCreateCustomerUser = (newCustomer: User, subscribeNewsLetter: boolean): Promise<IReturnUseCreateCustomerUser> =>{
    let url_ = API_URL + "/User/Post/CreateCustomer/{subscribeNewsLetter}";
    if (subscribeNewsLetter !== null && subscribeNewsLetter !== undefined)
    url_ = url_.replace("{subscribeNewsLetter}", encodeURIComponent("" + subscribeNewsLetter));
    url_ = url_.replace(/[?&]$/, "");
    const content_ = newCustomer;
    return httpCaller.POST(url_, content_).then(response => {

        switch(response?.status){

            case 201: 
                return response?.json().then((data:User) => {
                    return { data: data, status: response?.status };
                });

            case 422: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            case 412: 
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
export type IReturnUseRequestPasswordResetUser={ data: null , status?: number;};
export const useRequestPasswordResetUser = (email: string): Promise<IReturnUseRequestPasswordResetUser> =>{
    let url_ = API_URL + "/User/Post/RequestPasswordReset";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = email;
    return httpCaller.POST(url_, content_).then(response => {

        switch(response?.status){

            case 201: 
                return { data: null, status: 201 };

            case 412: 
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
export type IReturnUseConfirmEmailUser={ data: null , status?: number;};
export const useConfirmEmailUser = (pathName: string): Promise<IReturnUseConfirmEmailUser> =>{
    let url_ = API_URL + "/User/Put/ConfirmEmail";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = pathName;
    return httpCaller.PUT(url_, content_).then(response => {

        switch(response?.status){

            case 200: 
                return { data: null, status: 200 };

            case 412: 
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
export type IReturnUseUpdatePasswordWithTokenUser={ data:string , status?: number;};
export const useUpdatePasswordWithTokenUser = (data: any): Promise<IReturnUseUpdatePasswordWithTokenUser> =>{
    let url_ = API_URL + "/User/Put/UpdatePasswordWithToken";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = data;
    return httpCaller.PUT(url_, content_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:string) => {
                    return { data: data, status: response?.status };
                });

            case 412: 
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