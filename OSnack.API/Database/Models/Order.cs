using Newtonsoft.Json;

using OSnack.API.Database.ModelsDependencies;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;
using OSnack.API.Extras.Paypal;

using PayPalCheckoutSdk.Orders;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OSnack.API.Database.Models
{
   [Table("Orders")]
   public partial class Order : OrderAddressBase
   {
      [Key]
      public string Id { get; set; }

      [Column(TypeName = "nvarchar(100)")]
      [DataType(DataType.Date)]
      public DateTime Date { get; set; } = DateTime.UtcNow;

      [Required(ErrorMessage = "Status is required \n")]
      public OrderStatusType Status { get; set; }

      //[Required(ErrorMessage = "Status is required \n")]
      public DeliveryOption DeliveryOption { get; set; }


      [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
      [Column(TypeName = "decimal(7,2)")]
      public decimal DeliveryPrice { get; set; }

      /// <summary>
      /// <b>Not Mapped</b> Only used to pass address id from client side to server
      /// </summary>
      [Required(ErrorMessage = "Address Id is required \n")]
      [NotMapped]
      public int AddressId { get; set; }

      /// <summary>
      /// <b>Json Ignore</b>
      /// </summary>
      [ForeignKey("UserId")]
      [JsonIgnore]
      public User User { get; set; }

      [Column(Order = 0)]
      public int? UserId { get; set; }

      [DataType(DataType.EmailAddress, ErrorMessage = "Invalid Email \n")]
      [RegularExpression(@"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
         ErrorMessage = "Invalid Email \n")]
      public string Email { get; set; }

      [Required(ErrorMessage = "Payment is required \n")]
      [InverseProperty("Order")]
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

      internal void CalculateTotalPrice()
      {
         CalculateDiscount();
         ShippingPrice = DeliveryOption.Price;
         TotalPrice = TotalItemPrice + ShippingPrice - TotalDiscount;
      }
      internal void CalculateDiscount()
      {
         if (Coupon == null) return;
         if (!string.IsNullOrEmpty(Coupon.Code))
         {
            Coupon.MaxUseQuantity = Coupon.MaxUseQuantity - 1;

            switch (Coupon.Type)
            {
               case CouponType.FreeDelivery:
                  TotalDiscount += DeliveryOption.Price;
                  break;
               case CouponType.DiscountPrice:
                  TotalDiscount += Coupon.DiscountAmount;
                  break;
               case CouponType.PercentageOfTotal:
                  TotalDiscount += ((Coupon.DiscountAmount * TotalItemPrice) / 100);
                  break;
               default:
                  break;
            }
         }
      }
      internal async Task<PayPalCheckoutSdk.Orders.Order> ConvertToPayPalOrder()
      {

         OrderRequest orderRequest = new OrderRequest();

         orderRequest.CheckoutPaymentIntent = "CAPTURE";
         orderRequest.ApplicationContext = new ApplicationContext()
         {
            BrandName = AppConst.Settings.BrandName,
            UserAction = "CONTINUE",
            ShippingPreference = "SET_PROVIDED_ADDRESS",


         };

         orderRequest.PurchaseUnits = new List<PurchaseUnitRequest>()
         {
            new PurchaseUnitRequest (){
               ReferenceId =  "PUHF",
               Description = "Snacks and food products",
               CustomId = "CUST-HighFashions",
               SoftDescriptor = "Snacks",
               AmountWithBreakdown = new AmountWithBreakdown()
               {
                  CurrencyCode = AppConst.Settings.PayPal.CurrencyCode,
                  Value = TotalPrice.ToString("0.00"),
                  AmountBreakdown = new AmountBreakdown()
                  {
                       ItemTotal = new Money()
                       {
                           CurrencyCode = AppConst.Settings.PayPal.CurrencyCode,
                           Value = TotalItemPrice.ToString("0.00")
                       },
                       Shipping = new Money()
                       {
                           CurrencyCode = AppConst.Settings.PayPal.CurrencyCode,
                           Value = ShippingPrice.ToString("0.00")

                       },
                       Discount = new Money()
                       {
                           CurrencyCode = AppConst.Settings.PayPal.CurrencyCode,
                           Value = TotalDiscount.ToString("0.00")
                       }
                  }
               } ,
               Items = ConvertItem(),


            }
         };
         if (User != null)
         {

            orderRequest.PurchaseUnits.FirstOrDefault().ShippingDetail = new ShippingDetail()
            {
               Name = new Name()
               {
                  FullName = $"{User.FirstName} {User.Surname}"
               },
               AddressPortable = new AddressPortable()
               {

                  AddressLine1 = FirstLine,
                  AddressLine2 = SecondLine,
                  PostalCode = Postcode,
                  CountryCode = "GB",
                  AdminArea1 = "UK",
                  AdminArea2 = City
               },

            };
            orderRequest.Payer = new Payer()
            {
               Email = User.Email,
               Name = new Name()
               {
                  GivenName = User.FirstName,
                  Surname = User.Surname
               },
               AddressPortable = new AddressPortable()
               {
                  AddressLine1 = FirstLine,
                  AddressLine2 = SecondLine,
                  PostalCode = Postcode,
                  CountryCode = "GB",
                  AdminArea2 = City
               }
            };
         }
         else
         {
            orderRequest.ApplicationContext.ShippingPreference = "GET_FROM_FILE";
         }
         OrdersCreateRequest request = new OrdersCreateRequest();

         request.Prefer("return=representation");

         request.RequestBody(orderRequest);
         var response = await PayPalClient.client().Execute(request).ConfigureAwait(false);

         PayPalCheckoutSdk.Orders.Order paypalOrder = response.Result<PayPalCheckoutSdk.Orders.Order>();

         return paypalOrder;
      }

      internal List<Item> ConvertItem()
      {
         List<Item> orderItems = new List<Item>();
         foreach (var orderItem in OrderItems)
         {
            orderItems.Add(new PayPalCheckoutSdk.Orders.Item()
            {
               Name = orderItem.Name,
               Quantity = orderItem.Quantity.ToString(),
               UnitAmount = new PayPalCheckoutSdk.Orders.Money()
               {
                  CurrencyCode = AppConst.Settings.PayPal.CurrencyCode,
                  Value = orderItem.Price?.ToString("0.00")
               }
            });
         }
         return orderItems;
      }
   }
}
