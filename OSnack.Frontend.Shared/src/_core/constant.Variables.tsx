import { Error } from "../components/Texts/Alert";

export const API_URL: string = "https://localhost:44358";
//export const API_URL: string = "https://localhost:44358";
//export const API_URL: string = "https://testapi.osnack.co.uk";
export const GetAllRecords: string = "***GET-ALL***";
export const ConstMaxNumberOfPerItemsPage = 10;
export const AntiforgeryTokenCookieName = "AF-TOKEN";

export enum RegistrationTypes {
    Application = 0,
    Google = 1,
    Facebook = 2,
};

export enum ProductUnitType {
    Kg = 0,
    grams = 1,
    Per_Item = 2
};

export class CommonRegex {
    public static Email: string = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
    public static UkNumber: string = "^\\+?(?:\\d\\s?){10,12}$";
};

export class CommonErrors {
    public static PersistentErrorMsg: string = "(If the issue persists please contact the administrator on majid.joveini@gmail.com)";
    public static TryAgain: Error = new Error("TryAgain", `Please refresh the page and try again. ${CommonErrors.PersistentErrorMsg}`);
    public static BadServerResponse: Error = new Error("ServerError", `Bad Server Response. ${CommonErrors.PersistentErrorMsg}`);
    public static BadServerResponseCode: Error = new Error("ServerError", `Server Error Code: 000 ${CommonErrors.PersistentErrorMsg}`);
    public static BadServerConnection: Error = new Error("ConnectionError", `Cannot connect to server. ${CommonErrors.PersistentErrorMsg}`);
    public static AccessPermissionFailed: Error = new Error("PermissionError", "You do not have the correct permission to access the resource requested.");
}; 