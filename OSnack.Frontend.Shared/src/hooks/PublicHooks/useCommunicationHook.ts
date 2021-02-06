import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/appConst";
import { Communication } from "../../_core/apiModels";
export type IReturnUseGetQuestionCommunication={ data:Communication , status?: number;};
export const useGetQuestionCommunication = (questionKey: string | null): Promise<IReturnUseGetQuestionCommunication> =>{
    let url_ = API_URL + "/Communication/Get/GetQuestion/{questionKey}";
    if (questionKey !== null && questionKey !== undefined)
    url_ = url_.replace("{questionKey}", encodeURIComponent("" + questionKey));
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:Communication) => {
                    return { data: data, status: response?.status };
                });

            case 417: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            case 412: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            default:
                CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
    });
}
export type IReturnUsePostQuestionCommunication={ data:string , status?: number;};
export const usePostQuestionCommunication = (newContact: Communication): Promise<IReturnUsePostQuestionCommunication> =>{
    let url_ = API_URL + "/Communication/Post/PostQuestion";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = newContact;
    return httpCaller.POST(url_, content_).then(response => {

        switch(response?.status){

            case 201: 
                return response?.json().then((data:string) => {
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