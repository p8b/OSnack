import 'whatwg-fetch';
import { OrderStatusType } from './apiModels';
import { AntiforgeryTokenCookieName, API_URL, GetAllRecords } from "./constant.Variables";

//#region *** 'Cookie Management' ***
/**
 * Get the value of the specified cookie or empty if the cookie is not found
 * @param name Cookie name
 */
export const getCookieValue = (name: string) => {
   let cookies = document.cookie;
   try {
      let FirstSplit = cookies.split(';');
      let cookieValue = '';
      for (var i = 0; i < FirstSplit.length; i++) {
         if (~FirstSplit[i].indexOf(name + '=')) {
            cookieValue = FirstSplit[i].replace(name + '=', '');
         }
      }
      return cookieValue.replace(' ', '');
   } catch (err) {
      return '';
   }
};


export const setCookie = (name: string, value: boolean, expireDays: number) => {
   var d = new Date();
   d.setTime(d.getTime() + (expireDays * 24 * 60 * 60 * 1000));
   var expires = "expires=" + d.toUTCString();
   document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

/**
 * Set the expiry date of the parameter cookie to paste date.
 * @param name cookie name
 */
export const deleteCookie = (name: string) =>
   document.cookie = name + '=; expires=Thu, 29 Mar 1991 00:00:01 GMT;';
//#endregion

export class localStorageManagement {
   static SET = (name: string, value: string) => {
      if (navigator.cookieEnabled)
         localStorage.setItem(name, value);
   };

   static GET = (name: string) => {
      if (navigator.cookieEnabled)
         return localStorage.getItem(name);
      return "";
   };

   static REMOVE = (name: string) => {
      if (navigator.cookieEnabled)
         localStorage.removeItem(name);
   };
}

/** This class is used to send/receive Http requests */
export class httpCaller {
   /**
    * Http Get Request.
    * headers: {
         'content-type': 'application/json',
      },
      mode: "cors",
      method: "GET",
      credentials: "include",
    * @param apiUri
    */
   static GET = async (apiUri: string, bodyObject: any = "") => fetch(`${apiUri}`, {
      headers: new Headers({
         'content-type': 'application/json',
      }),
      mode: "cors",
      method: "GET",
      credentials: "include",
   })
      .catch(err => { return null; });
   /**
    * Http Post Request.
    * headers: {
         Accept: 'application/json',
         'content-type': 'application/json',
      },
      mode: "cors",
      method: "POST",
      credentials: "include",
      body: JSON.stringify(bodyObject),
    * @param apiUri
    * @param bodyObject
    */
   static POST = async (apiUri: string, bodyObject: any = "") => fetch(`${apiUri}`, {
      headers: new Headers({
         Accept: 'application/json',
         'content-type': 'application/json',
         'X-AF-TOKEN': getCookieValue(AntiforgeryTokenCookieName),
      }),
      mode: "cors",
      method: "POST",
      credentials: "include",
      body: JSON.stringify(bodyObject),
   })
      .catch(err => { return null; });
   /**
    * Http Put Request.
    * headers: {
         Accept: 'application/json',
         'content-type': 'application/json',
      },
      mode: "cors",
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(bodyObject),
    * @param apiUri
    * @param bodyObject
    */
   static PUT = async (apiUri: string, bodyObject: any = undefined) => fetch(`${apiUri}`, {
      headers: new Headers({
         Accept: 'application/json',
         'content-type': 'application/json',
         'X-AF-TOKEN': getCookieValue(AntiforgeryTokenCookieName)
      }),
      mode: "cors",
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(bodyObject),
   })
      .catch(err => { return null; });
   /**
    * Http Delete Request
    * headers: {
         Accept: 'application/json',
         'content-type': 'application/json',
      },
      mode: "cors",
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify(bodyObject),
    * @param apiUri
    * @param bodyObject
    */
   static DELETE = async (apiUri: string, bodyObject: any = "") => fetch(`${apiUri}`, {
      headers: new Headers({
         Accept: 'application/json',
         'content-type': 'application/json',
         'X-AF-TOKEN': getCookieValue(AntiforgeryTokenCookieName)
      }),
      mode: "cors",
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify(bodyObject),
   })
      .catch(err => { return null; });
}

/**
 * Return string base 64 of an image URL
 * @param url URL of the image
 *///Return string base 64 of an image URL
export const getBase64fromUrlImage = (url: string) =>
   new Promise((resolve, reject) => {
      try {
         const image = new Image();
         image.crossOrigin = "anonymous";
         image.src = url;
         image.onload = () => {
            var canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
            ctx?.drawImage(image, 0, 0);
            let imgBase64 = canvas.toDataURL();
            resolve(imgBase64);
         };
         image.onerror = error => reject(error);
      } catch (e) {
         reject(e);
      }
   });

/**
 * Turn enum to array of type "ddLookup". 
 * The name of each enum object is used as the name of "ddLookup" object
 * @param enumObj any enum
 *///Turn enum to array of type "ddLookup".
//export const enumToArray = (enumObj: any) =>
//   Object.keys(enumObj).filter((value: any) => isNaN(Number(value)) === false)
//      .map((k: any) => new EnumObj(k, (enumObj[k] as string).replace(/_/g, ' '), enumObj[k]));

export const uuidv4 = () => {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
   });
};

export const delay = (ms: number) => {
   return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
   });
};
export const sleep = async (ms: number, isCanceled: React.MutableRefObject<boolean>) => {
   return new Promise((resolve, reject) => {
      setTimeout(() => {
         if (!isCanceled.current) {
            resolve("Done");
         }
         else if (isCanceled.current) {
            //reject("Canceled");
         }
      }, ms);
   });
};

export const setHtmlTitle = (value: string) => {
   document.title = `OSnack ${value != "" ? `- ${value}` : ""}`;
};

export class onImageError {
   static Product = async (i: React.SyntheticEvent<HTMLImageElement, Event>) =>
      onImageError.onImageErrorSelect(i, "Product");
   static Category = async (i: React.SyntheticEvent<HTMLImageElement, Event>) =>
      onImageError.onImageErrorSelect(i, "Category");

   static onImageErrorSelect = (i: React.SyntheticEvent<HTMLImageElement, Event>, type: string = "") => {
      let src = `${API_URL}/Images/defaults/default.png`;

      switch (type) {
         case "Product":
         case "Category":
         default:
            break;
      }
      if (i.currentTarget.currentSrc != src)
         i.currentTarget.src = src;

   };
}

export const getNextDate = (day: number = 1) => {
   var now = new Date();
   var nextDay = new Date(now);
   return new Date(nextDay.setDate(now.getDate() + day));
};


export const getBadgeByOrderStatusType = (type: OrderStatusType) => {
   switch (type) {

      case OrderStatusType.InProgress:
         return "badge blue";
      case OrderStatusType.Confirmed:
         return "badge light-blue";
      case OrderStatusType.FullyRefunded:
      case OrderStatusType.PartialyRefunded:
         return "badge yellow";
      case OrderStatusType.Canceled:
         return "badge red";
      case OrderStatusType.Delivered:
         return "badge green";
      default:
         return "";
   }
};

export const extractUri = (defaultValues?: any[], pathName: string = window.location.pathname) => {
   let result: any[] = [];
   const pathNames = pathName.split('/').filter(val => val.length > 0);

   if (defaultValues != undefined) {
      defaultValues?.map((value, index) => {
         switch (typeof value) {
            case "number":
               result.push(Number(pathNames[index + 1]) || value);
               break;
            case "string":
               result.push(pathNames[index + 1] || value);
               break;
            case "boolean":
               result.push(pathNames[index + 1] == undefined ? value : pathNames[index + 1] === '1');
               break;
            default:
               throw "Type is not Valid uri parameter.";
         }
      });
   } else {
      result = pathNames;
   }
   return result;
};

export const generateUri = (values: any[], pathName: string = window.location.pathname) => {
   let uri = `/${pathName.split('/').filter(val => val.length > 0)[0]}`;
   values.map(value => uri += `/${value}`);
   return uri;
};

export const convertUriParamToBool = (value: string) => {
   if (Number(value) == 1)
      return 'true';
   if (Number(value) == 0)
      return 'false';
   if (Number(value) == -1)
      return GetAllRecords;
   return value;
};
