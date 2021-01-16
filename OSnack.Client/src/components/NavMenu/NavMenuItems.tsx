/// Navigation menu items for different users
export const DefaultNav: INavItem[] = [
   {
      path: "/",
      displayName: "Home",
   },
   {
      path: "/Shop",
      displayName: "Shop",
   },
   {
      path: "/About",
      displayName: "About",
   },
   {
      path: "/Contact",
      displayName: "Contact",
   },
   {
      path: "/Login",
      displayName: "Login",
   }
];

export const LoginNav: INavItem[] = [
   {
      path: "/",
      displayName: "Home",
   },
   {
      path: "/Shop",
      displayName: "Shop",
   },
   {
      path: "/About",
      displayName: "About",
   },
   {
      path: "/Contact",
      displayName: "Contact",
   }
];

export declare type INavItem = {
   path: string,
   displayName: string,
};
