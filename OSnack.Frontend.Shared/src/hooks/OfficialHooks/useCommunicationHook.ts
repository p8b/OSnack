import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { Communication } from "../../_core/apiModels";
export type IReturnUseGetDisputeCommunication={ data:Communication , status?: number;};
export const useGetDisputeCommunication = async (disputeKey: string | null): Promise<IReturnUseGetDisputeCommunication> =>{
        let url_ = API_URL + "/Communication/Get/GetDispute/{disputeKey}";
        if (disputeKey !== null && disputeKey !== undefined)
        url_ = url_.replace("{disputeKey}", encodeURIComponent("" + disputeKey));
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: Communication = await response?.json();
                        return { data: responseData, status: response?.status };

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
  
}
export type IReturnUsePostDisputeCommunication={ data:Communication , status?: number;};
export const usePostDisputeCommunication = async (newDispute: Communication): Promise<IReturnUsePostDisputeCommunication> =>{
        let url_ = API_URL + "/Communication/Post/PostDispute";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = newDispute;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

                case 201: 
                        var responseData: Communication = await response?.json();
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
export type IReturnUsePutOfficialCommunication={ data:Communication , status?: number;};
export const usePutOfficialCommunication = async (communicationId: string | null, messageBody: string | null): Promise<IReturnUsePutOfficialCommunication> =>{
        let url_ = API_URL + "/Communication/Put/PutOfficial/{communicationId}/{messageBody}";
        if (communicationId !== null && communicationId !== undefined)
        url_ = url_.replace("{communicationId}", encodeURIComponent("" + communicationId));
        if (messageBody !== null && messageBody !== undefined)
        url_ = url_.replace("{messageBody}", encodeURIComponent("" + messageBody));
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.PUT(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.PUT(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: Communication = await response?.json();
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