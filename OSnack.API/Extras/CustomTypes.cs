namespace OSnack.API.Extras.CustomTypes
{
   public enum CouponType
   {
      FreeDelivery = 0,
      DiscountPrice = 1,
      PercentageOfTotal = 2
   }

   public enum EmailTemplateServerVariables
   {
      UserName = 0,
      RegistrationMethod = 1,
      Role = 2,
      TokenUrl = 3,
      ExpiaryDateTime = 4,
   }

   public enum TokenTypes
   {
      ChangePassword = 0,
      ConfirmEmail = 1,
      EndSubscription = 2
   }

   //public enum DeliveryPriceOptions
   //{
   //   Free = 0,
   //   Standard = 1,
   //   Premium = 2,
   //}

   public enum OrderStatusType
   {
      Placed = 0,
      Hold = 1,
      Confirmed = 2,
      Delivered = 3,
      Canceled = 4
   }

   public enum ProductUnitType
   {
      Kg = 0,
      Grams = 1,
      Per_Item = 2
   }
   public enum AppLogType
   {
      Exception = 0,
      Information = 1,
      FileModification = 2,
      EmailFailure = 3,
      OrderException = 4
   }
}
