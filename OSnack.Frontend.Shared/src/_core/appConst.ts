import { ErrorDto } from "../components/Texts/Alert";

const hostname = window.location.hostname.toLowerCase();

export const API_URL =
   hostname === "localhost" ? "https://localhost:44358" :  // Dev Api
      hostname.endsWith("osnack.p8b.uk") ? "https://api.osnack.p8b.uk" : // P8B Demo Production
         hostname.endsWith("osnack.co.uk") ? "https://api.osnack.co.uk" : ""; // OSnack Production else "" 

export const GooglereCAPTCHAKey =
   hostname === "localhost" ? "6LeYK0gaAAAAAEFPv11v-Kpphrm-kW_Ff0KwUEMC" :  // Dev
      hostname.endsWith("osnack.p8b.uk") ? "6LcVL0gaAAAAAIKgko6e86v276-Su8x0YYQrHk7o" : // P8B Demo Production
         hostname.endsWith("osnack.co.uk") ? "6LeYL0gaAAAAANngaDowQRl8L3-OfUQuHQXYUuZg" : ""; // OSnack Production else "" 

export const GoogleLoginKey =
   hostname === "localhost" ? "93781465546-037srngorphl4elnicr4bmmd0hm384kb.apps.googleusercontent.com" :  // Dev
      hostname.endsWith("osnack.p8b.uk") ? "93781465546-037srngorphl4elnicr4bmmd0hm384kb.apps.googleusercontent.com" : // P8B Demo Production
         hostname.endsWith("osnack.co.uk") ? "398928888654-flaamd0frl6g0e6l7cilvmhcrm46umpa.apps.googleusercontent.com" : ""; // OSnack Production else ""

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
