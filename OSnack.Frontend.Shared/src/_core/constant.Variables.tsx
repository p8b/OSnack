import { ErrorDto } from "../components/Texts/Alert";

export const API_URL: string = "https://localhost:44358";
//export const API_URL: string = "https://testapi.osnack.co.uk";
export const GetAllRecords: string = "***GET-ALL***";
export const ConstMaxNumberOfPerItemsPage = 10;
export const AntiforgeryTokenCookieName = "AF-TOKEN";

export enum ClientAppAccess {
    Official = 0,
    Secret = 1,
};

export class CommonRegex {
    public static Email: string = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
    public static UkNumber: string = "^\\+?(?:\\d\\s?){10,12}$";
};

export class CommonErrors {
    public static PersistentErrorMsg: string = "(If the issue persists please contact the administrator on majid.joveini@gmail.com)";
    public static TryAgain: ErrorDto = {
        Key: "TryAgain", Value: `Please refresh the page and try again. ${CommonErrors.PersistentErrorMsg}`
    } as ErrorDto;
    public static BadServerResponse: ErrorDto = {
        Key: "ServerError", Value: `Bad Server Response. ${CommonErrors.PersistentErrorMsg}`
    } as ErrorDto;
    public static BadServerResponseCode: ErrorDto = {
        Key: "ServerError", Value: `Server Error Code: 000 ${CommonErrors.PersistentErrorMsg}`
    } as ErrorDto;
    public static BadServerConnection: ErrorDto = {
        Key: "ConnectionError", Value: `Cannot connect to server. ${CommonErrors.PersistentErrorMsg}`
    } as ErrorDto;
    public static AccessPermissionFailed: ErrorDto = {
        Key: "PermissionError", Value: "You do not have the correct permission to access the resource requested."
    } as ErrorDto;
}; 
