using OSnack.API.Database.ModelsDependencies;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("Orders")]
   public class oOrder : OrderAddressBase
   {
      [Key]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(100)")]
      [DataType(DataType.Date)]
      public DateTime Date { get; set; } = DateTime.UtcNow;

      [Required(ErrorMessage = "Status is required \n")]
      public OrderStatusType Status { get; set; }

      [Required(ErrorMessage = "Status is required \n")]
      public oDeliveryOption DeliveryOption { get; set; }

      [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
      [Column(TypeName = "decimal(7,2)")]
      public decimal TotalPrice { get; set; }

      [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
      [Column(TypeName = "decimal(7,2)")]
      public decimal DeliveryPrice { get; set; }

      [Required(ErrorMessage = "Address is required \n")]
      [ForeignKey("AddressId")]
      public oAddress Address { get; set; }

      [Required(ErrorMessage = "Payment is required \n")]
      [ForeignKey("PaymentId")]
      public oPayment Payment { get; set; }

      [ForeignKey("Code")]
      public oCoupon Coupon { get; set; }

      [InverseProperty("Order")]
      public ICollection<oOrderItem> OrderItems { get; set; }

   }
}
