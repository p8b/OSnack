import { API_URL, CommonErrors } from "../../../_core/constant.Variables";
import { httpCaller } from "../../../_core/appFunc";
import { User } from "../../../_core/apiModels";
import { AlertObj, AlertTypes, Error } from "../../../components/Texts/Alert";

export const useIsPasswordResetTokenValid = async (token: string) => {
    let result = {
        isSuccess: false,
        alert: new AlertObj([], AlertTypes.Error)
    };
    try {
        const response = await httpCaller.post(`${API_URL}/User/Post/IsPasswordResetTokenValid`, { token });
        switch (response?.status) {
            case 200: // Ok Response
                await response.json().then((data: User) => {
                });
                //dispatch({
                //   type: "TOKEN_AUTHENTICATION",
                //   payload: {
                //      isAuthenticated: false,
                //      user: new User(),
                //   }
                //});
                result.isSuccess = true;
                break;
            case 412: //Precondition Failed
            case 417: //Expectation Failed)
                await response.json().then((data: Error[]) => {
                    result.alert.List = data;
                });
                break;
            default:
                CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
                result.alert.List.push(CommonErrors.BadServerResponseCode);
                break;
        };
        if (response == null)
            result.alert.List.push(CommonErrors.BadServerConnection);
    } catch (e) {
        result.alert.List.push(CommonErrors.BadServerResponse);
    }

    return result;
};

export const useRequestPasswordResetToken = async (email: string) => {
    let result = {
        alert: new AlertObj([], AlertTypes.Error),
        isTokenSent: false
   };
   console.log(email);
    try {
       const response = await httpCaller.post(`${API_URL}/User/Post/RequestPasswordReset`, email);
        switch (response?.status) {
            case 201: // Created Response
                result.isTokenSent = true;
                break;
            case 412: //Precondition Failed
            case 417: //Expectation Failed)
                await response.json().then((data: Error[]) => {
                    result.alert.List = data;
                });
                break;
            default:
                CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
                result.alert.List.push(CommonErrors.BadServerResponseCode);
                break;
        };
        if (response == null)
            result.alert.List.push(CommonErrors.BadServerConnection);
    } catch (e) {
        result.alert.List.push(CommonErrors.BadServerResponse);
    }

    return result;
};
