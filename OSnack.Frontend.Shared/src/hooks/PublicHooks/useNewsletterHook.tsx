import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { Newsletter } from "../../_core/apiModels";
export const usePostNewsletter = async (newsletter: Newsletter): Promise<void> => {
   let url_ = API_URL + "/Newsletter/Post";
   url_ = url_.replace(/[?&]$/, "");

   const content_ = newsletter;
   const response = await httpCaller.POST(url_, content_);

   switch (response?.status) {

      case 201:
         return;

      case 422:
         return response.json().then((data: ErrorDto[]) => {
            throw new AlertObj(data, AlertTypes.Error, response.status);
         });

      case 417:
         return response.json().then((data: ErrorDto[]) => {
            throw new AlertObj(data, AlertTypes.Error, response.status);
         });

      default:
         CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
         throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
   }
};
export const useDeleteNewsletter = async (email: string | null): Promise<void> => {
   let url_ = API_URL + "/Newsletter/Delete/{email}";
   if (email === undefined || email === null)
      throw new Error("The parameter 'email' must be defined.");
   url_ = url_.replace("{email}", encodeURIComponent("" + email));
   url_ = url_.replace(/[?&]$/, "");

   const response = await httpCaller.DELETE(url_);

   switch (response?.status) {

      case 200:
         return;

      case 417:
         return response.json().then((data: ErrorDto[]) => {
            throw new AlertObj(data, AlertTypes.Error, response.status);
         });

      case 404:
         return response.json().then((data: ErrorDto[]) => {
            throw new AlertObj(data, AlertTypes.Error, response.status);
         });

      default:
         CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
         throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
   }
};
