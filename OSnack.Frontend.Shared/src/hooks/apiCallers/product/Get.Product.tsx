import { AlertObj, AlertTypes, Error } from "../../../components/Texts/Alert";
import { Product } from "../../../_core/apiModels";
import { httpCaller } from "../../../_core/appFunc";
import { API_URL, CommonErrors, ConstMaxNumberOfPerItemsPage } from "../../../_core/constant.Variables";


export const useSearchProduct = async (
   selectedPage = 1,
   maxNumberPerItemsPage = ConstMaxNumberOfPerItemsPage,
   filterCategoryId = "",
   searchValue = "",
   filterStatus = "",
   isSortAsce = true,
   sortName = "") => {
   let alert = new AlertObj([], AlertTypes.Error);
   let productList: Product[] = [];
   let totalCount = 0;
   try {
      const response = await httpCaller.get(`${API_URL}/Product/Get/${selectedPage}/${maxNumberPerItemsPage}/${filterCategoryId}/${searchValue}/${filterStatus}/${isSortAsce}/${sortName}`);
      switch (response?.status) {
         case 200: // OK
            await response.json().then((data: { list: Product[]; totalCount: number; }) => {
               productList = data.list;
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
   return { alert, productList, totalCount };
};