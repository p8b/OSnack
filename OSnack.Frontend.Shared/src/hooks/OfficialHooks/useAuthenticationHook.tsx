import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { User, ProblemDetails } from "../../_core/apiModels";
export const useLogoutAuthentication = async (): Promise<void> =>{
        let url_ = API_URL + "/Authentication/Get/Logout";
        url_ = url_.replace(/[?&]$/, "");

        const response = await httpCaller.GET(url_);

        switch(response?.status){

        case 200: 
            return;

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useSilentOfficialAuthentication = async (): Promise<User> =>{
        let url_ = API_URL + "/Authentication/Post/SilentOfficial";
        url_ = url_.replace(/[?&]$/, "");

        const response = await httpCaller.POST(url_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: User) => {
                return responseJson;
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
export const useConfirmCurrentUserPasswordAuthentication = async (password: string): Promise<User> =>{
        let url_ = API_URL + "/Authentication/Post/ConfirmCurrentUserPassword";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = password;
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

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}