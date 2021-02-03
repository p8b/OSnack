import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/appConst";
import { CommentListAndCommentAndTotalCount } from "../../_core/apiModels";
export type IReturnUseGetComment = { data: CommentListAndCommentAndTotalCount, status?: number; };
export const useGetComment = (productId: number, selectedPage: number, maxItemsPerPage: number): Promise<IReturnUseGetComment> => {
   let url_ = API_URL + "/Comment/Get/{productId}/{selectedPage}/{maxItemsPerPage}";
   if (productId !== null && productId !== undefined)
      url_ = url_.replace("{productId}", encodeURIComponent("" + productId));
   if (selectedPage !== null && selectedPage !== undefined)
      url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
   if (maxItemsPerPage !== null && maxItemsPerPage !== undefined)
      url_ = url_.replace("{maxItemsPerPage}", encodeURIComponent("" + maxItemsPerPage));
   url_ = url_.replace(/[?&]$/, "");
   return httpCaller.GET(url_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: CommentListAndCommentAndTotalCount) => {
               return { data: data, status: response?.status };
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
};