import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/appConst";
import { OrderListAndAvailableTypesAndTotalCountAndDisputeFilterType, OrderListAndAvailableTypesAndFullNameAndTotalCountAndDisputeFilterType, Order } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseAllOrder = { data: OrderListAndAvailableTypesAndTotalCountAndDisputeFilterType, status?: number; };
export const useAllOrder = (selectedPage: number, maxNumberPerItemsPage: number, searchValue: string | null, filterStatus: string | null, isSortAsce: boolean, sortName: string | null, disputeFilter: string | null): Promise<IReturnUseAllOrder> => {
   let url_ = API_URL + "/Order/Get/All/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{filterStatus}/{isSortAsce}/{sortName}/{disputeFilter}";
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
   if (disputeFilter !== null && disputeFilter !== undefined)
      url_ = url_.replace("{disputeFilter}", encodeURIComponent("" + disputeFilter));
   url_ = url_.replace(/[?&]$/, "");
   return httpCaller.GET(url_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: OrderListAndAvailableTypesAndTotalCountAndDisputeFilterType) => {
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
export type IReturnUseAllUserOrder = { data: OrderListAndAvailableTypesAndFullNameAndTotalCountAndDisputeFilterType, status?: number; };
export const useAllUserOrder = (userId: number, selectedPage: number, maxNumberPerItemsPage: number, searchValue: string | null | undefined, filterStatus: string | null, isSortAsce: boolean | undefined, sortName: string | null | undefined, disputeFilter: string | null): Promise<IReturnUseAllUserOrder> => {
   let url_ = API_URL + "/Order/Get/AllUser/{userId}/{selectedPage}/{maxNumberPerItemsPage}/{filterStatus}/{disputeFilter}?";
   if (userId !== null && userId !== undefined)
      url_ = url_.replace("{userId}", encodeURIComponent("" + userId));
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
export type IReturnUsePutOrder = { data: Order, status?: number; };
export const usePutOrder = (modifiedOrder: Order): Promise<IReturnUsePutOrder> => {
   let url_ = API_URL + "/Order/Put";
   url_ = url_.replace(/[?&]$/, "");
   const content_ = modifiedOrder;
   return httpCaller.PUT(url_, content_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: Order) => {
               return { data: data, status: response?.status };
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
            CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
      }
   });
};