import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/constant.Variables";
import { User, UserListAndTotalCount } from "osnack-frontend-shared/src/_core/apiModels";
export const useDeleteUser = async (thisUser: User): Promise<{ data:string , status?: number}> =>{
        let url_ = API_URL + "/User/Delete";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = thisUser;
        let response = await httpCaller.DELETE(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.DELETE(url_, content_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: string = await response?.json();
                        return { data: responseData, status: response?.status };

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
  
}
export const useGetUser = async (selectedPage: number, maxItemsPerPage: number, searchValue: string | null, filterRole: string | null, isSortAsce: boolean, sortName: string | null): Promise<{ data:UserListAndTotalCount , status?: number}> =>{
        let url_ = API_URL + "/User/Get/{selectedPage}/{maxItemsPerPage}/{searchValue}/{filterRole}/{isSortAsce}/{sortName}";
        if (selectedPage !== null && selectedPage !== undefined)
        url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
        if (maxItemsPerPage !== null && maxItemsPerPage !== undefined)
        url_ = url_.replace("{maxItemsPerPage}", encodeURIComponent("" + maxItemsPerPage));
        if (searchValue !== null && searchValue !== undefined)
        url_ = url_.replace("{searchValue}", encodeURIComponent("" + searchValue));
        if (filterRole !== null && filterRole !== undefined)
        url_ = url_.replace("{filterRole}", encodeURIComponent("" + filterRole));
        if (isSortAsce !== null && isSortAsce !== undefined)
        url_ = url_.replace("{isSortAsce}", encodeURIComponent("" + isSortAsce));
        if (sortName !== null && sortName !== undefined)
        url_ = url_.replace("{sortName}", encodeURIComponent("" + sortName));
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.GET(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.GET(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: UserListAndTotalCount = await response?.json();
                        return { data: responseData, status: response?.status };

                case 417: 
                        return response?.json().then((data: ErrorDto[]) => {
                                throw new AlertObj(data, AlertTypes.Error, response?.status);
                        });

                default:
                        CommonErrors.BadServerResponseCode.value = `Server Unresponsive. ${response?.status || ""}`;
                        throw new AlertObj([CommonErrors.BadServerResponseCode], AlertTypes.Error, response?.status);
        }
  
}
export const useCreateUserUser = async (newUser: User): Promise<{ data:User , status?: number}> =>{
        let url_ = API_URL + "/User/Post/CreateUser";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = newUser;
        let response = await httpCaller.POST(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.POST(url_, content_);
        }

        switch(response?.status){

                case 201: 
                        var responseData: User = await response?.json();
                        return { data: responseData, status: response?.status };

                case 422: 
                        return response?.json().then((data: ErrorDto[]) => {
                                throw new AlertObj(data, AlertTypes.Error, response?.status);
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
  
}
export const useUpdateUserUser = async (modifiedUser: User): Promise<{ data:User , status?: number}> =>{
        let url_ = API_URL + "/User/Put/UpdateUser";
        url_ = url_.replace(/[?&]$/, "");
        const content_ = modifiedUser;
        let response = await httpCaller.PUT(url_, content_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.PUT(url_, content_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: User = await response?.json();
                        return { data: responseData, status: response?.status };

                case 422: 
                        return response?.json().then((data: ErrorDto[]) => {
                                throw new AlertObj(data, AlertTypes.Error, response?.status);
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
  
}
export const useUserLockoutUser = async (userId: number, lockoutEnabled: boolean): Promise<{ data:User , status?: number}> =>{
        let url_ = API_URL + "/User/Put/UserLockout/{userId}/{lockoutEnabled}";
        if (userId !== null && userId !== undefined)
        url_ = url_.replace("{userId}", encodeURIComponent("" + userId));
        if (lockoutEnabled !== null && lockoutEnabled !== undefined)
        url_ = url_.replace("{lockoutEnabled}", encodeURIComponent("" + lockoutEnabled));
        url_ = url_.replace(/[?&]$/, "");
        let response = await httpCaller.PUT(url_);
        if( response?.status === 400){
            await httpCaller.GET(API_URL + "/Authentication/Get/AntiforgeryToken");        
            response = await httpCaller.PUT(url_);
        }

        switch(response?.status){

                case 200: 
                        var responseData: User = await response?.json();
                        return { data: responseData, status: response?.status };

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
  
}