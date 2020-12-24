namespace OSnack.API.Extras.CustomTypes
{
   public enum CouponType
   {
      FreeDelivery = 0,
      DiscountPrice = 1,
      PercentageOfTotal = 2
   }

   public enum EmailTemplateClassNames
   {
      User = 0,
      Order = 1,
      ContactUsMessage = 2,
      Token = 3,
   }
   public enum EmailTemplateTypes
   {
      Others = 0,
      DefaultTemplate = 1,
      EmailConfirmation = 2,
      WelcomeExternalRegistration = 3,
      WelcomeNewEmployee = 4,
      PasswordReset = 5,
      ContactUsMessage = 6,
      OrderReceipt = 7,
      OrderCanceled = 8,
   }

   public enum TokenTypes
   {
      ChangePassword = 0,
      ConfirmEmail = 1,
      EndSubscription = 2
   }

   public enum OrderStatusType
   {
      InProgress = 0,
      Confirmed = 1,
      Canceled = 2,
      Delivered = 3,
      RefundRequest = 4,
      RefundRefused = 5,
      PartialyRefunded = 6,
      FullyRefunded = 7
   }

   public enum PaymentType
   {
      Complete = 0,
      Failed = 1,
      PartialyRefunded = 2,
      FullyRefunded = 3
   }

   public enum ProductUnitType
   {
      Kg = 0,
      Grams = 1,
      PerItem = 2
   }

   public enum AppLogType
   {
      Exception = 0,
      Information = 1,
      FileModification = 2,
      EmailFailure = 3,
      OrderException = 4,
      PaymentException = 5
   }
}
