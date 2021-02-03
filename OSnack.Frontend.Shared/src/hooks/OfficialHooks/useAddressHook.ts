import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/appConst";
import { Address } from "../../_core/apiModels";
export type IReturnUseDeleteAddress = { data: string, status?: number; };
export const useDeleteAddress = (addressId: number): Promise<IReturnUseDeleteAddress> => {
   let url_ = API_URL + "/Address/Delete/{addressId}";
   if (addressId !== null && addressId !== undefined)
      url_ = url_.replace("{addressId}", encodeURIComponent("" + addressId));
   url_ = url_.replace(/[?&]$/, "");
   return httpCaller.DELETE(url_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: string) => {
               return { data: data, status: response?.status };
            });

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
   });
};
export type IReturnUseAllAddress = { data: Address[], status?: number; };
export const useAllAddress = (): Promise<IReturnUseAllAddress> => {
   let url_ = API_URL + "/Address/Get/All";
   url_ = url_.replace(/[?&]$/, "");
   return httpCaller.GET(url_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: Address[]) => {
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
export type IReturnUsePostAddress = { data: Address, status?: number; };
export const usePostAddress = (newAddress: Address): Promise<IReturnUsePostAddress> => {
   let url_ = API_URL + "/Address/Post";
   url_ = url_.replace(/[?&]$/, "");
   const content_ = newAddress;
   return httpCaller.POST(url_, content_).then(response => {

      switch (response?.status) {

         case 201:
            return response?.json().then((data: Address) => {
               return { data: data, status: response?.status };
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
   });
};
export type IReturnUsePutAddress = { data: Address, status?: number; };
export const usePutAddress = (modifiedAddress: Address): Promise<IReturnUsePutAddress> => {
   let url_ = API_URL + "/Address/Put";
   url_ = url_.replace(/[?&]$/, "");
   const content_ = modifiedAddress;
   return httpCaller.PUT(url_, content_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: Address) => {
               return { data: data, status: response?.status };
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
   });
};
export type IReturnUseSetDefaultAddress = { data: null, status?: number; };
export const useSetDefaultAddress = (addressId: number): Promise<IReturnUseSetDefaultAddress> => {
   let url_ = API_URL + "/Address/Put/SetDefault";
   url_ = url_.replace(/[?&]$/, "");
   const content_ = addressId;
   return httpCaller.PUT(url_, content_).then(response => {

      switch (response?.status) {

         case 204:
            return { data: null, status: 204 };

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