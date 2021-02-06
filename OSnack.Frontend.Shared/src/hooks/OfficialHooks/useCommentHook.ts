import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/appConst";
import { Comment } from "../../_core/apiModels";
export type IReturnUsePostComment={ data:Comment , status?: number;};
export const usePostComment = (newComment: Comment): Promise<IReturnUsePostComment> =>{
    let url_ = API_URL + "/Comment/Post";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = newComment;
    return httpCaller.POST(url_, content_).then(response => {

        switch(response?.status){

            case 201: 
                return response?.json().then((data:Comment) => {
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
export type IReturnUsePutComment={ data:Comment , status?: number;};
export const usePutComment = (modifiedComment: Comment): Promise<IReturnUsePutComment> =>{
    let url_ = API_URL + "/Comment/Put";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = modifiedComment;
    return httpCaller.PUT(url_, content_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:Comment) => {
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