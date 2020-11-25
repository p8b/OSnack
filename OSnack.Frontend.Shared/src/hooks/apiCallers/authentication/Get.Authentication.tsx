import { httpCaller } from "../../../_core/appFunc";
import { API_URL } from "../../../_core/constant.Variables";
import { User } from "../../../_core/apiModels";

export const useLogout = async () => {
   try {
      const result = await httpCaller.get(`${API_URL}/authentication/get/logout`);

      if (result?.ok)
         return { isLogout: true };
   } catch (e) { }
   return { isLogout: false };
};

export const useSilentAuthentication = async (currentAuthStatus: boolean, access: string) => {
   let authStatus = { isAuthenticated: false, user: new User() };

   const response = await httpCaller.get(`${API_URL}/authentication/get/silent${access}`);
   try {
      switch (response?.status) {
         case 200: // Ok
            const data = await response.json();
            authStatus.isAuthenticated = true;
            authStatus.user = data;
            break;
         case 404: // Not Found
            await httpCaller.get(`${API_URL}/Authentication/Get/AntiforgeryToken`);
            break;
      }
   } catch (e) { }

   if (!authStatus.isAuthenticated && currentAuthStatus) {
      authStatus = { isAuthenticated: false, user: new User() };
      await useLogout();
   }

   return authStatus;
};