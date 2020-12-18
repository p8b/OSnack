import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { OrderListAndTotalNumber, Order, Order2 } from "../../_core/apiModels";
export const useAllOrder = async (selectedPage: number, maxNumberPerItemsPage: number, filterStatus: string | null): Promise<{ data:OrderListAndTotalNumber , status?: number}> =>{
        let url_ = API_URL + "/Order/Get/All/{selectedPage}/{maxNumberPerItemsPage}/{filterStatus}";
        if (selectedPage !== null && selectedPage !== undefined)
        url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
        if (maxNumberPerItemsPage !== null && maxNumberPerItemsPage !== undefined)
        url_ = url_.replace("{maxNumberPerItemsPage}", encodeURIComponent("" + maxNumberPerItemsPage));
        if (filterStatus !== null && filterStatus !== undefined)
        url_ = url_.replace("{filterStatus}", encodeURIComponent("" + filterStatus));
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: OrderListAndTotalNumber = await response?.json();
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
export const useGetOrder = async (orderId: number): Promise<{ data:Order , status?: number}> =>{
        let url_ = API_URL + "/Order/Get/{orderId}";
        if (orderId !== null && orderId !== undefined)
        url_ = url_.replace("{orderId}", encodeURIComponent("" + orderId));
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: Order = await response?.json();
                        return { data: responseData, status: response?.status };

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
export const useVerifyOrderOrder = async (newOrder: Order): Promise<{ data:Order2 , status?: number}> =>{
        let url_ = API_URL + "/Order/VerifyOrder";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = newOrder;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: Order2 = await response?.json();
                        return { data: responseData, status: response?.status };

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
export const usePostOrder = async (paypalId: string | null, orderData: Order): Promise<{ data:Order , status?: number}> =>{
        let url_ = API_URL + "/Order/Post/{paypalId}";
        if (paypalId !== null && paypalId !== undefined)
        url_ = url_.replace("{paypalId}", encodeURIComponent("" + paypalId));
        url_ = url_.replace(/[?&]$/, "");
        const content_ = orderData;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

                case 201: 
                        var responseData: Order = await response?.json();
                        return { data: responseData, status: response?.status };

                case 417: 
                        return response?.json().then((data: ErrorDto[]) => {
                                throw new AlertObj(data, AlertTypes.Error, response?.status);
                        });

                case 422: 
                        return response?.json().then((data: ErrorDto[]) => {
                                throw new AlertObj(data, AlertTypes.Error, response?.status);
                        });

                case 503: 
                        return response?.json().then((data: ErrorDto[]) => {
                                throw new AlertObj(data, AlertTypes.Error, response?.status);
                        });

                default:
                        CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                        throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
  
}