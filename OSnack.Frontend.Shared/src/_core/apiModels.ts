export enum CouponType {

    FreeDelivery = 0,
    DiscountPrice = 1,
    PercentageOfTotal = 2,
}

export const CouponTypeList=[
{Id:0,Name:"FreeDelivery".replace(/([A-Z])/g, ' $1').trim(),Value:CouponType.FreeDelivery},
{Id:1,Name:"DiscountPrice".replace(/([A-Z])/g, ' $1').trim(),Value:CouponType.DiscountPrice},
{Id:2,Name:"PercentageOfTotal".replace(/([A-Z])/g, ' $1').trim(),Value:CouponType.PercentageOfTotal},
]
export enum SalePeriod {

    Daily = 0,
    Monthly = 1,
    Yearly = 2,
}

export const SalePeriodList=[
{Id:0,Name:"Daily".replace(/([A-Z])/g, ' $1').trim(),Value:SalePeriod.Daily},
{Id:1,Name:"Monthly".replace(/([A-Z])/g, ' $1').trim(),Value:SalePeriod.Monthly},
{Id:2,Name:"Yearly".replace(/([A-Z])/g, ' $1').trim(),Value:SalePeriod.Yearly},
]
export enum ContactType {

    Dispute = 0,
    Message = 1,
}

export const ContactTypeList=[
{Id:0,Name:"Dispute".replace(/([A-Z])/g, ' $1').trim(),Value:ContactType.Dispute},
{Id:1,Name:"Message".replace(/([A-Z])/g, ' $1').trim(),Value:ContactType.Message},
]
export enum PaymentType {

    Complete = 0,
    Failed = 1,
    PartialyRefunded = 2,
    FullyRefunded = 3,
}

export const PaymentTypeList=[
{Id:0,Name:"Complete".replace(/([A-Z])/g, ' $1').trim(),Value:PaymentType.Complete},
{Id:1,Name:"Failed".replace(/([A-Z])/g, ' $1').trim(),Value:PaymentType.Failed},
{Id:2,Name:"PartialyRefunded".replace(/([A-Z])/g, ' $1').trim(),Value:PaymentType.PartialyRefunded},
{Id:3,Name:"FullyRefunded".replace(/([A-Z])/g, ' $1').trim(),Value:PaymentType.FullyRefunded},
]
export enum ProductUnitType {

    Kg = 0,
    Grams = 1,
    PerItem = 3,
}

export const ProductUnitTypeList=[
{Id:0,Name:"Kg".replace(/([A-Z])/g, ' $1').trim(),Value:ProductUnitType.Kg},
{Id:1,Name:"Grams".replace(/([A-Z])/g, ' $1').trim(),Value:ProductUnitType.Grams},
{Id:3,Name:"PerItem".replace(/([A-Z])/g, ' $1').trim(),Value:ProductUnitType.PerItem},
]
export enum OrderStatusType {

    InProgress = 0,
    Confirmed = 1,
    Canceled = 2,
    Delivered = 3,
    PartialyRefunded = 4,
    FullyRefunded = 5,
}

export const OrderStatusTypeList=[
{Id:0,Name:"InProgress".replace(/([A-Z])/g, ' $1').trim(),Value:OrderStatusType.InProgress},
{Id:1,Name:"Confirmed".replace(/([A-Z])/g, ' $1').trim(),Value:OrderStatusType.Confirmed},
{Id:2,Name:"Canceled".replace(/([A-Z])/g, ' $1').trim(),Value:OrderStatusType.Canceled},
{Id:3,Name:"Delivered".replace(/([A-Z])/g, ' $1').trim(),Value:OrderStatusType.Delivered},
{Id:4,Name:"PartialyRefunded".replace(/([A-Z])/g, ' $1').trim(),Value:OrderStatusType.PartialyRefunded},
{Id:5,Name:"FullyRefunded".replace(/([A-Z])/g, ' $1').trim(),Value:OrderStatusType.FullyRefunded},
]
export enum RegistrationTypes {

    Application = 0,
    Google = 1,
    Facebook = 2,
    Github = 3,
}

export const RegistrationTypesList=[
{Id:0,Name:"Application".replace(/([A-Z])/g, ' $1').trim(),Value:RegistrationTypes.Application},
{Id:1,Name:"Google".replace(/([A-Z])/g, ' $1').trim(),Value:RegistrationTypes.Google},
{Id:2,Name:"Facebook".replace(/([A-Z])/g, ' $1').trim(),Value:RegistrationTypes.Facebook},
{Id:3,Name:"Github".replace(/([A-Z])/g, ' $1').trim(),Value:RegistrationTypes.Github},
]
export enum EmailTemplateTypes {

    DefaultTemplate = 0,
    EmailConfirmation = 2,
    WelcomeExternalRegistration = 3,
    WelcomeNewEmployee = 4,
    PasswordReset = 5,
    MessageToAdmin = 6,
    MessageToUser = 7,
    OrderReceipt = 8,
    OrderCancellation = 9,
    OrderDispute = 10,
    OrderReceiptForAdmin = 11,
    OrderDisputeForAdmin = 12,
}

export const EmailTemplateTypesList=[
{Id:0,Name:"DefaultTemplate".replace(/([A-Z])/g, ' $1').trim(),Value:EmailTemplateTypes.DefaultTemplate},
{Id:2,Name:"EmailConfirmation".replace(/([A-Z])/g, ' $1').trim(),Value:EmailTemplateTypes.EmailConfirmation},
{Id:3,Name:"WelcomeExternalRegistration".replace(/([A-Z])/g, ' $1').trim(),Value:EmailTemplateTypes.WelcomeExternalRegistration},
{Id:4,Name:"WelcomeNewEmployee".replace(/([A-Z])/g, ' $1').trim(),Value:EmailTemplateTypes.WelcomeNewEmployee},
{Id:5,Name:"PasswordReset".replace(/([A-Z])/g, ' $1').trim(),Value:EmailTemplateTypes.PasswordReset},
{Id:6,Name:"MessageToAdmin".replace(/([A-Z])/g, ' $1').trim(),Value:EmailTemplateTypes.MessageToAdmin},
{Id:7,Name:"MessageToUser".replace(/([A-Z])/g, ' $1').trim(),Value:EmailTemplateTypes.MessageToUser},
{Id:8,Name:"OrderReceipt".replace(/([A-Z])/g, ' $1').trim(),Value:EmailTemplateTypes.OrderReceipt},
{Id:9,Name:"OrderCancellation".replace(/([A-Z])/g, ' $1').trim(),Value:EmailTemplateTypes.OrderCancellation},
{Id:10,Name:"OrderDispute".replace(/([A-Z])/g, ' $1').trim(),Value:EmailTemplateTypes.OrderDispute},
{Id:11,Name:"OrderReceiptForAdmin".replace(/([A-Z])/g, ' $1').trim(),Value:EmailTemplateTypes.OrderReceiptForAdmin},
{Id:12,Name:"OrderDisputeForAdmin".replace(/([A-Z])/g, ' $1').trim(),Value:EmailTemplateTypes.OrderDisputeForAdmin},
]
export class Role {
    id?: number = 0;
    name!: string;
    accessClaim!: string;

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
export class Item {
    category?: string | undefined;
    description?: string | undefined;
    name?: string | undefined;
    quantity?: string | undefined;
    sku?: string | undefined;
    tax?: Money | undefined;
    unit_amount?: Money | undefined;

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
export class Phone {
    country_code?: string | undefined;
    extension_number?: string | undefined;
    national_number?: string | undefined;

}
export class Money {
    currency_code?: string | undefined;
    value?: string | undefined;

}
export class Payee {
    client_id?: string | undefined;
    email_address?: string | undefined;
    merchant_id?: string | undefined;
    display_data?: PayeeDisplayable | undefined;

}
export class Coupon {
    code!: string;
    type!: CouponType;
    maxUseQuantity!: number;
    minimumOrderPrice!: number;
    discountAmount?: number | undefined;
    expiryDate!: Date;

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
export class Comment {
    id?: number = 0;
    description?: string | undefined;
    reply?: string | undefined;
    name?: string | undefined;
    date?: Date;
    rate?: number;
    product?: Product | undefined;

}
export class Message {
    id?: number = 0;
    date?: Date;
    isCustomer?: boolean;
    body?: string | undefined;

}
export class Payment {
    id?: number = 0;
    paymentProvider!: string;
    reference!: string;
    type!: PaymentType;
    email?: string | undefined;
    dateTime!: Date;
    message?: string | undefined;
    refundAmount?: number;
    refundDateTime?: Date | undefined;

}
export class TaxInfo {
    tax_id?: string | undefined;
    tax_id_type?: string | undefined;

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
export class Category {
    id?: number = 0;
    name!: string;
    imagePath?: string | undefined;
    originalImagePath?: string | undefined;
    imageBase64!: string;
    originalImageBase64!: string;
    totalProducts?: number;

}
export class UserBase {
    id?: number;
    email?: string | undefined;
    emailConfirmed?: boolean;
    phoneNumber?: string | undefined;

}
export class LoginInfo {
    email?: string | undefined;
    password?: string | undefined;
    rememberMe?: boolean;

}
export class Newsletter {
    id?: string | undefined;
    email!: string;

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
export class Communication {
    id?: string | undefined;
    type!: ContactType;
    status?: boolean;
    fullName?: string | undefined;
    email!: string;
    order_Id?: string | undefined;
    messages?: Message[] | undefined;
    date?: Date;
    captchaToken?: string | undefined;

}
export class EmailTemplate {
    id?: number = 0;
    templateType!: EmailTemplateTypes;
    subject!: string;
    requiredClasses?: EmailTemplateRequiredClass[] | undefined;
    html!: string;
    design!: any;

}
export class ClassProperty {
    name?: string | undefined;
    templateName?: string | undefined;
    isIgnored?: boolean;

}
export class PhoneWithType {
    phone_number?: Phone | undefined;
    phone_type?: string | undefined;

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
export class DeliveryOption {
    id?: number = 0;
    name!: string;
    price!: number;
    minimumOrderTotal!: number;
    isPremitive?: boolean;

}
export class AddressDetails {
    building_name?: string | undefined;
    delivery_service?: string | undefined;
    street_name?: string | undefined;
    street_number?: string | undefined;
    street_type?: string | undefined;
    sub_building?: string | undefined;

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
export class LinkDescription {
    encType?: string | undefined;
    href?: string | undefined;
    mediaType?: string | undefined;
    method?: string | undefined;
    rel?: string | undefined;
    title?: string | undefined;

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
export class AmountBreakdown {
    discount?: Money | undefined;
    handling?: Money | undefined;
    insurance?: Money | undefined;
    item_total?: Money | undefined;
    shipping?: Money | undefined;
    shipping_discount?: Money | undefined;
    tax_total?: Money | undefined;

}
export abstract class OrderAddressBase {
    name!: string;
    firstLine!: string;
    secondLine?: string | undefined;
    city!: string;
    postcode!: string;

}
export abstract class OrderProductBase {
    name!: string;
    price!: number;
    unitQuantity!: number;
    unitType!: ProductUnitType;
    imagePath?: string | undefined;

}
export class PayeeDisplayable {
    brand_name?: string | undefined;
    business_phone?: Phone | undefined;
    business_email?: string | undefined;

}
export class SellerProtection {
    dispute_categories?: string[] | undefined;
    status?: string | undefined;

}
export class PaymentCollection {
    authorizations?: Authorization[] | undefined;
    captures?: Capture[] | undefined;
    refunds?: Refund[] | undefined;

}
export class RegistrationMethod {
    externalLinkedId?: string | undefined;
    type!: RegistrationTypes;
    registeredDate?: Date;

}
export class PaymentInstruction {
    disbursement_mode?: string | undefined;

}
export class AmountWithBreakdown {
    breakdown?: AmountBreakdown | undefined;
    currency_code?: string | undefined;
    value?: string | undefined;

}
export class RefundStatusDetails {
    reason?: string | undefined;

}
export class ExternalLoginDetails {
    code!: string;
    state!: string;
    type?: RegistrationTypes;
    rememberMe?: boolean;
    redirectUrl?: string | undefined;

}
export class CaptureStatusDetails {
    reason?: string | undefined;

}
export class CommentListAndComment {
    commentList?: Comment[] | undefined;
    comment?: Comment | undefined;

}
export class LableListAndPriceList {
    lableList?: string[] | undefined;
    priceList?: number[] | undefined;

}
export class UserListAndTotalCount {
    userList?: User[] | undefined;
    totalCount?: number;

}
export class UpdateCurrentUserData {
    user?: User | undefined;
    currentPassword?: string | undefined;

}
export class NetAmountBreakdownItem {
    converted_amount?: Money | undefined;
    payable_amount?: Money | undefined;

}
export class CouponListAndTotalCount {
    couponList?: Coupon[] | undefined;
    totalCount?: number;

}
export class CommentListAndTotalCount {
    commentList?: Comment[] | undefined;
    totalCount?: number;

}
export class MerchantPayableBreakdown {
    gross_amount?: Money | undefined;
    net_amount?: Money | undefined;
    net_amount_breakdown?: NetAmountBreakdownItem[] | undefined;
    paypal_fee?: Money | undefined;
    total_refunded_amount?: Money | undefined;

}
export class ProductListAndTotalCount {
    productList?: Product[] | undefined;
    totalCount?: number;

}
export class CategoryListAndTotalCount {
    categoryList?: Category[] | undefined;
    totalCount?: number;

}
export class EmailTemplateRequiredClass {
    value?: string | undefined;
    classProperties?: ClassProperty[] | undefined;

}
export class OrderListAndAvailableTypes {
    orderList?: Order[] | undefined;
    availableTypes?: OrderStatusType[] | undefined;

}
export class AuthorizationStatusDetails {
    reason?: string | undefined;

}
export class MerchantReceivableBreakdown {
    gross_amount?: Money | undefined;
    net_amount?: Money | undefined;
    paypal_fee?: Money | undefined;
    receivable_amount?: Money | undefined;

}
export class ProductAndRelatedProductList {
    product?: Product | undefined;
    relatedProductList?: Product[] | undefined;

}
export class CommunicationListAndTotalCount {
    communicationList?: Communication[] | undefined;
    totalCount?: number;

}
export class DeliveryOptionListAndTotalCount {
    deliveryOptionList?: DeliveryOption[] | undefined;
    totalCount?: number;

}
export class NewOrderCountAndOpenDisputeCount {
    newOrderCount?: number;
    openDisputeCount?: number;

}
export class EmailTemplateAndDefaultEmailTemplate {
    emailTemplate?: EmailTemplate | undefined;
    defaultEmailTemplate?: EmailTemplate | undefined;

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
    hasOrder?: boolean;
    fullName?: string | undefined;

}
export class Order extends OrderAddressBase {
    id?: string | undefined;
    date?: Date;
    status!: OrderStatusType;
    deliveryOption?: DeliveryOption | undefined;
    dispute?: Communication | undefined;
    deliveryPrice?: number;
    addressId!: number;
    shippingReference?: string | undefined;
    user?: User | undefined;
    userId?: number | undefined;
    payment: Payment = new Payment();
    coupon?: Coupon | undefined;
    orderItems?: OrderItem[] | undefined;
    totalPrice!: number;
    totalItemPrice!: number;
    shippingPrice!: number;
    totalDiscount!: number;

}
export class Address extends OrderAddressBase {
    id?: number = 0;
    isDefault?: boolean;
    instructions?: string | undefined;
    userId?: number;

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
    score?: number;
    hasComment?: boolean;

}
export class OrderItem extends OrderProductBase {
    id?: number = 0;
    productCategoryName!: string;
    productId?: number | undefined;
    quantity!: number;

}
export class LableListAndPriceListAndCountList extends LableListAndPriceList {
    countList?: number[] | undefined;

}
export class CommentListAndCommentAndTotalCount extends CommentListAndComment {
    totalCount?: number;

}
export class OrderListAndAvailableTypesAndFullName extends OrderListAndAvailableTypes {
    fullName?: string | undefined;

}
export class OrderListAndAvailableTypesAndTotalCount extends OrderListAndAvailableTypes {
    totalCount?: number;

}
export class OrderListAndAvailableTypesAndFullNameAndTotalCount extends OrderListAndAvailableTypesAndFullName {
    totalCount?: number;

}
export class NewOrderCountAndOpenDisputeCountAndOpenMessageCount extends NewOrderCountAndOpenDisputeCount {
    openMessageCount?: number;

}
export class NewOrderCountAndOpenDisputeCountAndOpenMessageCountAndTotalSales extends NewOrderCountAndOpenDisputeCountAndOpenMessageCount {
    totalSales?: number;

}
