import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { Product, MultiResultOfListOfProductAndInteger, MultiResultOfProductAndListOfProduct, Score, ProblemDetails } from "../../_core/apiModels";
export const useDeleteProduct = async (product: Product): Promise<string> =>{
        let url_ = API_URL + "/Product/Delete";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = product;
        const response = await httpCaller.DELETE(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: string) => {
                return responseJson;
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 404: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useSearchProduct = async (selectedPage: number, maxItemsPerPage: number, filterCategory: string | null, searchValue: string | null, filterStatus: string | null, isSortAsce: boolean, sortName: string | null): Promise<MultiResultOfListOfProductAndInteger> =>{
        let url_ = API_URL + "/Product/GET/Search/{selectedPage}/{maxItemsPerPage}/{filterCategory}/{searchValue}/{filterStatus}/{isSortAsce}/{sortName}";
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

        const response = await httpCaller.GET(url_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: MultiResultOfListOfProductAndInteger) => {
                return responseJson;
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useProductAndRelateProduct = async (categoryName: string | null, productName: string | null): Promise<MultiResultOfProductAndListOfProduct> =>{
        let url_ = API_URL + "/Product/GET/ProductAndRelate/{categoryName}/{productName}";
        if (categoryName === undefined || categoryName === null)
            throw new Error("The parameter 'categoryName' must be defined.");
        url_ = url_.replace("{categoryName}", encodeURIComponent("" + categoryName));
        if (productName === undefined || productName === null)
            throw new Error("The parameter 'productName' must be defined.");
        url_ = url_.replace("{productName}", encodeURIComponent("" + productName));
        url_ = url_.replace(/[?&]$/, "");

        const response = await httpCaller.GET(url_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: MultiResultOfProductAndListOfProduct) => {
                return responseJson;
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
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
        const response = await httpCaller.POST(url_, content_);

        switch(response?.status){

        case 201: 
            return response.json().then((responseJson: Product) => {
                return responseJson;
            });

        case 422: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 412: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useScoreProduct = async (newScore: Score): Promise<void> =>{
        let url_ = API_URL + "/Product/Post/Score/Score";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = newScore;
        const response = await httpCaller.POST(url_, content_);

        switch(response?.status){

        case 201: 
            return;

        case 422: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 412: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
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
        const response = await httpCaller.PUT(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: Product) => {
                return responseJson;
            });

        case 412: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 422: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}