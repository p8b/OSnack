import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/appConst";
import { CouponListAndTotalCount, Coupon } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseDeleteCoupon = { data: string, status?: number; };
export const useDeleteCoupon = (couponCode: string | null): Promise<IReturnUseDeleteCoupon> => {
   let url_ = API_URL + "/Coupon/Delete/{couponCode}";
   if (couponCode !== null && couponCode !== undefined)
      url_ = url_.replace("{couponCode}", encodeURIComponent("" + couponCode));
   url_ = url_.replace(/[?&]$/, "");
   return httpCaller.DELETE(url_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: string) => {
               return { data: data, status: response?.status };
            });

         case 417:
            return response?.json().then((data: ErrorDto[]) => {
               throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

         case 404:
            return response?.json().then((data: ErrorDto[]) => {
               throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

         case 412:
            return response?.json().then((data: ErrorDto[]) => {
               throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

         default:
            CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
      }
   });
};
export type IReturnUseSearchCoupon = { data: CouponListAndTotalCount, status?: number; };
export const useSearchCoupon = (selectedPage: number, maxNumberPerItemsPage: number, searchValue: string | null, filterType: string | null, isSortAsce: boolean, sortName: string | null): Promise<IReturnUseSearchCoupon> => {
   let url_ = API_URL + "/Coupon/Get/Search/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{filterType}/{isSortAsce}/{sortName}";
   if (selectedPage !== null && selectedPage !== undefined)
      url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
   if (maxNumberPerItemsPage !== null && maxNumberPerItemsPage !== undefined)
      url_ = url_.replace("{maxNumberPerItemsPage}", encodeURIComponent("" + maxNumberPerItemsPage));
   if (searchValue !== null && searchValue !== undefined)
      url_ = url_.replace("{searchValue}", encodeURIComponent("" + searchValue));
   if (filterType !== null && filterType !== undefined)
      url_ = url_.replace("{filterType}", encodeURIComponent("" + filterType));
   if (isSortAsce !== null && isSortAsce !== undefined)
      url_ = url_.replace("{isSortAsce}", encodeURIComponent("" + isSortAsce));
   if (sortName !== null && sortName !== undefined)
      url_ = url_.replace("{sortName}", encodeURIComponent("" + sortName));
   url_ = url_.replace(/[?&]$/, "");
   return httpCaller.GET(url_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: CouponListAndTotalCount) => {
               return { data: data, status: response?.status };
            });

         case 417:
            return response?.json().then((data: ErrorDto[]) => {
               throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

         default:
            CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
      }
   });
};
export type IReturnUsePostCoupon = { data: Coupon, status?: number; };
export const usePostCoupon = (newCoupon: Coupon): Promise<IReturnUsePostCoupon> => {
   let url_ = API_URL + "/Coupon/Post";
   url_ = url_.replace(/[?&]$/, "");
   const content_ = newCoupon;
   return httpCaller.POST(url_, content_).then(response => {

      switch (response?.status) {

         case 201:
            return response?.json().then((data: Coupon) => {
               return { data: data, status: response?.status };
            });

         case 412:
            return response?.json().then((data: ErrorDto[]) => {
               throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

         case 417:
            return response?.json().then((data: ErrorDto[]) => {
               throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

         case 422:
            return response?.json().then((data: ErrorDto[]) => {
               throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

         default:
            CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
      }
   });
};
export type IReturnUsePutCoupon = { data: Coupon, status?: number; };
export const usePutCoupon = (modifiedCoupon: Coupon): Promise<IReturnUsePutCoupon> => {
   let url_ = API_URL + "/Coupon/Put";
   url_ = url_.replace(/[?&]$/, "");
   const content_ = modifiedCoupon;
   return httpCaller.PUT(url_, content_).then(response => {

      switch (response?.status) {

         case 200:
            return response?.json().then((data: Coupon) => {
               return { data: data, status: response?.status };
            });

         case 412:
            return response?.json().then((data: ErrorDto[]) => {
               throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

         case 422:
            return response?.json().then((data: ErrorDto[]) => {
               throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

         case 417:
            return response?.json().then((data: ErrorDto[]) => {
               throw new AlertObj(data, AlertTypes.Error, response?.status);
            });

         default:
            CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
      }
   });
};