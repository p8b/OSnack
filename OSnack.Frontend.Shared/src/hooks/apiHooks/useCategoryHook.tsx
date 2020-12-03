import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { Category } from "../../_core/apiModels";
export const usePostCategory = async (newCategory: Category): Promise<Category> =>{
        let url_ = API_URL + "/Category/Post";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = newCategory;
        const response = await httpCaller.POST(url_, content_);

        switch(response?.status){

        case 201: 
            return response.json().then((responseJson: Category) => {
                return responseJson;
            });

        case 422: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

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