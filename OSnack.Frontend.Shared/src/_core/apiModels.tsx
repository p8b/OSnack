export enum RegistrationTypes {

    Application = 0,
    Google = 1,
    Facebook = 2,
    Github = 3,
}
export enum CouponType {

    FreeDelivery = 0,
    DiscountPrice = 1,
    PercentageOfTotal = 2,
}
export enum EmailTemplateServerVariables {

    UserName = 0,
    RegistrationMethod = 1,
    Role = 2,
    TokenUrl = 3,
    ExpiaryDateTime = 4,
}
export enum OrderStatusType {

    Placed = 0,
    Hold = 1,
    Confirmed = 2,
    Delivered = 3,
    Canceled = 4,
}
export enum ProductUnitType {

    Kg = 0,
    Grams = 1,
    Per_Item = 2,
}
export abstract class OrderAddressBase {
    name!: string;
    firstLine!: string;
    secondLine?: string | undefined;
    city!: string;
    postcode!: string;

}
export class Role {
    id?: number = 0;
    name!: string;
    accessClaim!: string;

}
export class RegistrationMethod {
    externalLinkedId?: string | undefined;
    type!: RegistrationTypes;
    registeredDate?: Date;

}
export class LoginInfo {
    email?: string | undefined;
    password?: string | undefined;
    rememberMe?: boolean;

}
export class ExternalLoginInfo {
    code!: string;
    state!: string;
    type?: RegistrationTypes;
    rememberMe?: boolean;
    redirectUrl?: string | undefined;

}
export class Category {
    id?: number = 0;
    name!: string;
    imagePath?: string | undefined;
    originalImagePath?: string | undefined;
    imageBase64!: string;
    originalImageBase64!: string;
    totalProducts?: number;

}
export class MultiResultOfListOfCategoryAndInteger {
    part1?: Category[] | undefined;
    part2?: number;

}
export class ProblemDetails {
    type?: string | undefined;
    title?: string | undefined;
    status?: number | undefined;
    detail?: string | undefined;
    instance?: string | undefined;
    extensions?: { [key: string]: any; } | undefined;

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
    id?: number = 0;
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
    id?: number = 0;
    enumValue!: EmailTemplateServerVariables;
    replacementValue!: string;

}
export class MultiResultOfEmailTemplateAndEmailTemplate {
    part1?: EmailTemplate | undefined;
    part2?: EmailTemplate | undefined;

}
export class Newsletter {
    email!: string;
    displayName?: string | undefined;

}
export class DeliveryOption {
    id?: number = 0;
    name!: string;
    price!: number;
    minimumOrderTotal!: number;

}
export class Payment {
    id?: number = 0;
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
    id?: number = 0;
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
    id?: number = 0;
    description!: string;
    orderItem?: OrderItem | undefined;
    orderItemId?: number;
    product?: Product | undefined;

}
export class Score {
    id?: number = 0;
    rate?: number;
    orderItem?: OrderItem | undefined;
    orderItemId?: number;
    product?: Product | undefined;

}
export class MultiResultOfListOfProductAndInteger {
    part1?: Product[] | undefined;
    part2?: number;

}
export class MultiResultOfProductAndListOfProduct {
    part1?: Product | undefined;
    part2?: Product[] | undefined;

}
export class MultiResultOfListOfUserAndInteger {
    part1?: User[] | undefined;
    part2?: number;

}
export class UpdateCurrentUserData {
    user?: User | undefined;
    currentPassword?: string | undefined;

}
export class UserBase {
    id?: number;
    email?: string | undefined;
    emailConfirmed?: boolean;
    phoneNumber?: string | undefined;

}
export class Address extends OrderAddressBase {
    id?: number = 0;
    isDefault?: boolean;
    instructions?: string | undefined;
    userId?: number;

}
export class User extends UserBase {
    id?: number = 0;
    firstName!: string;
    surname!: string;
    role: Role = new Role();
    phoneNumber?: string | undefined;
    registrationMethod: RegistrationMethod = new RegistrationMethod();
    email!: string;
    addresses?: Address[] | undefined;
    password?: string | undefined;
    subscribeNewsLetter?: boolean;

}
export class Order extends OrderAddressBase {
    id?: number = 0;
    date?: Date;
    status!: OrderStatusType;
    deliveryOption: DeliveryOption = new DeliveryOption();
    totalPrice?: number;
    deliveryPrice?: number;
    address: Address = new Address();
    payment: Payment = new Payment();
    coupon?: Coupon | undefined;
    orderItems?: OrderItem[] | undefined;

}
export class OrderItem extends OrderProductBase {
    id?: number = 0;
    productCategoryName!: string;
    productId?: number | undefined;
    quantity!: number;

}
export class Product extends OrderProductBase {
    id?: number = 0;
    description?: string | undefined;
    imagePath?: string | undefined;
    originalImagePath?: string | undefined;
    imageBase64!: string;
    originalImageBase64!: string;
    status?: boolean;
    category: Category = new Category();
    nutritionalInfo?: NutritionalInfo | undefined;
    comments?: Comment[] | undefined;
    scores?: Score[] | undefined;
    averageScore?: number;

}
