import { AlertObj, AlertTypes, Error } from "../../../components/Texts/Alert";
import { User } from "../../../_core/apiModels";
import { httpCaller } from "../../../_core/appFunc";
import { API_URL, CommonErrors } from "../../../_core/constant.Variables";

export const useEditCurrentUser = async (user: User, currentPassword: string) => {
   let alert = new AlertObj([], AlertTypes.Error);
   let resetCurrentPasswordValue = false;
   try {
      const params: { user: User, currentPassword: string; } = { user, currentPassword };
      const response = await httpCaller.put(`${API_URL}/User/put/UpdateCurrentUser`, params);
      switch (response?.status) {
         case 200: // Ok Response
            await response.json().then((data: User) => {
            });
            break;
         case 412: //Precondition Failed
            resetCurrentPasswordValue = true;
         case 422: //Unprocessable Entity
         case 417: //Expectation Failed)
            await response.json().then((data: Error[]) => {
               alert.List = data;
            });
            break;
         default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
      if (response == null)
         alert.List.push(CommonErrors.BadServerConnection);
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }
   return { alert, resetCurrentPasswordValue};
};

export const useEditCurrentUserPassword = async (user: User, currentPassword: string) => {
   let alert = new AlertObj([], AlertTypes.Error);
   let resetCurrentPasswordValue = false;
   try {
      const params: { user: User, currentPassword: string; } = { user, currentPassword };
      const response = await httpCaller.put(`${API_URL}/User/put/UpdateCurrentUserPassword`, params);
      switch (response?.status) {
         case 200: // Ok Response
            await response.json().then((data: User) => {
            });
            break;
         case 412: //Precondition Failed
            resetCurrentPasswordValue = true;
         case 422: //Unprocessable Entity
         case 417: //Expectation Failed
            await response.json().then((data: Error[]) => {
               alert.List = data;
            });
            break;
         default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
      if (response == null)
         alert.List.push(CommonErrors.BadServerConnection);
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }
   return { alert, resetCurrentPasswordValue };
};

export const useConfirmEmailWithToken = async (pathName: string) => {
   let isSuccess = false;
   let alert = new AlertObj([], AlertTypes.Error);
   try {
      const response = await httpCaller.put(`${API_URL}/User/Put/ConfirmEmail`, pathName);
      switch (response!.status) {
         case 200: // Ok Response
            //await response?.json().then(data => {
            //});
            isSuccess = true;
            break;
         case 412: //Precondition Failed
         case 417: //Expectation Failed)
            await response?.json().then((data: Error[]) => {
               alert.List = data;
            });
            break;
         default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
      if (response == null)
         alert.List.push(CommonErrors.BadServerConnection);
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }
   return { isSuccess, alert };
};

export const useResetPasswordWithToken = async (pathName: string, email: string, password: string, justCheckToken: boolean = false) => {
   let alert = new AlertObj([], AlertTypes.Error);
   try {
      const response = await httpCaller.put(`${API_URL}/User/Put/UpdatePasswordWithToken`, { pathName, email, password, justCheckToken });
      switch (response?.status) {
         case 200: // Ok Response
            break;
         case 412: //Precondition Failed
         case 417: //Expectation Failed)
            await response.json().then((data: Error[]) => {
               alert.List = data;
            });
            break;
         default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
      if (response == null)
         alert.List.push(CommonErrors.BadServerConnection);
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }

   return { alert };
};
