import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { User } from "osnack-frontend-shared/src/_core/apiModels";
export const useSilentSecretAuthentication = async (): Promise<{ data:User , status?: number}> =>{
        let url_ = API_URL + "/Authentication/Post/SilentSecret";
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.POST(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: User = await response?.json();
                        return { data: responseData, status: response?.status };

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