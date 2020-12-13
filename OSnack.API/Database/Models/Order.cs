using OSnack.API.Database.ModelsDependencies;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;

using PayPalCheckoutSdk.Orders;

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("Orders")]
   public class Order : OrderAddressBase
   {
      [Key]
      [DefaultValue(0)]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(100)")]
      [DataType(DataType.Date)]
      public DateTime Date { get; set; } = DateTime.UtcNow;

      [Required(ErrorMessage = "Status is required \n")]
      public OrderStatusType Status { get; set; }

      [Required(ErrorMessage = "Status is required \n")]
      public DeliveryOption DeliveryOption { get; set; }


      [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
      [Column(TypeName = "decimal(7,2)")]
      public decimal DeliveryPrice { get; set; }

      [Required(ErrorMessage = "Address is required \n")]
      [ForeignKey("AddressId")]
      public Address Address { get; set; }

      [Required(ErrorMessage = "Payment is required \n")]
      [ForeignKey("PaymentId")]
      public Payment Payment { get; set; }

      [ForeignKey("Code")]
      public Coupon Coupon { get; set; }

      [InverseProperty("Order")]
      public ICollection<OrderItem> OrderItems { get; set; }

      [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
      [Column(TypeName = "decimal(7,2)")]
      [Required]
      public decimal TotalPrice { get; set; }

      [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
      [Column(TypeName = "decimal(7,2)")]
      [Required]
      public decimal TotalItemPrice { get; set; }

      [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
      [Column(TypeName = "decimal(7,2)")]
      [Required]
      public decimal ShippingPrice { get; set; }

      [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
      [Column(TypeName = "decimal(7,2)")]
      [Required]
      public decimal TotalDiscount { get; set; }

      internal OrderRequest ConvertToPayPalOrder()
      {
         OrderRequest orderRequest = new OrderRequest();

         orderRequest.CheckoutPaymentIntent = "CAPTURE";
         orderRequest.ApplicationContext = new ApplicationContext()
         {
            BrandName = AppConst.Settings.BrandName,
            LandingPage = "BILLING",
            UserAction = "CONTINUE",
            ShippingPreference = "SET_PROVIDED_ADDRESS"
         };

         List<Item> orderItems = new List<Item>();
         foreach (OrderItem orderItem in OrderItems)
         {
            orderItems.Add(new Item()
            {
               Name = orderItem.Name,
               Category = orderItem.ProductCategoryName,
               Description = orderItem.Product.Description,
               Quantity = orderItem.Quantity.ToString(),
               UnitAmount = new Money()
               {
                  CurrencyCode = AppConst.Settings.PayPal.CurrencyCode,
                  Value = orderItem.Price.ToString()
               }
            });
         }

         orderRequest.PurchaseUnits = new List<PurchaseUnitRequest>()
         {
            new PurchaseUnitRequest (){
               ReferenceId =  "PUHF",
               Description = "OSnack Food Product",
               CustomId = "CUST-HighFashions",
               SoftDescriptor = "Snacks and food producs",
               AmountWithBreakdown = new AmountWithBreakdown()
               {
                  CurrencyCode = AppConst.Settings.PayPal.CurrencyCode,
                  Value = TotalPrice.ToString(),
                  AmountBreakdown = new AmountBreakdown()
                  {
                       ItemTotal = new Money()
                       {
                           CurrencyCode = AppConst.Settings.PayPal.CurrencyCode,
                           Value = TotalItemPrice.ToString()
                       },
                       Shipping = new Money()
                       {
                           CurrencyCode = AppConst.Settings.PayPal.CurrencyCode,
                           Value = ShippingPrice.ToString()

                       },
                       Discount = new Money()
                       {
                           CurrencyCode = AppConst.Settings.PayPal.CurrencyCode,
                           Value = TotalDiscount.ToString()
                       }
                  }
               } ,
               Items = orderItems,



            }
         };

         return orderRequest;
      }

   }
}
