import { AlertObj, AlertTypes, Error } from "osnack-frontend-shared/src/components/Texts/Alert";
import { User } from "osnack-frontend-shared/src/_core/apiModels";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors, ConstMaxNumberOfPerItemsPage } from "osnack-frontend-shared/src/_core/constant.Variables";


export const useSearchUser = async (
   selectedPage = 1,
   maxNumberPerItemsPage = ConstMaxNumberOfPerItemsPage,
   searchValue = "",
   filterRole = "",
   isSortAsce = true,
   sortName = "") => {
   let alert = new AlertObj([], AlertTypes.Error);
   let userList: User[] = [];
   let totalCount = 0;
   try {
      const response = await httpCaller.get(`${API_URL}/User/Get/${selectedPage}/${maxNumberPerItemsPage}/${searchValue}/${filterRole}/${isSortAsce}/${sortName}`);
      switch (response?.status) {
         case 200: // OK
            await response.json().then((data: { list: User[]; totalCount: number; }) => {
               userList = data.list;
               totalCount = data.totalCount;
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
   return { alert, userList, totalCount };
};