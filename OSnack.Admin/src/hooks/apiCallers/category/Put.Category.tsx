import { AlertObj, AlertTypes, Error } from "osnack-frontend-shared/src/components/Texts/Alert";
import { Category } from "osnack-frontend-shared/src/_core/apiModels";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";


export const useModifyCategory = async (category = new Category()) => {
    let alert = new AlertObj([], AlertTypes.Error);
    try {
        const response = await httpCaller.put(`${API_URL}/Category/Put`, category);
        switch (response?.status) {
            case 200: // Ok
                await response.json().then((data: Category) => {
                });
                break;
            case 404: //Not Found
            case 412: //Precondition Failed
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
    return { alert };
};