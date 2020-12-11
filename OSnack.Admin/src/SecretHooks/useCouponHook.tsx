import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { Coupon, MultiResultOfListOfCouponAndInteger } from "osnack-frontend-shared/src/_core/apiModels";
export const useDeleteCoupon = async (coupon: Coupon): Promise<string> =>{
        let url_ = API_URL + "/Coupon/Delete";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = coupon;
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

        case 417: 
            return response?.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

        case 404: 
            return response?.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

        case 412: 
            return response?.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useSearchCoupon = async (selectedPage: number, maxNumberPerItemsPage: number, searchValue: string | null, filterType: string | null, isSortAsce: boolean, sortName: string | null): Promise<MultiResultOfListOfCouponAndInteger> =>{
        let url_ = API_URL + "/Coupon/Get/Search/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{filterType}/{isSortAsce}/{sortName}";
        if (selectedPage === undefined || selectedPage === null)
            throw new Error("The parameter 'selectedPage' must be defined.");
        url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
        if (maxNumberPerItemsPage === undefined || maxNumberPerItemsPage === null)
            throw new Error("The parameter 'maxNumberPerItemsPage' must be defined.");
        url_ = url_.replace("{maxNumberPerItemsPage}", encodeURIComponent("" + maxNumberPerItemsPage));
        if (searchValue === undefined || searchValue === null)
            throw new Error("The parameter 'searchValue' must be defined.");
        url_ = url_.replace("{searchValue}", encodeURIComponent("" + searchValue));
        if (filterType === undefined || filterType === null)
            throw new Error("The parameter 'filterType' must be defined.");
        url_ = url_.replace("{filterType}", encodeURIComponent("" + filterType));
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
            return response?.json().then((responseJson: MultiResultOfListOfCouponAndInteger) => {
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
export const usePostCoupon = async (newCoupon: Coupon): Promise<Coupon> =>{
        let url_ = API_URL + "/Coupon/Post";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = newCoupon;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

        case 201: 
            return response?.json().then((responseJson: Coupon) => {
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
export const usePutCoupon = async (modifiedCoupon: Coupon): Promise<Coupon> =>{
        let url_ = API_URL + "/Coupon/Put";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = modifiedCoupon;
        let response = await httpCaller.PUT(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.PUT(url_, content_);
        }

        switch(response?.status){

        case 200: 
            return response?.json().then((responseJson: Coupon) => {
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