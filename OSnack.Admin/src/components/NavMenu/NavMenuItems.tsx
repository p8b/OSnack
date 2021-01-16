/// Navigation menu items for different users
export const LoginNav: INavItem[] = [
   {
      path: "/",
      displayName: "Dashboard",
   },
   {
      path: "/Products",
      displayName: "Products",
   },
   {
      path: "/Categories",
      displayName: "Categories",
   },
   {
      path: "/Orders",
      displayName: "Orders",
   },
   {
      path: "/Coupons",
      displayName: "Coupons",
   },
   {
      path: "/Users",
      displayName: "Users",
   },
   {
      path: "/Messages",
      displayName: "Messages",
   },
   {
      path: "/DeliveryOptions",
      displayName: "Delivery Options",
   },
   {
      path: "/EmailTemplate",
      displayName: "Email Template",
   }
];
export const DefaultNav: INavItem[] = [
   {
      path: "",
      displayName: "",
   }
];
export declare type INavItem = {
   path: string,
   displayName: string,
};
