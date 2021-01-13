import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { OrderListAndAvailableTypesAndTotalCount, OrderListAndAvailableTypesAndFullNameAndTotalCount, Order } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseAllOrder={ data:OrderListAndAvailableTypesAndTotalCount , status?: number;};
export const useAllOrder = async (selectedPage: number, maxNumberPerItemsPage: number, searchValue: string | null, filterStatus: string | null, isSortAsce: boolean, sortName: string | null): Promise<IReturnUseAllOrder> =>{
        let url_ = API_URL + "/Order/Get/All/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{filterStatus}/{isSortAsce}/{sortName}";
        if (selectedPage !== null && selectedPage !== undefined)
        url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
        if (maxNumberPerItemsPage !== null && maxNumberPerItemsPage !== undefined)
        url_ = url_.replace("{maxNumberPerItemsPage}", encodeURIComponent("" + maxNumberPerItemsPage));
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
                        var responseData: OrderListAndAvailableTypesAndTotalCount = await response?.json();
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
export type IReturnUseAllUserOrder={ data:OrderListAndAvailableTypesAndFullNameAndTotalCount , status?: number;};
export const useAllUserOrder = async (userId: number, selectedPage: number, maxNumberPerItemsPage: number, searchValue: string | null | undefined, filterStatus: string | null, isSortAsce: boolean | undefined, sortName: string | null | undefined): Promise<IReturnUseAllUserOrder> =>{
        let url_ = API_URL + "/Order/Get/AllUser/{userId}/{selectedPage}/{maxNumberPerItemsPage}/{filterStatus}?";
        if (userId !== null && userId !== undefined)
        url_ = url_.replace("{userId}", encodeURIComponent("" + userId));
        if (selectedPage !== null && selectedPage !== undefined)
        url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
        if (maxNumberPerItemsPage !== null && maxNumberPerItemsPage !== undefined)
        url_ = url_.replace("{maxNumberPerItemsPage}", encodeURIComponent("" + maxNumberPerItemsPage));
        if (filterStatus !== null && filterStatus !== undefined)
        url_ = url_.replace("{filterStatus}", encodeURIComponent("" + filterStatus));
            url_ += "searchValue=" + encodeURIComponent("" + searchValue) + "&";
            url_ += "isSortAsce=" + encodeURIComponent("" + isSortAsce) + "&";
            url_ += "sortName=" + encodeURIComponent("" + sortName) + "&";
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: OrderListAndAvailableTypesAndFullNameAndTotalCount = await response?.json();
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
export type IReturnUsePutOrder={ data:Order , status?: number;};
export const usePutOrder = async (modifiedOrder: Order): Promise<IReturnUsePutOrder> =>{
        let url_ = API_URL + "/Order/Put";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = modifiedOrder;
        let response = await httpCaller.PUT(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.PUT(url_, content_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: Order = await response?.json();
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