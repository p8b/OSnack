import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { Address } from "../../_core/apiModels";
export const useDeleteAddress = async (address: Address): Promise<string> =>{
        let url_ = API_URL + "/Address/Delete";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = address;
        const response = await httpCaller.DELETE(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: string) => {
                return responseJson;
            });

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 404: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        case 412: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}
export const useAllAddress = async (): Promise<Address[]> =>{
        let url_ = API_URL + "/Address/Get/All";
        url_ = url_.replace(/[?&]$/, "");

        const response = await httpCaller.GET(url_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: Address[]) => {
                return responseJson;
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
export const usePostAddress = async (newAddress: Address): Promise<Address> =>{
        let url_ = API_URL + "/Address/Post";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = newAddress;
        const response = await httpCaller.POST(url_, content_);

        switch(response?.status){

        case 201: 
            return response.json().then((responseJson: Address) => {
                return responseJson;
            });

        case 422: 
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
export const usePutAddress = async (modifiedAddress: Address): Promise<Address> =>{
        let url_ = API_URL + "/Address/Put";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = modifiedAddress;
        const response = await httpCaller.PUT(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: Address) => {
                return responseJson;
            });

        case 422: 
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
export const useSetDefaultAddress = async (addressId: number): Promise<void> =>{
        let url_ = API_URL + "/Address/Put/SetDefault";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = addressId;
        const response = await httpCaller.PUT(url_, content_);

        switch(response?.status){

        case 204: 
            return;

        case 417: 
            return response.json().then((data: ErrorDto[]) => {
                throw new AlertObj(data, AlertTypes.Error, response.status);
            });

        default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
    }
}