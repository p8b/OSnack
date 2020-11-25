import { AlertObj, AlertTypes, Error } from "osnack-frontend-shared/src/components/Texts/Alert";
import { Product } from "osnack-frontend-shared/src/_core/apiModels";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";

export const useGetProduct = async (categoryName: string, productName: string) => {
   let alert = new AlertObj([], AlertTypes.Error);
   let product = new Product();
   let relatedProducts: Product[] = [];
   try {
      const response = await httpCaller.get(`${API_URL}/Product/Get/${categoryName}/${productName}`);
      switch (response?.status) {
         case 200: // OK
            await response.json().then((data: { product: Product, relatedProducts: Product[]; }) => {
               product = data.product;
               relatedProducts = data.relatedProducts;
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
   return { alert, product, relatedProducts };
};