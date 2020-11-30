import { ddLookup } from "./appClasses";
import 'whatwg-fetch';
import { AntiforgeryTokenCookieName } from "./constant.Variables";
import { ImgHTMLAttributes } from "react";

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

/**
 * Set the expiry date of the parameter cookie to paste date.
 * @param name cookie name
 */
export const deleteCookie = (name: string) =>
   document.cookie = name + '=; expires=Thu, 29 Mar 1991 00:00:01 GMT;';
//#endregion

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
   static get = async (apiUri: string) => fetch(`${apiUri}`, {
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
   static post = async (apiUri: string, bodyObject: any = "") => fetch(`${apiUri}`, {
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
   static put = async (apiUri: string, bodyObject: any = undefined) => fetch(`${apiUri}`, {
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
   static delete = async (apiUri: string, bodyObject: any = "") => fetch(`${apiUri}`, {
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
         image.crossOrigin = "Anonymous";
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
export const enumToArray = (enumObj: any) =>
   Object.keys(enumObj).filter((value: any) => isNaN(Number(value)) === false)
      .map((k: any) => new ddLookup(k, (enumObj[k] as string).replace(/_/g, ' ')));

export const uuidv4 = () => {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
   });
};

//export const delay = (ms: number) => {
//   return new Promise((resolve, reject) => {
//      setTimeout(resolve, ms);
//   });
//};
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

export const onProductImageError = async (i: React.SyntheticEvent<HTMLImageElement, Event>) => {

   i.currentTarget.src = "/public/images/logo.png";
};
export const onCategoryImageError = async (i: React.SyntheticEvent<HTMLImageElement, Event>) => {

   i.currentTarget.src = "/public/images/logo.png";
};

