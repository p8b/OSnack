export enum RegistrationTypes {
    Application = "Application",
    Google = "Google",
    Facebook = "Facebook",
    Github = "Github",
}
export enum CouponType {
    FreeDelivery = "FreeDelivery",
    DiscountPrice = "DiscountPrice",
    PercentageOfTotal = "PercentageOfTotal",
}
export enum EmailTemplateServerVariables {
    UserName = "UserName",
    RegistrationMethod = "RegistrationMethod",
    Role = "Role",
    TokenUrl = "TokenUrl",
    ExpiaryDateTime = "ExpiaryDateTime",
}
export enum OrderStatusType {
    Placed = "Placed",
    Hold = "Hold",
    Confirmed = "Confirmed",
    Delivered = "Delivered",
    Canceled = "Canceled",
}
export enum ProductUnitType {
    Kg = "Kg",
    Grams = "Grams",
    Per_Item = "Per_Item",
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
export abstract class OrderAddressBase {
    name!: string;
    firstLine!: string;
    secondLine?: string | undefined;
    city!: string;
    postcode!: string;

}
export class ProblemDetails {
    type?: string | undefined;
    title?: string | undefined;
    status?: number | undefined;
    detail?: string | undefined;
    instance?: string | undefined;
    extensions?: { [key: string]: any; } | undefined;

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
export class Coupon {
    code!: string;
    pendigCode?: string | undefined;
    type!: CouponType;
    maxUseQuantity?: number;
    discountAmount?: number;
    expiryDate!: Date;

}
export class MultiResultOfListOfCouponAndInteger {
    part1?: Coupon[] | undefined;
    part2?: number;

}
export class EmailTemplate {
    id?: number;
    name!: string;
    subject!: string;
    tokenUrlPath?: string | undefined;
    serverVariables?: ServerVariables[] | undefined;
    locked?: boolean;
    isDefaultTemplate?: boolean;
    html!: string;
    design!: any;

}
export class ServerVariables {
    id?: number;
    enumValue!: EmailTemplateServerVariables;
    replacementValue!: string;

}
export class MultiResultOfEmailTemplateAndEmailTemplate {
    part1?: EmailTemplate | undefined;
    part2?: EmailTemplate | undefined;

}
export class DeliveryOption {
    id?: number;
    name!: string;
    price!: number;
    minimumOrderTotal!: number;

}
export class Payment {
    id?: number;
    paymentProvider!: string;
    reference!: string;
    dateTime!: Date;

}
export abstract class OrderProductBase {
    name!: string;
    price!: number;
    unitQuantity!: number;
    unitType!: ProductUnitType;

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
export class Score {
    id?: number;
    rate?: number;
    orderItem?: OrderItem | undefined;
    orderItemId?: number;
    product?: Product | undefined;

}
export class MultiResultOfListOfUserAndInteger {
    part1?: User[] | undefined;
    part2?: number;

}
export class UserBase {
    id?: number;
    email?: string | undefined;
    emailConfirmed?: boolean;
    phoneNumber?: string | undefined;

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
export class Address extends OrderAddressBase {
    id?: number;
    isDefault?: boolean;
    instructions?: string | undefined;
    userId?: number;

}
export class Order extends OrderAddressBase {
    id?: number;
    date?: Date;
    status!: OrderStatusType;
    deliveryOption!: DeliveryOption;
    totalPrice?: number;
    deliveryPrice?: number;
    address!: Address;
    payment!: Payment;
    coupon?: Coupon | undefined;
    orderItems?: OrderItem[] | undefined;

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
