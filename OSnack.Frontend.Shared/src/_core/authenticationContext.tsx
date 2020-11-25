import React, { createContext, useState, useMemo } from "react";
import { User } from "../_core/apiModels";

type Props = {
   children: React.ReactNode;
};
type AuthContext = {
   isAuthenticated: boolean;
   user: User;
};

const initAuthContext = {
   state: { isAuthenticated: false, user: new User() },
   setState: (state: AuthContext) => { }
};

export const AuthContext = createContext(initAuthContext);

const AuthenticationContext = ({ children }: Props): JSX.Element => {
   const [state, setState] = useState(initAuthContext.state);

   const provider = useMemo(() => ({ state, setState }), [state, setState]);
   return (
      <AuthContext.Provider value={provider}>
         {children}
      </AuthContext.Provider >
   );
};
export default AuthenticationContext;