import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { MultiResultOfListOfProductAndInteger, MultiResultOfProductAndListOfProduct } from "../../_core/apiModels";
export const useSearchPublicProduct = async (selectedPage: number, maxItemsPerPage: number, filterCategory: string | null, searchValue: string | null, isSortAsce: boolean, sortName: string | null): Promise<MultiResultOfListOfProductAndInteger> =>{
        let url_ = API_URL + "/Product/GET/SearchPublic/{selectedPage}/{maxItemsPerPage}/{filterCategory}/{searchValue}/{isSortAsce}/{sortName}";
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

        case 404: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}