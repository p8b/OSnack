import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { Coupon } from "../../_core/apiModels";
export const useValidateCoupon = async (couponCodeBody: Coupon, couponCodePath: string): Promise<void> =>{
        let url_ = API_URL + "/Coupon/Get/Validate/{couponCode}";
        if (couponCodePath === undefined || couponCodePath === null)
            throw new Error("The parameter 'couponCodePath' must be defined.");
        url_ = url_.replace("{couponCode}", encodeURIComponent("" + couponCodePath));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = couponCodeBody;
        const response = await httpCaller.GET(url_, content_);

        switch(response?.status){

        case 200: 
            return;

        case 412: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}