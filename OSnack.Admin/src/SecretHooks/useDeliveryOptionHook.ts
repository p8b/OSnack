import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { DeliveryOptionListAndTotalCount, DeliveryOption } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseDeleteDeliveryOption={ data:string , status?: number;};
export const useDeleteDeliveryOption = async (deliveyOptionId: number): Promise<IReturnUseDeleteDeliveryOption> =>{
        let url_ = API_URL + "/DeliveryOption/Delete/{deliveyOptionId}";
        if (deliveyOptionId !== null && deliveyOptionId !== undefined)
        url_ = url_.replace("{deliveyOptionId}", encodeURIComponent("" + deliveyOptionId));
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
                        CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                        throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
  
}
export type IReturnUseSearchDeliveryOption={ data:DeliveryOptionListAndTotalCount , status?: number;};
export const useSearchDeliveryOption = async (selectedPage: number, maxNumberPerItemsPage: number, searchValue: string | null, isSortAsce: boolean, sortName: string | null): Promise<IReturnUseSearchDeliveryOption> =>{
        let url_ = API_URL + "/DeliveryOption/Get/Search/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{isSortAsce}/{sortName}";
        if (selectedPage !== null && selectedPage !== undefined)
        url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
        if (maxNumberPerItemsPage !== null && maxNumberPerItemsPage !== undefined)
        url_ = url_.replace("{maxNumberPerItemsPage}", encodeURIComponent("" + maxNumberPerItemsPage));
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
                        var responseData: DeliveryOptionListAndTotalCount = await response?.json();
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
export type IReturnUsePostDeliveryOption={ data:DeliveryOption , status?: number;};
export const usePostDeliveryOption = async (newDeliveryOption: DeliveryOption): Promise<IReturnUsePostDeliveryOption> =>{
        let url_ = API_URL + "/DeliveryOption/Post";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = newDeliveryOption;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

                case 201: 
                        var responseData: DeliveryOption = await response?.json();
                        return { data: responseData, status: response?.status };

                case 422: 
                        return response?.json().then((data: ErrorDto[]) => {
                                throw new AlertObj(data, AlertTypes.Error, response?.status);
                        });

                case 412: 
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
export type IReturnUsePutDeliveryOption={ data:DeliveryOption , status?: number;};
export const usePutDeliveryOption = async (modifiedDeliveryOption: DeliveryOption): Promise<IReturnUsePutDeliveryOption> =>{
        let url_ = API_URL + "/DeliveryOption/Put";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = modifiedDeliveryOption;
        let response = await httpCaller.PUT(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.PUT(url_, content_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: DeliveryOption = await response?.json();
                        return { data: responseData, status: response?.status };

                case 404: 
                        return response?.json().then((data: ErrorDto[]) => {
                                throw new AlertObj(data, AlertTypes.Error, response?.status);
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
  
}