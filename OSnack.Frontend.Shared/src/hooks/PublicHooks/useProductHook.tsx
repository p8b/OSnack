import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { ProductListAndTotalNumber, ProductAndProductList } from "../../_core/apiModels";
export const useSearchPublicProduct = async (selectedPage: number, maxItemsPerPage: number, filterCategory: string | null, searchValue: string | null, isSortAsce: boolean, sortName: string | null): Promise<{ data:ProductListAndTotalNumber , status: number | undefined}> =>{
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
        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: ProductListAndTotalNumber = await response?.json();
                        return { data: responseData, status: response?.status };

                case 417: 
                        return response?.json().then((data: ErrorDto[]) => {
                                throw new AlertObj(data, AlertTypes.Error, response?.status);
                        });

                default:
                        CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status || "N/A"}`;
                        throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
  
}
export const useProductAndRelateProduct = async (categoryName: string | null, productName: string | null): Promise<{ data:ProductAndProductList , status: number | undefined}> =>{
        let url_ = API_URL + "/Product/GET/ProductAndRelate/{categoryName}/{productName}";
        if (categoryName !== null && categoryName !== undefined)
        url_ = url_.replace("{categoryName}", encodeURIComponent("" + categoryName));
        if (productName !== null && productName !== undefined)
        url_ = url_.replace("{productName}", encodeURIComponent("" + productName));
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: ProductAndProductList = await response?.json();
                        return { data: responseData, status: response?.status };

                case 417: 
                        return response?.json().then((data: ErrorDto[]) => {
                                throw new AlertObj(data, AlertTypes.Error, response?.status);
                        });

                case 404: 
                        return response?.json().then((data: ErrorDto[]) => {
                                throw new AlertObj(data, AlertTypes.Error, response?.status);
                        });

                default:
                        CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status || "N/A"}`;
                        throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
  
}