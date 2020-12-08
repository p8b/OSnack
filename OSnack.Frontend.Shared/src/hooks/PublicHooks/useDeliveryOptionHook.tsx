import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { DeliveryOption } from "../../_core/apiModels";
export const useAllDeliveryOption = async (): Promise<DeliveryOption[]> =>{
        let url_ = API_URL + "/DeliveryOption/Get/All";
        url_ = url_.replace(/[?&]$/, "");

        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

        case 200: 
            return response?.json().then((responseJson: DeliveryOption[]) => {
                return responseJson;
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