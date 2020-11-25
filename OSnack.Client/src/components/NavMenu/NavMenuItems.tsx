/// Navigation menu items for different users
export const DefaultNav = [
   {
      id: 0,
      path: "/",
      displayName: "Home",
   },
   {
      id: 1,
      path: "/Shop",
      displayName: "Shop",
   },
   {
      id: 2,
      path: "/About",
      displayName: "About",
   },
   {
      id: 3,
      path: "/Contact",
      displayName: "Contact",
   },
   {
      id: 4,
      path: "/Login",
      displayName: "Login",
   }
];

export const LoginNav = [
   {
      id: 0,
      path: "/",
      displayName: "Home",
   },
   {
      id: 1,
      path: "/Shop",
      displayName: "Shop",
   },
   {
      id: 2,
      path: "/About",
      displayName: "About",
   },
   {
      id: 3,
      path: "/Contact",
      displayName: "Contact",
   }
];

export declare type INavItem = {
   id: number,
   path: string,
   displayName: string,
};