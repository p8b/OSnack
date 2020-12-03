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
   public static TryAgain: ErrorDto = new ErrorDto("TryAgain", `Please refresh the page and try again. ${CommonErrors.PersistentErrorMsg}`);
   public static BadServerResponse: ErrorDto = new ErrorDto("ServerError", `Bad Server Response. ${CommonErrors.PersistentErrorMsg}`);
   public static BadServerResponseCode: ErrorDto = new ErrorDto("ServerError", `Server Error Code: 000 ${CommonErrors.PersistentErrorMsg}`);
   public static BadServerConnection: ErrorDto = new ErrorDto("ConnectionError", `Cannot connect to server. ${CommonErrors.PersistentErrorMsg}`);
   public static AccessPermissionFailed: ErrorDto = new ErrorDto("PermissionError", "You do not have the correct permission to access the resource requested.");
}; 