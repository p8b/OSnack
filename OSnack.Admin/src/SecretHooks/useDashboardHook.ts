import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { NewOrderCountAndOpenDisputeCountAndOpenMessageCount, SalePeriod, LableListAndPriceListAndCountList } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseOrderDisputeMessageCountDashboard={ data:NewOrderCountAndOpenDisputeCountAndOpenMessageCount , status?: number;};
export const useOrderDisputeMessageCountDashboard = async (): Promise<IReturnUseOrderDisputeMessageCountDashboard> =>{
        let url_ = API_URL + "/Dashboard/Get/OrderDisputeMessageCount";
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: NewOrderCountAndOpenDisputeCountAndOpenMessageCount = await response?.json();
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
export type IReturnUseSaleStateDashboard={ data:LableListAndPriceListAndCountList , status?: number;};
export const useSaleStateDashboard = async (salePeriod: SalePeriod | undefined): Promise<IReturnUseSaleStateDashboard> =>{
        let url_ = API_URL + "/Dashboard/Get/SaleState?";
            url_ += "salePeriod=" + encodeURIComponent("" + salePeriod) + "&";
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: LableListAndPriceListAndCountList = await response?.json();
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