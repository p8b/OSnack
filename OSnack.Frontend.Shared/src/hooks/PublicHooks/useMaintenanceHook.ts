import { AlertObj, AlertTypes, ErrorDto } from "../../components/Texts/Alert";
import { httpCaller } from "../../_core/appFunc";
import { API_URL, CommonErrors } from "../../_core/appConst";
import { MaintenanceModeStatusAndIsUserAllowedInMaintenance } from "../../_core/apiModels";
export type IReturnUseGetMaintenance={ data:MaintenanceModeStatusAndIsUserAllowedInMaintenance , status?: number;};
export const useGetMaintenance = (): Promise<IReturnUseGetMaintenance> =>{
    let url_ = API_URL + "/Maintenance/Get";
    url_ = url_.replace(/[?&]$/, "");
    return httpCaller.GET(url_).then(response => {

        switch(response?.status){

            case 200: 
                return response?.json().then((data:MaintenanceModeStatusAndIsUserAllowedInMaintenance) => {
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