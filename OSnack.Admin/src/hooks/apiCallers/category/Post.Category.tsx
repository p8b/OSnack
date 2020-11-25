import { AlertObj, AlertTypes, Error } from "osnack-frontend-shared/src/components/Texts/Alert";
import { Category } from "osnack-frontend-shared/src/_core/apiModels";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";


export const useCreateCategory = async (newCategory = new Category()) => {
    let alert = new AlertObj([], AlertTypes.Error);
    try {
        const response = await httpCaller.post(`${API_URL}/Category/Post`, newCategory);
        switch (response?.status) {
            case 201: // Created Response
                await response.json().then((data: Category) => {
                });
                break;
            case 422: //Unprocessable Entity
            case 417: //Expectation Failed
            case 412: //Precondition Failed
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