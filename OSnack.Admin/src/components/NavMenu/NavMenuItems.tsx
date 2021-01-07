/// Navigation menu items for different users
export const LoginNav = [
   {
      id: 0,
      path: "/",
      displayName: "Dashboard",
   },
   {
      id: 1,
      path: "/Products",
      displayName: "Products",
   },
   {
      id: 2,
      path: "/Categories",
      displayName: "Categories",
   },
   {
      id: 3,
      path: "/Orders",
      displayName: "Orders",
   },
   {
      id: 4,
      path: "/Coupons",
      displayName: "Coupons",
   },
   {
      id: 5,
      path: "/Users",
      displayName: "Users",
   },
   {
      id: 6,
      path: "/ContactUsMessages",
      displayName: "Contact Us Messages",
   },
   {
      id: 7,
      path: "/DeliveryOptions",
      displayName: "Delivery Options",
   },
   {
      id: 8,
      path: "/EmailTemplate",
      displayName: "Email Template",
   }
];
export const DefaultNav = [
   {
      id: 0,
      path: "",
      displayName: "",
   }
];
export declare type INavItem = {
   id: number,
   path: string,
   displayName: string,
};
