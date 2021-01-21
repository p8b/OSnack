import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { ProductListAndTotalCount, ProductAndRelatedProductList } from "../../_core/apiModels";
export type IReturnUseSearchPublicProduct={ data:ProductListAndTotalCount , status?: number;};
export const useSearchPublicProduct = (selectedPage: number, maxItemsPerPage: number, filterCategory: string | null, searchValue: string | null, isSortAsce: boolean, sortName: string | null): Promise<IReturnUseSearchPublicProduct> =>{
    let url_ = API_URL + "/Product/GET/SearchPublic/{selectedPage}/{maxItemsPerPage}/{filterCategory}/{searchValue}/{isSortAsce}/{sortName}";
    if (selectedPage !== null && selectedPage !== undefined)
    url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
    if (maxItemsPerPage !== null && maxItemsPerPage !== undefined)
    url_ = url_.replace("{maxItemsPerPage}", encodeURIComponent("" + maxItemsPerPage));
    if (filterCategory !== null && filterCategory !== undefined)
    url_ = url_.replace("{filterCategory}", encodeURIComponent("" + filterCategory));
    if (searchValue !== null && searchValue !== undefined)
    url_ = url_.replace("{searchValue}", encodeURIComponent("" + searchValue));
    if (isSortAsce !== null && isSortAsce !== undefined)
    url_ = url_.replace("{isSortAsce}", encodeURIComponent("" + isSortAsce));
    if (sortName !== null && sortName !== undefined)
    url_ = url_.replace("{sortName}", encodeURIComponent("" + sortName));
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:ProductListAndTotalCount) => {
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
}
export type IReturnUseProductAndRelateProduct={ data:ProductAndRelatedProductList , status?: number;};
export const useProductAndRelateProduct = (categoryName: string | null, productName: string | null): Promise<IReturnUseProductAndRelateProduct> =>{
    let url_ = API_URL + "/Product/GET/ProductAndRelate/{categoryName}/{productName}";
    if (categoryName !== null && categoryName !== undefined)
    url_ = url_.replace("{categoryName}", encodeURIComponent("" + categoryName));
    if (productName !== null && productName !== undefined)
    url_ = url_.replace("{productName}", encodeURIComponent("" + productName));
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:ProductAndRelatedProductList) => {
                    return { data: data, status: response?.status };
                });

            case 417: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            case 404: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            default:
                CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
    });
}