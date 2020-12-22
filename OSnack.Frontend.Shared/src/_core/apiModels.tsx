export enum RegistrationTypes {

    Application = 0,
    Google = 1,
    Facebook = 2,
    Github = 3,
}

export const RegistrationTypesList=[
{Id:0,Name:"Application".replace(/_/g, ' '),Value:RegistrationTypes.Application},
{Id:1,Name:"Google".replace(/_/g, ' '),Value:RegistrationTypes.Google},
{Id:2,Name:"Facebook".replace(/_/g, ' '),Value:RegistrationTypes.Facebook},
{Id:3,Name:"Github".replace(/_/g, ' '),Value:RegistrationTypes.Github},
]
export enum CouponType {

    FreeDelivery = 0,
    DiscountPrice = 1,
    PercentageOfTotal = 2,
}

export const CouponTypeList=[
{Id:0,Name:"FreeDelivery".replace(/_/g, ' '),Value:CouponType.FreeDelivery},
{Id:1,Name:"DiscountPrice".replace(/_/g, ' '),Value:CouponType.DiscountPrice},
{Id:2,Name:"PercentageOfTotal".replace(/_/g, ' '),Value:CouponType.PercentageOfTotal},
]
export enum EmailTemplateServerVariables {

    UserName = 0,
    RegistrationMethod = 1,
    Role = 2,
    TokenUrl = 3,
    ExpiaryDateTime = 4,
}

export const EmailTemplateServerVariablesList=[
{Id:0,Name:"UserName".replace(/_/g, ' '),Value:EmailTemplateServerVariables.UserName},
{Id:1,Name:"RegistrationMethod".replace(/_/g, ' '),Value:EmailTemplateServerVariables.RegistrationMethod},
{Id:2,Name:"Role".replace(/_/g, ' '),Value:EmailTemplateServerVariables.Role},
{Id:3,Name:"TokenUrl".replace(/_/g, ' '),Value:EmailTemplateServerVariables.TokenUrl},
{Id:4,Name:"ExpiaryDateTime".replace(/_/g, ' '),Value:EmailTemplateServerVariables.ExpiaryDateTime},
]
export enum OrderStatusType {

    In_Progress = 0,
    Confirmed = 1,
    Canceled = 2,
    Delivered = 3,
    Refund_Request = 4,
    Refund_Refused = 5,
    Partialy_Refunded = 6,
    Fully_Refunded = 7,
}

export const OrderStatusTypeList=[
{Id:0,Name:"In_Progress".replace(/_/g, ' '),Value:OrderStatusType.In_Progress},
{Id:1,Name:"Confirmed".replace(/_/g, ' '),Value:OrderStatusType.Confirmed},
{Id:2,Name:"Canceled".replace(/_/g, ' '),Value:OrderStatusType.Canceled},
{Id:3,Name:"Delivered".replace(/_/g, ' '),Value:OrderStatusType.Delivered},
{Id:4,Name:"Refund_Request".replace(/_/g, ' '),Value:OrderStatusType.Refund_Request},
{Id:5,Name:"Refund_Refused".replace(/_/g, ' '),Value:OrderStatusType.Refund_Refused},
{Id:6,Name:"Partialy_Refunded".replace(/_/g, ' '),Value:OrderStatusType.Partialy_Refunded},
{Id:7,Name:"Fully_Refunded".replace(/_/g, ' '),Value:OrderStatusType.Fully_Refunded},
]
export enum PaymentType {

    Pendig = 0,
    Complete = 1,
    Partialy_Refunded = 2,
    Fully_Refunded = 3,
}

export const PaymentTypeList=[
{Id:0,Name:"Pendig".replace(/_/g, ' '),Value:PaymentType.Pendig},
{Id:1,Name:"Complete".replace(/_/g, ' '),Value:PaymentType.Complete},
{Id:2,Name:"Partialy_Refunded".replace(/_/g, ' '),Value:PaymentType.Partialy_Refunded},
{Id:3,Name:"Fully_Refunded".replace(/_/g, ' '),Value:PaymentType.Fully_Refunded},
]
export enum ProductUnitType {

    Kg = 0,
    Grams = 1,
    Per_Item = 2,
}

export const ProductUnitTypeList=[
{Id:0,Name:"Kg".replace(/_/g, ' '),Value:ProductUnitType.Kg},
{Id:1,Name:"Grams".replace(/_/g, ' '),Value:ProductUnitType.Grams},
{Id:2,Name:"Per_Item".replace(/_/g, ' '),Value:ProductUnitType.Per_Item},
]
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
export class ExternalLoginDetails {
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
export class CategoryListAndTotalCount {
    categoryList?: Category[] | undefined;
    totalCount?: number;

}
export class Coupon {
    code!: string;
    pendigCode?: string | undefined;
    type!: CouponType;
    maxUseQuantity?: number;
    minimumOrderPrice?: number;
    discountAmount?: number;
    expiryDate!: Date;

}
export class CouponListAndTotalCount {
    couponList?: Coupon[] | undefined;
    totalCount?: number;

}
export class DeliveryOption {
    id?: number = 0;
    name!: string;
    price!: number;
    minimumOrderTotal!: number;
    isPremitive?: boolean;

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
export class EmailTemplateAndDefaultEmailTemplate {
    emailTemplate?: EmailTemplate | undefined;
    defaultEmailTemplate?: EmailTemplate | undefined;

}
export class Newsletter {
    email!: string;
    displayName?: string | undefined;

}
export class Payment {
    id?: number = 0;
    paymentProvider!: string;
    reference!: string;
    type!: PaymentType;
    email?: string | undefined;
    dateTime!: Date;

}
export abstract class OrderProductBase {
    name!: string;
    price!: number;
    unitQuantity!: number;
    unitType!: ProductUnitType;
    imagePath?: string | undefined;

}
export class OrderListAndTotalCount {
    orderList?: Order[] | undefined;
    totalCount?: number;

}
export class OrderListAndAvailableTypes {
    orderList?: Order[] | undefined;
    availableTypes?: OrderStatusType[] | undefined;

}
export class Order2 {
    intent?: string | undefined;
    create_time?: string | undefined;
    expiration_time?: string | undefined;
    id?: string | undefined;
    links?: LinkDescription[] | undefined;
    payer?: Payer | undefined;
    purchase_units?: PurchaseUnit[] | undefined;
    status?: string | undefined;
    update_time?: string | undefined;

}
export class LinkDescription {
    encType?: string | undefined;
    href?: string | undefined;
    mediaType?: string | undefined;
    method?: string | undefined;
    rel?: string | undefined;
    title?: string | undefined;

}
export class Payer {
    address?: AddressPortable | undefined;
    birth_date?: string | undefined;
    email_address?: string | undefined;
    name?: Name | undefined;
    payer_id?: string | undefined;
    phone?: PhoneWithType | undefined;
    tax_info?: TaxInfo | undefined;

}
export class AddressPortable {
    address_details?: AddressDetails | undefined;
    address_line_1?: string | undefined;
    address_line_2?: string | undefined;
    address_line_3?: string | undefined;
    admin_area_1?: string | undefined;
    admin_area_2?: string | undefined;
    admin_area_3?: string | undefined;
    admin_area_4?: string | undefined;
    country_code?: string | undefined;
    postal_code?: string | undefined;

}
export class AddressDetails {
    building_name?: string | undefined;
    delivery_service?: string | undefined;
    street_name?: string | undefined;
    street_number?: string | undefined;
    street_type?: string | undefined;
    sub_building?: string | undefined;

}
export class Name {
    alternate_full_name?: string | undefined;
    full_name?: string | undefined;
    given_name?: string | undefined;
    middle_name?: string | undefined;
    prefix?: string | undefined;
    suffix?: string | undefined;
    surname?: string | undefined;

}
export class PhoneWithType {
    phone_number?: Phone | undefined;
    phone_type?: string | undefined;

}
export class Phone {
    country_code?: string | undefined;
    extension_number?: string | undefined;
    national_number?: string | undefined;

}
export class TaxInfo {
    tax_id?: string | undefined;
    tax_id_type?: string | undefined;

}
export class PurchaseUnit {
    amount?: AmountWithBreakdown | undefined;
    custom_id?: string | undefined;
    description?: string | undefined;
    id?: string | undefined;
    invoice_id?: string | undefined;
    items?: Item[] | undefined;
    payee?: Payee | undefined;
    payment_instruction?: PaymentInstruction | undefined;
    payments?: PaymentCollection | undefined;
    reference_id?: string | undefined;
    shipping?: ShippingDetail | undefined;
    soft_descriptor?: string | undefined;

}
export class AmountWithBreakdown {
    breakdown?: AmountBreakdown | undefined;
    currency_code?: string | undefined;
    value?: string | undefined;

}
export class AmountBreakdown {
    discount?: Money | undefined;
    handling?: Money | undefined;
    insurance?: Money | undefined;
    item_total?: Money | undefined;
    shipping?: Money | undefined;
    shipping_discount?: Money | undefined;
    tax_total?: Money | undefined;

}
export class Money {
    currency_code?: string | undefined;
    value?: string | undefined;

}
export class Item {
    category?: string | undefined;
    description?: string | undefined;
    name?: string | undefined;
    quantity?: string | undefined;
    sku?: string | undefined;
    tax?: Money | undefined;
    unit_amount?: Money | undefined;

}
export class Payee {
    client_id?: string | undefined;
    email_address?: string | undefined;
    merchant_id?: string | undefined;
    display_data?: PayeeDisplayable | undefined;

}
export class PayeeDisplayable {
    brand_name?: string | undefined;
    business_phone?: Phone | undefined;
    business_email?: string | undefined;

}
export class PaymentInstruction {
    disbursement_mode?: string | undefined;

}
export class PaymentCollection {
    authorizations?: Authorization[] | undefined;
    captures?: Capture[] | undefined;
    refunds?: Refund[] | undefined;

}
export class Authorization {
    amount?: Money | undefined;
    status_details?: AuthorizationStatusDetails | undefined;
    create_time?: string | undefined;
    expiration_time?: string | undefined;
    id?: string | undefined;
    invoice_id?: string | undefined;
    links?: LinkDescription[] | undefined;
    seller_protection?: SellerProtection | undefined;
    status?: string | undefined;
    update_time?: string | undefined;

}
export class AuthorizationStatusDetails {
    reason?: string | undefined;

}
export class SellerProtection {
    dispute_categories?: string[] | undefined;
    status?: string | undefined;

}
export class Capture {
    amount?: Money | undefined;
    status_details?: CaptureStatusDetails | undefined;
    create_time?: string | undefined;
    disbursement_mode?: string | undefined;
    final_capture?: boolean | undefined;
    id?: string | undefined;
    invoice_id?: string | undefined;
    links?: LinkDescription[] | undefined;
    seller_protection?: SellerProtection | undefined;
    seller_receivable_breakdown?: MerchantReceivableBreakdown | undefined;
    status?: string | undefined;
    update_time?: string | undefined;

}
export class CaptureStatusDetails {
    reason?: string | undefined;

}
export class MerchantReceivableBreakdown {
    gross_amount?: Money | undefined;
    net_amount?: Money | undefined;
    paypal_fee?: Money | undefined;
    receivable_amount?: Money | undefined;

}
export class Refund {
    amount?: Money | undefined;
    create_time?: string | undefined;
    id?: string | undefined;
    invoice_id?: string | undefined;
    links?: LinkDescription[] | undefined;
    note_to_payer?: string | undefined;
    status_details?: RefundStatusDetails | undefined;
    seller_payable_breakdown?: MerchantPayableBreakdown | undefined;
    status?: string | undefined;
    update_time?: string | undefined;

}
export class RefundStatusDetails {
    reason?: string | undefined;

}
export class MerchantPayableBreakdown {
    gross_amount?: Money | undefined;
    net_amount?: Money | undefined;
    net_amount_breakdown?: NetAmountBreakdownItem[] | undefined;
    paypal_fee?: Money | undefined;
    total_refunded_amount?: Money | undefined;

}
export class NetAmountBreakdownItem {
    converted_amount?: Money | undefined;
    payable_amount?: Money | undefined;

}
export class ShippingDetail {
    address?: AddressPortable | undefined;
    name?: Name | undefined;
    options?: ShippingOption[] | undefined;

}
export class ShippingOption {
    amount?: Money | undefined;
    id?: string | undefined;
    label?: string | undefined;
    selected?: boolean | undefined;
    type?: string | undefined;

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
export class ProductListAndTotalCount {
    productList?: Product[] | undefined;
    totalCount?: number;

}
export class ProductAndRelatedProductList {
    product?: Product | undefined;
    relatedProductList?: Product[] | undefined;

}
export class UserListAndTotalCount {
    userList?: User[] | undefined;
    totalCount?: number;

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
    orderLength?: number;

}
export class Order extends OrderAddressBase {
    id?: string | undefined;
    date?: Date;
    status!: OrderStatusType;
    deliveryOption?: DeliveryOption | undefined;
    deliveryPrice?: number;
    addressId!: number;
    userId?: number | undefined;
    email?: string | undefined;
    payment: Payment = new Payment();
    coupon?: Coupon | undefined;
    orderItems?: OrderItem[] | undefined;
    totalPrice!: number;
    totalItemPrice!: number;
    shippingPrice!: number;
    totalDiscount!: number;

}
export class OrderItem extends OrderProductBase {
    id?: number = 0;
    productCategoryName!: string;
    productId?: number | undefined;
    quantity!: number;

}
export class OrderListAndAvailableTypesAndTotalCount extends OrderListAndAvailableTypes {
    totalCount?: number;

}
export class Product extends OrderProductBase {
    id?: number = 0;
    description?: string | undefined;
    originalImagePath?: string | undefined;
    imageBase64!: string;
    originalImageBase64!: string;
    status?: boolean;
    stockQuantity!: number;
    category: Category = new Category();
    nutritionalInfo?: NutritionalInfo | undefined;
    comments?: Comment[] | undefined;
    scores?: Score[] | undefined;
    averageScore?: number;

}
