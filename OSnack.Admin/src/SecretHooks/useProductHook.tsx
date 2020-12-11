import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { Product, MultiResultOfListOfProductAndInteger } from "osnack-frontend-shared/src/_core/apiModels";
export const useDeleteProduct = async (product: Product): Promise<string> =>{
        let url_ = API_URL + "/Product/Delete";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = product;
        let response = await httpCaller.DELETE(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.DELETE(url_, content_);
        }

        switch(response?.status){

        case 200: 
            return response?.json().then((responseJson: string) => {
                return responseJson;
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
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useSearchSecretProduct = async (selectedPage: number, maxItemsPerPage: number, filterCategory: string | null, searchValue: string | null, filterStatus: string | null, isSortAsce: boolean, sortName: string | null): Promise<MultiResultOfListOfProductAndInteger> =>{
        let url_ = API_URL + "/Product/GET/SearchSecret/{selectedPage}/{maxItemsPerPage}/{filterCategory}/{searchValue}/{filterStatus}/{isSortAsce}/{sortName}";
        if (selectedPage === undefined || selectedPage === null)
            throw new Error("The parameter 'selectedPage' must be defined.");
        url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
        if (maxItemsPerPage === undefined || maxItemsPerPage === null)
            throw new Error("The parameter 'maxItemsPerPage' must be defined.");
        url_ = url_.replace("{maxItemsPerPage}", encodeURIComponent("" + maxItemsPerPage));
        if (filterCategory === undefined || filterCategory === null)
            throw new Error("The parameter 'filterCategory' must be defined.");
        url_ = url_.replace("{filterCategory}", encodeURIComponent("" + filterCategory));
        if (searchValue === undefined || searchValue === null)
            throw new Error("The parameter 'searchValue' must be defined.");
        url_ = url_.replace("{searchValue}", encodeURIComponent("" + searchValue));
        if (filterStatus === undefined || filterStatus === null)
            throw new Error("The parameter 'filterStatus' must be defined.");
        url_ = url_.replace("{filterStatus}", encodeURIComponent("" + filterStatus));
        if (isSortAsce === undefined || isSortAsce === null)
            throw new Error("The parameter 'isSortAsce' must be defined.");
        url_ = url_.replace("{isSortAsce}", encodeURIComponent("" + isSortAsce));
        if (sortName === undefined || sortName === null)
            throw new Error("The parameter 'sortName' must be defined.");
        url_ = url_.replace("{sortName}", encodeURIComponent("" + sortName));
        url_ = url_.replace(/[?&]$/, "");

        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

        case 200: 
            return response?.json().then((responseJson: MultiResultOfListOfProductAndInteger) => {
                return responseJson;
            });

        case 417: 
            return response?.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const usePostProduct = async (newProduct: Product): Promise<Product> =>{
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
            return response?.json().then((responseJson: Product) => {
                return responseJson;
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
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const usePutProduct = async (modifiedProduct: Product): Promise<Product> =>{
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
            return response?.json().then((responseJson: Product) => {
                return responseJson;
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
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}