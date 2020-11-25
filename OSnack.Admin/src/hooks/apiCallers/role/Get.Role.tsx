import { AlertObj, AlertTypes, Error } from "osnack-frontend-shared/src/components/Texts/Alert";
import { Role } from "osnack-frontend-shared/src/_core/apiModels";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";


export const useGetAllRoles = async () => {
   let alert = new AlertObj([], AlertTypes.Error);
   let roleList: Role[] = [];
   try {
      const response = await httpCaller.get(`${API_URL}/Role/Get`);
      switch (response?.status) {
         case 200: // OK
            await response.json().then((data: Role[]) => {
               roleList = data;
            });
            break;
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
   return { alert, roleList };
};