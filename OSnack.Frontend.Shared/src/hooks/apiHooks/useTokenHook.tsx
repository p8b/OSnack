import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { ProblemDetails } from "../../_core/apiModels";
export const useGetIsTokenValidToken = async (token: string | null): Promise<void> =>{
        let url_ = API_URL + "/Token/Get/IsTokenValid/{token}";
        if (token === undefined || token === null)
            throw new Error("The parameter 'token' must be defined.");
        url_ = url_.replace("{token}", encodeURIComponent("" + token));
        url_ = url_.replace(/[?&]$/, "");

        const response = await httpCaller.GET(url_);

        switch(response?.status){

        case 201: 
            return;

        case 412: 
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