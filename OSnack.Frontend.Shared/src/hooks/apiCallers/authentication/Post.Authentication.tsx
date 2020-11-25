import { ExternalLoginInfo, LoginInfo, User } from "../../../_core/apiModels";
import { API_URL, CommonErrors } from "../../../_core/constant.Variables";
import { httpCaller } from "../../../_core/appFunc";
import { AlertObj, AlertTypes, Error } from "../../../components/Texts/Alert";
import { useLogout } from "./Get.Authentication";

export const useConfirmCurrentUserPassword = async (password: string) => {
   let user = new User();
   let alert = new AlertObj([], AlertTypes.Error);
   try {
      const response = await httpCaller.post(`${API_URL}/authentication/post/ConfirmCurrentUserPassword`, password);
      switch (response?.status) {
         case 200: // Ok
            await response.json().then((data: User) => {
               user = data;
            });
            break;
         case 401: //Unauthorized
         case 403:
         case 417: //ExpectationFailed
            await response.json().then((data: Error[]) => {
               alert.List = data;
            });
            break;
         case 400: // Bad Request
            alert.Type = AlertTypes.Warning;
            alert.List.push(CommonErrors.TryAgain);
            break;
         default:
            if (response == null) {
               alert.List.push(CommonErrors.BadServerConnection);
               break;
            }
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }
   return { alert, user };
};

export const useExternalLogin = async (externalLoginInfo = new ExternalLoginInfo(), access: string) => {
   let user = new User();
   let isAuthenticated = false;
   let alert = new AlertObj([], AlertTypes.Error);
   try {
      const response = await httpCaller.post(`${API_URL}/Authentication/Post/ExternalLogin${access}`, externalLoginInfo);
      switch (response?.status) {
         case 200: // Ok
            await response.json().then((data: User) => {
               user = data;
               isAuthenticated = true;
            });
            break;
         case 206: // Partial Content
            await response.json().then((data: User) => {
               user = data;
            });
            break;
         case 400: // Bad Request 
            alert.Type = AlertTypes.Warning;
            alert.List.push(CommonErrors.TryAgain);
            break;
         case 401: //Unauthorized
            await useLogout();
         case 403: // forbidden request other login methods available
            alert.Type = AlertTypes.Warning;
         case 417: //Expectation Failed
            await response.json().then((data: Error[]) => {
               alert.List = data;
            });
            break;
         default:
            if (response == null) {
               alert.List.push(CommonErrors.BadServerConnection);
               break;
            }
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }
   return { alert, user, isAuthenticated };
};

export const useLogin = async (userInfo: LoginInfo, access: string) => {
   let user = new User();
   let isAuthenticated = false;
   let alert = new AlertObj([], AlertTypes.Error);
   try {
      const response = await httpCaller.post(`${API_URL}/authentication/Post/Login${access}`, userInfo);
      switch (response?.status) {
         case 200: // Ok
            await response.json().then((data: User) => {
               user = data;
               isAuthenticated = true;
            });
            break;
         case 401: //Unauthorized
            await useLogout();
         case 403: // forbidden request
            alert.Type = AlertTypes.Warning;
         case 417: //ExpectationFailed
            await response.json().then((data: Error[]) => {
               alert.List = data;
            });
            break;
         case 400: // Bad Request
            alert.Type = AlertTypes.Warning;
            alert.List.push(CommonErrors.TryAgain);
            break;
         default:
            if (response == null) {
               alert.List.push(CommonErrors.BadServerConnection);
               break;
            }
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }
   return { alert, user, isAuthenticated };
};
