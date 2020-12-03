export enum RegistrationTypes {
    Application = "Application",
    Google = "Google",
    Facebook = "Facebook",
    Github = "Github",
}
export enum ProductUnitType {
    Kg = "Kg",
    Grams = "Grams",
    Per_Item = "Per_Item",
}
export enum CouponType {
    FreeDelivery = "FreeDelivery",
    DiscountPrice = "DiscountPrice",
    PercentageOfTotal = "PercentageOfTotal",
}
export abstract class OrderAddressBase {
    name!: string;
    firstLine!: string;
    secondLine?: string | undefined;
    city!: string;
    postcode!: string;

}
export class Role {
    id?: number;
    name!: string;
    accessClaim!: string;

}
export class RegistrationMethod {
    externalLinkedId?: string | undefined;
    type!: RegistrationTypes;
    registeredDate?: Date;

}
export class ProblemDetails {
    type?: string | undefined;
    title?: string | undefined;
    status?: number | undefined;
    detail?: string | undefined;
    instance?: string | undefined;
    extensions?: { [key: string]: any; } | undefined;

}
export class Score {
    id?: number;
    rate?: number;
    orderItem?: OrderItem | undefined;
    orderItemId?: number;
    product?: Product | undefined;

}
export abstract class OrderProductBase {
    name!: string;
    price!: number;
    unitQuantity!: number;
    unitType!: ProductUnitType;

}
export class Category {
    id?: number;
    name!: string;
    imagePath?: string | undefined;
    originalImagePath?: string | undefined;
    imageBase64!: string;
    originalImageBase64!: string;
    totalProducts?: number;

}
export class NutritionalInfo {
    id?: number;
    perGram?: number;
    energyKJ?: number | undefined;
    energyKcal?: number | undefined;
    fat?: number | undefined;
    saturateFat?: number | undefined;
    carbohydrate?: number | undefined;
    carbohydrateSugar?: number | undefined;
    fibre?: number | undefined;
    protein?: number | undefined;
    salt?: number | undefined;

}
export class Comment {
    id?: number;
    description!: string;
    orderItem?: OrderItem | undefined;
    orderItemId?: number;
    product?: Product | undefined;

}
export class UpdateCurrentUserData {
    user?: User | undefined;
    currentPassword?: string | undefined;

}
export class Coupon {
    code!: string;
    pendigCode?: string | undefined;
    type!: CouponType;
    maxUseQuantity?: number;
    discountAmount?: number;
    expiryDate!: Date;

}
export class UserBase {
    id?: number;
    email?: string | undefined;
    emailConfirmed?: boolean;
    phoneNumber?: string | undefined;

}
export class Address extends OrderAddressBase {
    id?: number;
    isDefault?: boolean;
    instructions?: string | undefined;
    userId?: number;

}
export class User extends UserBase {
    firstName!: string;
    surname!: string;
    role!: Role;
    phoneNumber?: string | undefined;
    registrationMethod!: RegistrationMethod;
    email!: string;
    addresses?: Address[] | undefined;
    password?: string | undefined;
    subscribeNewsLetter?: boolean;

}
export class OrderItem extends OrderProductBase {
    id?: number;
    productCategoryName!: string;
    productId?: number | undefined;
    quantity!: number;

}
export class Product extends OrderProductBase {
    id?: number;
    description?: string | undefined;
    imagePath?: string | undefined;
    originalImagePath?: string | undefined;
    imageBase64!: string;
    originalImageBase64!: string;
    status?: boolean;
    category!: Category;
    nutritionalInfo?: NutritionalInfo | undefined;
    comments?: Comment[] | undefined;
    scores?: Score[] | undefined;
    averageScore?: number;

}
