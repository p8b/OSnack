import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { ProblemDetails, Order } from "../../_core/apiModels";
export const useGetOrder = async (selectedPage: number, maxNumberPerItemsPage: number, searchValue: string | null, filterStatus: string | null, isSortAsce: boolean, sortName: string | null): Promise<void> =>{
        let url_ = API_URL + "/Order/Get/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{filterStatus}/{isSortAsce}/{sortName}";
        if (selectedPage === undefined || selectedPage === null)
            throw new Error("The parameter 'selectedPage' must be defined.");
        url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
        if (maxNumberPerItemsPage === undefined || maxNumberPerItemsPage === null)
            throw new Error("The parameter 'maxNumberPerItemsPage' must be defined.");
        url_ = url_.replace("{maxNumberPerItemsPage}", encodeURIComponent("" + maxNumberPerItemsPage));
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
            return;

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const usePutOrder = async (modifiedOrder: Order): Promise<void> =>{
        let url_ = API_URL + "/Order/Put";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = modifiedOrder;
        const response = await httpCaller.PUT(url_, content_);

        switch(response?.status){

        case 200: 
            return;

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
export const usePutOrderStatusOrder = async (modifiedOrder: Order): Promise<void> =>{
        let url_ = API_URL + "/Order/PutOrderStatus";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = modifiedOrder;
        const response = await httpCaller.PUT(url_, content_);

        switch(response?.status){

        case 200: 
            return;

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
export const useDeleteOrder = async (order: Order): Promise<void> =>{
        let url_ = API_URL + "/Order/Delete";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = order;
        const response = await httpCaller.DELETE(url_, content_);

        switch(response?.status){

        case 200: 
            return;

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 404: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 412: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}