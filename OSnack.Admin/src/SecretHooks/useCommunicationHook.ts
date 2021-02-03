import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/appConst";
import { CommunicationListAndTotalCount, Communication, Message } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseDeleteCommunication = { data: string, status?: number; };
export const useDeleteCommunication = (communicationId: string | null): Promise<IReturnUseDeleteCommunication> => {
   let url_ = API_URL + "/Communication/Delete/{communicationId}";
   if (communicationId !== null && communicationId !== undefined)
      url_ = url_.replace("{communicationId}", encodeURIComponent("" + communicationId));
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
export type IReturnUseSearchCommunication = { data: CommunicationListAndTotalCount, status?: number; };
export const useSearchCommunication = (selectedPage: number, maxNumberPerItemsPage: number, searchValue: string | null, filterStatus: string | null | undefined, isSortAsce: boolean, sortName: string | null): Promise<IReturnUseSearchCommunication> => {
   let url_ = API_URL + "/Communication/Get/Search/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{isSortAsce}/{sortName}?";
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
   url_ += "filterStatus=" + encodeURIComponent("" + filterStatus) + "&";
   url_ = url_.replace(/[?&]$/, "");
   return httpCaller.GET(url_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: CommunicationListAndTotalCount) => {
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
export type IReturnUseGetDisputeSecretCommunication = { data: Communication, status?: number; };
export const useGetDisputeSecretCommunication = (disputeKey: string | null): Promise<IReturnUseGetDisputeSecretCommunication> => {
   let url_ = API_URL + "/Communication/Get/GetDisputeSecret/{disputeKey}";
   if (disputeKey !== null && disputeKey !== undefined)
      url_ = url_.replace("{disputeKey}", encodeURIComponent("" + disputeKey));
   url_ = url_.replace(/[?&]$/, "");
   return httpCaller.GET(url_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: Communication) => {
               return { data: data, status: response?.status };
            });

         case 417:
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
export type IReturnUsePutSecretCommunication = { data: Communication, status?: number; };
export const usePutSecretCommunication = (message: Message, communicationId: string | null, status: boolean): Promise<IReturnUsePutSecretCommunication> => {
   let url_ = API_URL + "/Communication/Put/PutSecret/{communicationId}/{status}";
   if (communicationId !== null && communicationId !== undefined)
      url_ = url_.replace("{communicationId}", encodeURIComponent("" + communicationId));
   if (status !== null && status !== undefined)
      url_ = url_.replace("{status}", encodeURIComponent("" + status));
   url_ = url_.replace(/[?&]$/, "");
   const content_ = message;
   return httpCaller.PUT(url_, content_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: Communication) => {
               return { data: data, status: response?.status };
            });

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
   });
};