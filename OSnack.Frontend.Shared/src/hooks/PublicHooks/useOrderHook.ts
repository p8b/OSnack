import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/appConst";
import { Order, Order2 } from "../../_core/apiModels";
export type IReturnUsePostOrder = { data: Order, status?: number; };
export const usePostOrder = (paypalId: string | null, orderData: Order): Promise<IReturnUsePostOrder> => {
   let url_ = API_URL + "/Order/Post/{paypalId}";
   if (paypalId !== null && paypalId !== undefined)
      url_ = url_.replace("{paypalId}", encodeURIComponent("" + paypalId));
   url_ = url_.replace(/[?&]$/, "");
   const content_ = orderData;
   return httpCaller.POST(url_, content_).then(response => {

      switch (response?.status) {

         case 201:
            return response?.json().then((data: Order) => {
               return { data: data, status: response?.status };
            });

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
   });
};
export type IReturnUseVerifyOrder = { data: Order2, status?: number; };
export const useVerifyOrder = (newOrder: Order): Promise<IReturnUseVerifyOrder> => {
   let url_ = API_URL + "/Order/Post/Verify";
   url_ = url_.replace(/[?&]$/, "");
   const content_ = newOrder;
   return httpCaller.POST(url_, content_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: Order2) => {
               return { data: data, status: response?.status };
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