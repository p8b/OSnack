import { AlertObj, AlertTypes, ErrorDto } from "osnack-frontend-shared/src/components/Texts/Alert";
import { httpCaller } from "osnack-frontend-shared/src/_core/appFunc";
import { API_URL, CommonErrors } from "osnack-frontend-shared/src/_core/appConst";
import { CategoryListAndTotalCount, Category } from "osnack-frontend-shared/src/_core/apiModels";
export type IReturnUseDeleteCategory={ data:string , status?: number;};
export const useDeleteCategory = (categoryId: number): Promise<IReturnUseDeleteCategory> =>{
    let url_ = API_URL + "/Category/Delete/{categoryId}";
    if (categoryId !== null && categoryId !== undefined)
    url_ = url_.replace("{categoryId}", encodeURIComponent("" + categoryId));
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.DELETE(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:string) => {
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
}
export type IReturnUseSearchCategory={ data:CategoryListAndTotalCount , status?: number;};
export const useSearchCategory = (selectedPage: number, maxNumberPerItemsPage: number, searchValue: string | null, isSortAsce: boolean, sortName: string | null): Promise<IReturnUseSearchCategory> =>{
    let url_ = API_URL + "/Category/Get/Search/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{isSortAsce}/{sortName}";
    if (selectedPage !== null && selectedPage !== undefined)
    url_ = url_.replace("{selectedPage}", encodeURIComponent("" + selectedPage));
    if (maxNumberPerItemsPage !== null && maxNumberPerItemsPage !== undefined)
    url_ = url_.replace("{maxNumberPerItemsPage}", encodeURIComponent("" + maxNumberPerItemsPage));
    if (searchValue !== null && searchValue !== undefined)
    url_ = url_.replace("{searchValue}", encodeURIComponent("" + searchValue));
    if (isSortAsce !== null && isSortAsce !== undefined)
    url_ = url_.replace("{isSortAsce}", encodeURIComponent("" + isSortAsce));
    if (sortName !== null && sortName !== undefined)
    url_ = url_.replace("{sortName}", encodeURIComponent("" + sortName));
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:CategoryListAndTotalCount) => {
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
export type IReturnUseAllSecretCategory={ data:Category[] , status?: number;};
export const useAllSecretCategory = (): Promise<IReturnUseAllSecretCategory> =>{
    let url_ = API_URL + "/Category/Get/AllSecret";
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:Category[]) => {
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
export type IReturnUsePostCategory={ data:Category , status?: number;};
export const usePostCategory = (newCategory: Category): Promise<IReturnUsePostCategory> =>{
    let url_ = API_URL + "/Category/Post";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = newCategory;
    return httpCaller.POST(url_, content_).then(response => {

        switch(response?.status){

            case 201: 
                return response?.json().then((data:Category) => {
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
export type IReturnUsePutCategory={ data:Category , status?: number;};
export const usePutCategory = (modifiedCategory: Category): Promise<IReturnUsePutCategory> =>{
    let url_ = API_URL + "/Category/Put";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = modifiedCategory;
    return httpCaller.PUT(url_, content_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:Category) => {
                    return { data: data, status: response?.status };
                });

            case 404: 
                return response?.json().then((data: ErrorDto[]) => {
                   throw new AlertObj(data, AlertTypes.Error, response?.status);
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
}