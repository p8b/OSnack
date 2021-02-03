import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/appConst";
import { OrderListAndAvailableTypesAndFullNameAndTotalCountAndDisputeFilterType } from "../../_core/apiModels";
export type IReturnUseAllOfficialOrder = { data: OrderListAndAvailableTypesAndFullNameAndTotalCountAndDisputeFilterType, status?: number; };
export const useAllOfficialOrder = (selectedPage: number, maxNumberPerItemsPage: number, searchValue: string | null | undefined, filterStatus: string | null, isSortAsce: boolean | undefined, sortName: string | null | undefined, disputeFilter: string | null): Promise<IReturnUseAllOfficialOrder> => {
   let url_ = API_URL + "/Order/Get/AllOfficial/{selectedPage}/{maxNumberPerItemsPage}/{filterStatus}/{disputeFilter}?";
   if (selectedPage !== null && selectedPage !== undefined)
      url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
   if (maxNumberPerItemsPage !== null && maxNumberPerItemsPage !== undefined)
      url_ = url_.replace("{maxNumberPerItemsPage}", encodeURIComponent("" + maxNumberPerItemsPage));
   if (filterStatus !== null && filterStatus !== undefined)
      url_ = url_.replace("{filterStatus}", encodeURIComponent("" + filterStatus));
   if (disputeFilter !== null && disputeFilter !== undefined)
      url_ = url_.replace("{disputeFilter}", encodeURIComponent("" + disputeFilter));
   url_ += "searchValue=" + encodeURIComponent("" + searchValue) + "&";
   url_ += "isSortAsce=" + encodeURIComponent("" + isSortAsce) + "&";
   url_ += "sortName=" + encodeURIComponent("" + sortName) + "&";
   url_ = url_.replace(/[?&]$/, "");
   return httpCaller.GET(url_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: OrderListAndAvailableTypesAndFullNameAndTotalCountAndDisputeFilterType) => {
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
};