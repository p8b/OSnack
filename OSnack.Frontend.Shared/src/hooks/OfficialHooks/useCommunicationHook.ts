import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/appConst";
import { Communication, Message } from "../../_core/apiModels";
export type IReturnUseGetDisputeCommunication = { data: Communication, status?: number; };
export const useGetDisputeCommunication = (disputeKey: string | null): Promise<IReturnUseGetDisputeCommunication> => {
   let url_ = API_URL + "/Communication/Get/GetDispute/{disputeKey}";
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
export type IReturnUsePostDisputeCommunication = { data: Communication, status?: number; };
export const usePostDisputeCommunication = (newDispute: Communication): Promise<IReturnUsePostDisputeCommunication> => {
   let url_ = API_URL + "/Communication/Post/PostDispute";
   url_ = url_.replace(/[?&]$/, "");
   const content_ = newDispute;
   return httpCaller.POST(url_, content_).then(response => {

      switch (response?.status) {

         case 201:
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
export type IReturnUsePutOfficialCommunication = { data: Communication, status?: number; };
export const usePutOfficialCommunication = (message: Message, communicationId: string | null): Promise<IReturnUsePutOfficialCommunication> => {
   let url_ = API_URL + "/Communication/Put/PutOfficial/{communicationId}";
   if (communicationId !== null && communicationId !== undefined)
      url_ = url_.replace("{communicationId}", encodeURIComponent("" + communicationId));
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