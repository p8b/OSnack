import { ErrorDto } from "../components/Texts/Alert";

export const API_URL: string = window.location.hostname === "localhost" ?
   "https://localhost:44358" : "https://shopapi.osnack.co.uk";

export const GetAllRecords: string = "***GET-ALL***";
export const ConstMaxNumberOfPerItemsPage = 10;
export const AntiforgeryTokenCookieName = "AF-TOKEN";

export enum AppAccess {
   Client = 0,
   Admin = 1,
};

export class CommonRegex {
   public static Email: string = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
   public static UkNumber: string = "^\\+?(?:\\d\\s?){10,12}$";
};

export class CommonErrors {
   public static PersistentErrorMsg: string = "(If the issue persists please contact the administrator on majid.joveini@gmail.com)";
   public static TryAgain: ErrorDto = {
      key: "TryAgain", value: `Please refresh the page and try again. ${CommonErrors.PersistentErrorMsg}`
   } as ErrorDto;
   public static BadServerResponse: ErrorDto = {
      key: "ServerError", value: `Bad Server Response. ${CommonErrors.PersistentErrorMsg}`
   } as ErrorDto;
   public static BadServerResponseCode: ErrorDto = {
      key: "ServerError", value: `Server Error Code: 000 ${CommonErrors.PersistentErrorMsg}`
   } as ErrorDto;
   public static BadServerConnection: ErrorDto = {
      key: "ConnectionError", value: `Cannot connect to server. ${CommonErrors.PersistentErrorMsg}`
   } as ErrorDto;
   public static AccessPermissionFailed: ErrorDto = {
      key: "PermissionError", value: "You do not have the correct permission to access the resource requested."
   } as ErrorDto;
}; 
