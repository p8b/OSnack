import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { Newsletter } from "../../_core/apiModels";
export type IReturnUseDeleteNewsletter={ data:string , status?: number;};
export const useDeleteNewsletter = (key: string | null): Promise<IReturnUseDeleteNewsletter> =>{
    let url_ = API_URL + "/Newsletter/Delete/{key}";
    if (key !== null && key !== undefined)
    url_ = url_.replace("{key}", encodeURIComponent("" + key));
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.DELETE(url_).then(response => {

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
export type IReturnUsePostNewsletter={ data:string , status?: number;};
export const usePostNewsletter = (newsletter: Newsletter): Promise<IReturnUsePostNewsletter> =>{
    let url_ = API_URL + "/Newsletter/Post";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = newsletter;
    return httpCaller.POST(url_, content_).then(response => {

        switch(response?.status){

            case 201: 
                return response?.json().then((data:string) => {
                    return { data: data, status: response?.status };
                });

            case 417: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            case 422: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            default:
                CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
    });
}