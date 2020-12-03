import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/constant.Variables";
import { User, MultiResultOfListOfUserAndInteger, UpdateCurrentUserData } from "../../_core/apiModels";
export const useDeleteUser = async (thisUser: User): Promise<string> =>{
        let url_ = API_URL + "/User/Delete";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = thisUser;
        const response = await httpCaller.DELETE(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: string) => {
                return responseJson;
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
export const useGetUser = async (selectedPage: number, maxItemsPerPage: number, searchValue: string | null, filterRole: string | null, isSortAsce: boolean, sortName: string | null): Promise<MultiResultOfListOfUserAndInteger> =>{
        let url_ = API_URL + "/User/Get/{selectedPage}/{maxItemsPerPage}/{searchValue}/{filterRole}/{isSortAsce}/{sortName}";
        if (selectedPage === undefined || selectedPage === null)
            throw new Error("The parameter 'selectedPage' must be defined.");
        url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
        if (maxItemsPerPage === undefined || maxItemsPerPage === null)
            throw new Error("The parameter 'maxItemsPerPage' must be defined.");
        url_ = url_.replace("{maxItemsPerPage}", encodeURIComponent("" + maxItemsPerPage));
        if (searchValue === undefined || searchValue === null)
            throw new Error("The parameter 'searchValue' must be defined.");
        url_ = url_.replace("{searchValue}", encodeURIComponent("" + searchValue));
        if (filterRole === undefined || filterRole === null)
            throw new Error("The parameter 'filterRole' must be defined.");
        url_ = url_.replace("{filterRole}", encodeURIComponent("" + filterRole));
        if (isSortAsce === undefined || isSortAsce === null)
            throw new Error("The parameter 'isSortAsce' must be defined.");
        url_ = url_.replace("{isSortAsce}", encodeURIComponent("" + isSortAsce));
        if (sortName === undefined || sortName === null)
            throw new Error("The parameter 'sortName' must be defined.");
        url_ = url_.replace("{sortName}", encodeURIComponent("" + sortName));
        url_ = url_.replace(/[?&]$/, "");

        const response = await httpCaller.GET(url_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: MultiResultOfListOfUserAndInteger) => {
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
export const useCreateUserUser = async (newUser: User): Promise<User> =>{
        let url_ = API_URL + "/User/Post/CreateUser";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = newUser;
        const response = await httpCaller.POST(url_, content_);

        switch(response?.status){

        case 201: 
            return response.json().then((responseJson: User) => {
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
export const useCreateCustomerUser = async (newCustomer: User): Promise<User> =>{
        let url_ = API_URL + "/User/Post/CreateCustomer";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = newCustomer;
        const response = await httpCaller.POST(url_, content_);

        switch(response?.status){

        case 201: 
            return response.json().then((responseJson: User) => {
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
export const useRequestPasswordResetUser = async (email: string): Promise<string> =>{
        let url_ = API_URL + "/User/Post/RequestPasswordReset";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = email;
        const response = await httpCaller.POST(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: string) => {
                return responseJson;
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
export const useUpdateUserUser = async (modifiedUser: User): Promise<User> =>{
        let url_ = API_URL + "/User/Put/UpdateUser";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = modifiedUser;
        const response = await httpCaller.PUT(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: User) => {
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
export const useUpdateCurrentUserUser = async (data: UpdateCurrentUserData): Promise<User> =>{
        let url_ = API_URL + "/User/Put/UpdateCurrentUser";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = data;
        const response = await httpCaller.PUT(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: User) => {
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
export const useUserLockoutUser = async (userId: number, lockoutEnabled: boolean): Promise<User> =>{
        let url_ = API_URL + "/User/Put/UserLockout/{userId}/{lockoutEnabled}";
        if (userId === undefined || userId === null)
            throw new Error("The parameter 'userId' must be defined.");
        url_ = url_.replace("{userId}", encodeURIComponent("" + userId));
        if (lockoutEnabled === undefined || lockoutEnabled === null)
            throw new Error("The parameter 'lockoutEnabled' must be defined.");
        url_ = url_.replace("{lockoutEnabled}", encodeURIComponent("" + lockoutEnabled));
        url_ = url_.replace(/[?&]$/, "");

        const response = await httpCaller.PUT(url_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: User) => {
                return responseJson;
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
export const useConfirmEmailUser = async (pathName: string): Promise<void> =>{
        let url_ = API_URL + "/User/Put/ConfirmEmail";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = pathName;
        const response = await httpCaller.PUT(url_, content_);

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
export const useUpdateCurrentUserPasswordUser = async (data: UpdateCurrentUserData): Promise<User> =>{
        let url_ = API_URL + "/User/Put/UpdateCurrentUserPassword";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = data;
        const response = await httpCaller.PUT(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: User) => {
                return responseJson;
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
export const useUpdatePasswordWithTokenUser = async (data: any): Promise<User> =>{
        let url_ = API_URL + "/User/Put/UpdatePasswordWithToken";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = data;
        const response = await httpCaller.PUT(url_, content_);

        switch(response?.status){

        case 200: 
            return response.json().then((responseJson: User) => {
                return responseJson;
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