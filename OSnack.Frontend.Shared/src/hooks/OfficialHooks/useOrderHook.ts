import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { OrderListAndAvailableTypesAndFullNameAndTotalCount } from "../../_core/apiModels";
export type IReturnUseAllOfficialOrder={ data:OrderListAndAvailableTypesAndFullNameAndTotalCount , status?: number;};
export const useAllOfficialOrder = async (selectedPage: number, maxNumberPerItemsPage: number, searchValue: string | null | undefined, filterStatus: string | null, isSortAsce: boolean | undefined, sortName: string | null | undefined): Promise<IReturnUseAllOfficialOrder> =>{
        let url_ = API_URL + "/Order/Get/AllOfficial/{selectedPage}/{maxNumberPerItemsPage}/{filterStatus}?";
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