import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/appConst";
import { Coupon } from "../../_core/apiModels";
export type IReturnUseValidateCoupon={ data:Coupon , status?: number;};
export const useValidateCoupon = (couponCode: string | null): Promise<IReturnUseValidateCoupon> =>{
    let url_ = API_URL + "/Coupon/Get/Validate/{couponCode}";
    if (couponCode !== null && couponCode !== undefined)
    url_ = url_.replace("{couponCode}", encodeURIComponent("" + couponCode));
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:Coupon) => {
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

            default:
                CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
    });
}