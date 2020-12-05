import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { User, ProblemDetails } from "osnack-frontend-shared/src/_core/apiModels";
export const useSilentSecretAuthentication = async (): Promise<User> =>{
        let url_ = API_URL + "/Authentication/Post/SilentSecret";
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