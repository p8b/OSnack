import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { Communication } from "../../_core/apiModels";
export type IReturnUsePostQuestionCommunication={ data:string , status?: number;};
export const usePostQuestionCommunication = async (newContact: Communication): Promise<IReturnUsePostQuestionCommunication> =>{
        let url_ = API_URL + "/Communication/Post/PostQuestion";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = newContact;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

                case 201: 
                        var responseData: string = await response?.json();
                        return { data: responseData, status: response?.status };

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
  
}