import { RegistrationTypes, ProductUnitType } from "./constant.Variables";

export class Address {
   id = 0;
   name?: string;
   firstLine?: string;
   secondLine?: string;
   city?: string;
   postcode?: string;
   isDefault?: boolean;
   instructions?: string;
}

export class Category {
   id = 0;
   name?: string;
   imagePath?: string;
   originalImagePath?: string;
   imageBase64?: string;
   originalImageBase64?: string;
   products?: Product[];
   totalProducts: number = 0;

   //constructor(category = {
   //   id: 0,
   //   name: undefined,
   //   imagePath: undefined,
   //   originalImagePath: undefined,
   //   imageBase64: undefined,
   //   originalImageBase64: undefined,
   //   products: undefined
   //}) {
   //   this.id = category.id;
   //   this.name = category.name;
   //   this.imagePath = category.imagePath;
   //   this.originalImagePath = category.originalImagePath;
   //   this.products = category.products;
   //   this.imageBase64 = category.imageBase64;
   //   this.originalImageBase64 = category.originalImageBase64;
   //}
}

export class Comment {
   //id = 0;
   //description = "";
   //orderItem = new OrderItem();

   //constructor(comment = {
   //    id: 0,
   //    description: "",
   //    orderItem: new OrderItem(),
   //}) {
   //    this.id = comment.id;
   //    this.description = comment.description;
   //    this.orderItem = comment.orderItem;
   //}
}

export class Product {
   id = 0;
   name: string = "";
   description?: string;
   imagePath?: string;
   originalImagePath?: string;
   imageBase64?: string;
   originalImageBase64?: string;
   status = false;
   price?: number;
   unitQuantity?: number;
   unitType: ProductUnitType = ProductUnitType.grams;
   category = new Category();
   nutritionalInfo?: NutritionalInfo;
   comments?: Comment[];
   averageRate?: number;

   //constructor(product?: Product) {
   //   this.id = product?.id || this.id;
   //   this.name = product?.name;
   //   this.description = product?.description;
   //   this.imagePath = product?.imagePath;
   //   this.originalImagePath = product?.originalImagePath;
   //   this.imageBase64 = product?.imageBase64;
   //   this.originalImageBase64 = product?.originalImageBase64;
   //   this.status = product?.status || this.status;
   //   this.price = product?.price;
   //   this.unitQuantity = product?.unitQuantity;
   //   this.unitType = product?.unitType || this.unitType;
   //   this.category = product?.category || this.category;
   //   this.nutritionalInfo = product?.nutritionalInfo;
   //   this.comments = product?.comments;
   //   this.averageRate = product?.averageRate;
   //}
}

export class NutritionalInfo {
   id = 0;
   energyKJ?: number;
   energyKcal?: number;
   fat?: number;
   saturateFat?: number;
   carbohydrate?: number;
   carbohydrateSugar?: number;
   fibre?: number;
   protein?: number;
   salt?: number;
   //constructor(nutritionalInfo: NutritionalInfo = {
   //   id: 0,
   //   energyKJ: undefined,
   //   energyKcal: undefined,
   //   fat: undefined,
   //   saturateFat: undefined,
   //   carbohydrate: undefined,
   //   carbohydrateSugar: undefined,
   //   fibre: undefined,
   //   protein: undefined,
   //   salt: undefined,
   //}) {
   //   this.id = nutritionalInfo.id;
   //   this.energyKJ = nutritionalInfo.energyKJ;
   //   this.energyKcal = nutritionalInfo.energyKcal;
   //   this.fat = nutritionalInfo.fat;
   //   this.saturateFat = nutritionalInfo.saturateFat;
   //   this.carbohydrate = nutritionalInfo.carbohydrate;
   //   this.carbohydrateSugar = nutritionalInfo.carbohydrateSugar;
   //   this.fibre = nutritionalInfo.fibre;
   //   this.protein = nutritionalInfo.protein;
   //   this.salt = nutritionalInfo.salt;
   //}
}

export class Score {
   //orderItemId = 0;
   //rate = 5;
   //userId = 0;

   //constructor(score = {
   //    orderItemId: 0,
   //    rate: 5,
   //    userId: 0,
   //}) {
   //    this.orderItemId = score.orderItemId;
   //    this.rate = score.rate;
   //    this.userId = score.userId;
   //}
}

export class Role {
   id: number = 0;
   name?: string;
   accessClaim?: string;

   //constructor(
   //   id?: number,
   //   name?: string,
   //   accessClaim?: string) {
   //   this.id = id || 0;
   //   this.name = name;
   //   this.accessClaim = accessClaim;
   //}
}

export class User {
   id: number = 0;
   firstName?: string;
   surname?: string;
   registrationMethod: RegistrationMethod = new RegistrationMethod();
   role?: Role;
   Password?: string;
   phoneNumber?: string;
   email?: string;
   emailConfirmed?: boolean;
   subscribeNewsLetter?: boolean;
   //constructor(user?: User) {
   //   this.id = user?.id || 0;
   //   this.firstName = user?.firstName;
   //   this.surname = user?.surname;
   //   this.registrationMethod = user?.registrationMethod || new RegistrationMethod();
   //   this.role = user?.role;
   //   this.Password = user?.Password;
   //   this.phoneNumber = user?.phoneNumber;
   //   this.email = user?.email;
   //   this.emailConfirmed = user?.emailConfirmed;
   //   this.subscribeNewsLetter = user?.subscribeNewsLetter;
   //}
}

export class RegistrationMethod {
   externalLinkedId?: string;
   type?: RegistrationTypes = RegistrationTypes.Application;
   registeredDate?: Date;
   //constructor(externalLinkedId?: string,
   //   type?: RegistrationTypes,
   //   registeredDate?: Date) {
   //   this.externalLinkedId = externalLinkedId;
   //   this.type = type || RegistrationTypes.Application;
   //   this.registeredDate = registeredDate;
   //}
}

export class LoginInfo {
   email?: string;
   password?: string;
   rememberMe?: boolean;

   //constructor(
   //   email?: string,
   //   password?: string,
   //   rememberMe?: boolean) {
   //   this.email = email;
   //   this.password = password;
   //   this.rememberMe = rememberMe;

   //}
}

export class ExternalLoginInfo {
   Code?: string;
   State?: string;
   type?: RegistrationTypes;
   rememberMe?: boolean;
   redirectUrl?: string;

   constructor(code?: string, state?: string, type?: RegistrationTypes, rememberMe?: boolean, redirectUrl?: string) {
      this.Code = code;
      this.State = state;
      this.type = type;
      this.rememberMe = rememberMe;
      this.redirectUrl = redirectUrl;
   }
}
