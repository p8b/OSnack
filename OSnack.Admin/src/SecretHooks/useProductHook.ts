import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { ProductListAndTotalCount, Product } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseDeleteProduct={ data:string , status?: number;};
export const useDeleteProduct = async (productId: number): Promise<IReturnUseDeleteProduct> =>{
        let url_ = API_URL + "/Product/Delete/{productId}";
        if (productId !== null && productId !== undefined)
        url_ = url_.replace("{productId}", encodeURIComponent("" + productId));
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.DELETE(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.DELETE(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: string = await response?.json();
                        return { data: responseData, status: response?.status };

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
  
}
export type IReturnUseSearchSecretProduct={ data:ProductListAndTotalCount , status?: number;};
export const useSearchSecretProduct = async (selectedPage: number, maxItemsPerPage: number, filterCategory: string | null, searchValue: string | null, filterStatus: string | null, isSortAsce: boolean, sortName: string | null): Promise<IReturnUseSearchSecretProduct> =>{
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
        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: ProductListAndTotalCount = await response?.json();
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
export type IReturnUsePostProduct={ data:Product , status?: number;};
export const usePostProduct = async (newProduct: Product): Promise<IReturnUsePostProduct> =>{
        let url_ = API_URL + "/Product/Post";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = newProduct;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

                case 201: 
                        var responseData: Product = await response?.json();
                        return { data: responseData, status: response?.status };

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
  
}
export type IReturnUsePutProduct={ data:Product , status?: number;};
export const usePutProduct = async (modifiedProduct: Product): Promise<IReturnUsePutProduct> =>{
        let url_ = API_URL + "/Product/Put";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = modifiedProduct;
        let response = await httpCaller.PUT(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.PUT(url_, content_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: Product = await response?.json();
                        return { data: responseData, status: response?.status };

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
  
}