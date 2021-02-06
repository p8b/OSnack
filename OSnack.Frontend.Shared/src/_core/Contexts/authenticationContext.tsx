import React, { createContext, useState } from "react";
import { User } from "../../_core/apiModels";

export const AuthenticationContext = createContext({
   isAuthenticated: false,
   user: new User(),
   set: (_isAuthenticated?: boolean, _user?: User) => { }
});

const AuthenticationContextProvider = ({ children }: { children: React.ReactNode; }): JSX.Element => {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [user, setUser] = useState(new User());

   const set = (_isAuthenticated?: boolean, _user?: User) => {
      setIsAuthenticated(_isAuthenticated || false);
      setUser(_user || new User());
   };
   return (
      <AuthenticationContext.Provider value={{ isAuthenticated, user, set }}>
         {children}
      </AuthenticationContext.Provider >
   );
};
export default AuthenticationContextProvider;