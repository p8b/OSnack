import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/appConst";
import { UserListAndTotalCount, User } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseDeleteUser={ data:string , status?: number;};
export const useDeleteUser = (userId: number): Promise<IReturnUseDeleteUser> =>{
    let url_ = API_URL + "/User/Delete/{userId}";
    if (userId !== null && userId !== undefined)
    url_ = url_.replace("{userId}", encodeURIComponent("" + userId));
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.DELETE(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:string) => {
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
export type IReturnUseGetUser={ data:UserListAndTotalCount , status?: number;};
export const useGetUser = (selectedPage: number, maxItemsPerPage: number, searchValue: string | null, filterRole: string | null, isSortAsce: boolean, sortName: string | null): Promise<IReturnUseGetUser> =>{
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
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:UserListAndTotalCount) => {
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
}
export type IReturnUseCreateUserUser={ data:User , status?: number;};
export const useCreateUserUser = (newUser: User): Promise<IReturnUseCreateUserUser> =>{
    let url_ = API_URL + "/User/Post/CreateUser";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = newUser;
    return httpCaller.POST(url_, content_).then(response => {

        switch(response?.status){

            case 201: 
                return response?.json().then((data:User) => {
                    return { data: data, status: response?.status };
                });

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
    });
}
export type IReturnUseUpdateUserUser={ data:User , status?: number;};
export const useUpdateUserUser = (modifiedUser: User): Promise<IReturnUseUpdateUserUser> =>{
    let url_ = API_URL + "/User/Put/UpdateUser";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = modifiedUser;
    return httpCaller.PUT(url_, content_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:User) => {
                    return { data: data, status: response?.status };
                });

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
    });
}
export type IReturnUseUserLockoutUser={ data:User , status?: number;};
export const useUserLockoutUser = (userId: number, lockoutEnabled: boolean): Promise<IReturnUseUserLockoutUser> =>{
    let url_ = API_URL + "/User/Put/UserLockout/{userId}/{lockoutEnabled}";
    if (userId !== null && userId !== undefined)
    url_ = url_.replace("{userId}", encodeURIComponent("" + userId));
    if (lockoutEnabled !== null && lockoutEnabled !== undefined)
    url_ = url_.replace("{lockoutEnabled}", encodeURIComponent("" + lockoutEnabled));
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.PUT(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:User) => {
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