import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/appConst";
import { ProductListAndTotalCount, Product } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseDeleteProduct={ data:string , status?: number;};
export const useDeleteProduct = (productId: number): Promise<IReturnUseDeleteProduct> =>{
    let url_ = API_URL + "/Product/Delete/{productId}";
    if (productId !== null && productId !== undefined)
    url_ = url_.replace("{productId}", encodeURIComponent("" + productId));
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.DELETE(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:string) => {
                    return { data: data, status: response?.status };
                });

            case 404: 
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
export type IReturnUseSearchSecretProduct={ data:ProductListAndTotalCount , status?: number;};
export const useSearchSecretProduct = (selectedPage: number, maxItemsPerPage: number, filterCategory: string | null, searchValue: string | null, filterStatus: string | null, isSortAsce: boolean, sortName: string | null): Promise<IReturnUseSearchSecretProduct> =>{
    let url_ = API_URL + "/Product/GET/SearchSecret/{selectedPage}/{maxItemsPerPage}/{filterCategory}/{searchValue}/{filterStatus}/{isSortAsce}/{sortName}";
    if (selectedPage !== null && selectedPage !== undefined)
    url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
    if (maxItemsPerPage !== null && maxItemsPerPage !== undefined)
    url_ = url_.replace("{maxItemsPerPage}", encodeURIComponent("" + maxItemsPerPage));
    if (filterCategory !== null && filterCategory !== undefined)
    url_ = url_.replace("{filterCategory}", encodeURIComponent("" + filterCategory));
    if (searchValue !== null && searchValue !== undefined)
    url_ = url_.replace("{searchValue}", encodeURIComponent("" + searchValue));
    if (filterStatus !== null && filterStatus !== undefined)
    url_ = url_.replace("{filterStatus}", encodeURIComponent("" + filterStatus));
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
export type IReturnUsePostProduct={ data:Product , status?: number;};
export const usePostProduct = (newProduct: Product): Promise<IReturnUsePostProduct> =>{
    let url_ = API_URL + "/Product/Post";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = newProduct;
    return httpCaller.POST(url_, content_).then(response => {

        switch(response?.status){

            case 201: 
                return response?.json().then((data:Product) => {
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
export type IReturnUsePutProduct={ data:Product , status?: number;};
export const usePutProduct = (modifiedProduct: Product): Promise<IReturnUsePutProduct> =>{
    let url_ = API_URL + "/Product/Put";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = modifiedProduct;
    return httpCaller.PUT(url_, content_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:Product) => {
                    return { data: data, status: response?.status };
                });

            case 412: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            case 422: 
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