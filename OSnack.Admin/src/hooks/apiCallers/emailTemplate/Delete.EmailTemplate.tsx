import { AlertObj, AlertTypes, Error } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { EmailTemplate } from "../../../_core/apiModel-Admin";

export const useDeleteEmailTemplate = async (template: EmailTemplate) => {
    let alert = new AlertObj([], AlertTypes.Error);
    try {
        const response = await httpCaller.delete(`${API_URL}/EmailTemplate/Delete`, template);
        switch (response?.status) {
            case 200: // Ok Response
                //await response.json().then((data: string) => {
                //});
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
    return { alert };
};

