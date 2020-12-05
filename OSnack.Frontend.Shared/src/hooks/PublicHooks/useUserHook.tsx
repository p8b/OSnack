import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { User } from "../../_core/apiModels";
export const useCreateCustomerUser = async (newCustomer: User): Promise<User> =>{
        let url_ = API_URL + "/User/Post/CreateCustomer";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = newCustomer;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

        case 201: 
            return response?.json().then((responseJson: User) => {
                return responseJson;
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
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useRequestPasswordResetUser = async (email: string): Promise<string> =>{
        let url_ = API_URL + "/User/Post/RequestPasswordReset";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = email;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

        case 200: 
            return response?.json().then((responseJson: string) => {
                return responseJson;
            });

        case 412: 
            return response?.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

        case 417: 
            return response?.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

        case 201: 
            return response?.json().then((data: ErrorDto[]) => {
                throw new AlertObj([CommonErrors.BadServerResponse], AlertTypes.Error, response?.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useConfirmEmailUser = async (pathName: string): Promise<void> =>{
        let url_ = API_URL + "/User/Put/ConfirmEmail";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = pathName;
        let response = await httpCaller.PUT(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.PUT(url_, content_);
        }

        switch(response?.status){

        case 200: 
            return;

        case 412: 
            return response?.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

        case 417: 
            return response?.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useUpdatePasswordWithTokenUser = async (data: any): Promise<User> =>{
        let url_ = API_URL + "/User/Put/UpdatePasswordWithToken";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = data;
        let response = await httpCaller.PUT(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.PUT(url_, content_);
        }

        switch(response?.status){

        case 200: 
            return response?.json().then((responseJson: User) => {
                return responseJson;
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
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}