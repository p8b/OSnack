import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { CommentListAndTotalCount, Comment } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseAllComment={ data:CommentListAndTotalCount , status?: number;};
export const useAllComment = async (productId: number, selectedPage: number, maxItemsPerPage: number): Promise<IReturnUseAllComment> =>{
        let url_ = API_URL + "/Comment/Get/All/{productId}/{selectedPage}/{maxItemsPerPage}";
        if (productId !== null && productId !== undefined)
        url_ = url_.replace("{productId}", encodeURIComponent("" + productId));
        if (selectedPage !== null && selectedPage !== undefined)
        url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
        if (maxItemsPerPage !== null && maxItemsPerPage !== undefined)
        url_ = url_.replace("{maxItemsPerPage}", encodeURIComponent("" + maxItemsPerPage));
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: CommentListAndTotalCount = await response?.json();
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
export const useAddReplyComment = async (modifiedComment: Comment): Promise<IReturnUseAddReplyComment> =>{
        let url_ = API_URL + "/Comment/Put/AddReply";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = modifiedComment;
        let response = await httpCaller.PUT(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.PUT(url_, content_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: Comment = await response?.json();
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