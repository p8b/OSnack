import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { CommentListAndCommentAndTotalCount } from "../../_core/apiModels";
export type IReturnUseGetComment={ data:CommentListAndCommentAndTotalCount , status?: number;};
export const useGetComment = async (productId: number, selectedPage: number, maxItemsPerPage: number): Promise<IReturnUseGetComment> =>{
        let url_ = API_URL + "/Comment/Get/{productId}/{selectedPage}/{maxItemsPerPage}";
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
                        var responseData: CommentListAndCommentAndTotalCount = await response?.json();
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