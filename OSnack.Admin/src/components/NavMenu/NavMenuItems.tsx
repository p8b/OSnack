/// Navigation menu items for different users
export const Admin: INavItem[] = [
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
export const Manager: INavItem[] = [
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
];
export declare type INavItem = {
   path: string,
   displayName: string,
};
