import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { NewOrderCountAndOpenDisputeCountAndOpenMessageCountAndTotalSales, SalesPeriod, LableListAndPriceListAndCountList } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseSummaryDashboard={ data:NewOrderCountAndOpenDisputeCountAndOpenMessageCountAndTotalSales , status?: number;};
export const useSummaryDashboard = (): Promise<IReturnUseSummaryDashboard> =>{
    let url_ = API_URL + "/Dashboard/Get/Summary";
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:NewOrderCountAndOpenDisputeCountAndOpenMessageCountAndTotalSales) => {
                    return { data: data, status: response?.status };
                });

            case 417: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            default:
                CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
    });
}
export type IReturnUseSalesStatisticsDashboard={ data:LableListAndPriceListAndCountList , status?: number;};
export const useSalesStatisticsDashboard = (salePeriod: SalesPeriod | undefined): Promise<IReturnUseSalesStatisticsDashboard> =>{
    let url_ = API_URL + "/Dashboard/Get/SalesStatistics?";
        url_ += "salePeriod=" + encodeURIComponent("" + salePeriod) + "&";
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:LableListAndPriceListAndCountList) => {
                    return { data: data, status: response?.status };
                });

            case 417: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
                });

            default:
                CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
    });
}