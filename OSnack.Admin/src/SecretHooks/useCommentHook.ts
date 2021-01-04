import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { Comment } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseAllComment={ data:Comment[] , status?: number;};
export const useAllComment = async (productId: number): Promise<IReturnUseAllComment> =>{
        let url_ = API_URL + "/Comment/Get/All/{productId}";
        if (productId !== null && productId !== undefined)
        url_ = url_.replace("{productId}", encodeURIComponent("" + productId));
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: Comment[] = await response?.json();
                        return { data: responseData, status: response?.status };

                case 417: 
                        return response?.json().then((data: ErrorDto[]) => {
                                throw new AlertObj(data, AlertTypes.Error, response?.status);
                        });

                default:
                        CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                        throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
  
}
export type IReturnUseAddReplyComment={ data:Comment , status?: number;};
export const useAddReplyComment = async (commentId: number, reply: string | null): Promise<IReturnUseAddReplyComment> =>{
        let url_ = API_URL + "/Comment/Put/AddReply/{commentId}/{reply}";
        if (commentId !== null && commentId !== undefined)
        url_ = url_.replace("{commentId}", encodeURIComponent("" + commentId));
        if (reply !== null && reply !== undefined)
        url_ = url_.replace("{reply}", encodeURIComponent("" + reply));
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.PUT(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.PUT(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: Comment = await response?.json();
                        return { data: responseData, status: response?.status };

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