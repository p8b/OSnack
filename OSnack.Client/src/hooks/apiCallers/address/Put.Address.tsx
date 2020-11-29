import { AlertObj, AlertTypes, Error } from "osnack-frontend-shared/src/components/Texts/Alert";
import { Address } from "osnack-frontend-shared/src/_core/apiModels";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";

export const useModifyAddress = async (address: Address) => {
   let alert = new AlertObj([], AlertTypes.Error);
   try {
      const response = await httpCaller.put(`${API_URL}/Address/Put`, address);
      switch (response?.status) {
         case 200: // Ok Response
            await response.json().then((data: Address) => {
               address = data;
            });
            break;
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
   return { alert, address };
};

export const useModifyDefaultAddress = async (addressId: number) => {
   let alert = new AlertObj([], AlertTypes.Error);
   try {
      const response = await httpCaller.put(`${API_URL}/Address/Put/SetDefault`, addressId);
      switch (response?.status) {
         case 200: // Ok Response
            break;
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
   return { alert, addressId };
};

