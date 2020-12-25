using OSnack.API.Database.Models;
using OSnack.API.Extras.Attributes;

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
      User,
      Order,
      ContactUsMessage,
      Token,
      RegistrationMethod,
      Role,
      Payment,
      OrderItem,
   }
   public enum EmailTemplateTypes
   {
      [EmailTemplateTypeServerClasses]
      DefaultTemplate = 0,

      [EmailTemplateTypeServerClasses]
      Others = 1,

      [EmailTemplateTypeServerClasses(typeof(User), typeof(Token))]
      EmailConfirmation = 2,

      [EmailTemplateTypeServerClasses(typeof(User), typeof(RegistrationMethod))]
      WelcomeExternalRegistration = 3,

      [EmailTemplateTypeServerClasses(typeof(User), typeof(Token), typeof(Role))]
      WelcomeNewEmployee = 4,

      [EmailTemplateTypeServerClasses(typeof(User), typeof(Token))]
      PasswordReset = 5,

      [EmailTemplateTypeServerClasses()]
      ContactUsMessage = 6,

      [EmailTemplateTypeServerClasses(typeof(Order), typeof(Payment), typeof(OrderItem))]
      OrderReceipt = 7,

      [EmailTemplateTypeServerClasses(typeof(Order), typeof(Payment))]
      OrderCancellation = 8,
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
