using OSnack.API.Database.Models;
using OSnack.API.Extras.Attributes;

namespace OSnack.API.Extras.CustomTypes
{
   public enum CouponType
   {
      FreeDelivery,
      DiscountPrice,
      PercentageOfTotal
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

      [EmailTemplateTypeServerClasses(typeof(Order), typeof(Communication))]
      OrderDispute = 9,
   }

   public enum TokenTypes
   {
      ChangePassword,
      ConfirmEmail,
      EndSubscription
   }

   public enum OrderStatusType
   {
      InProgress,
      Confirmed,
      Canceled,
      Delivered,
      PartialyRefunded,
      FullyRefunded
   }

   public enum PaymentType
   {
      Complete,
      Failed,
      PartialyRefunded,
      FullyRefunded
   }

   public enum ProductUnitType
   {
      Kg,
      Grams,
      PerItem
   }

   public enum AppLogType
   {
      Exception,
      Information,
      FileModification,
      EmailFailure,
      OrderException,
      PaymentException
   }

   public enum ContactType
   {
      Dispute,
      Question
   }
}
