using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("Orders")]
   public class oOrder
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

      [Column(TypeName = "nvarchar(500)")]
      [Required(ErrorMessage = "Address First Line is Required \n")]
      [StringLength(500, ErrorMessage = "Must be less than 500 Characters \n")]
      public string AddressFirstLine { get; set; }

      [Column(TypeName = "nvarchar(500)")]
      [StringLength(500, ErrorMessage = "Must be less than 500 Characters \n")]
      public string AddressSecondLine { get; set; }

      [Column(TypeName = "nvarchar(256)")]
      [Required(ErrorMessage = "Address City is Required \n")]
      [StringLength(256, ErrorMessage = "Must be less than 256 Characters \n")]
      public string AddressCity { get; set; }

      [Column(TypeName = "nvarchar(8)")]
      [Required(ErrorMessage = "Address Postcode is Required \n")]
      [StringLength(8, ErrorMessage = "Must be less than 8 Characters \n")]
      public string AddressPostcode { get; set; }

      [Required(ErrorMessage = "Payment is required \n")]
      [ForeignKey("PaymentId")]
      public oPayment Payment { get; set; }

      [ForeignKey("Code")]
      public oCoupon Coupon { get; set; }

      [InverseProperty("Order")]
      public ICollection<oOrderItem> OrderItems { get; set; }

   }
}
