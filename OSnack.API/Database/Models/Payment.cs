using Newtonsoft.Json;

using OSnack.API.Extras.CustomTypes;

using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("Payments")]
   public class Payment
   {
      [Key]
      [DefaultValue(0)]
      public int Id { get; set; }

      [Required(ErrorMessage = "Provider is required \n")]
      public string PaymentProvider { get; set; }

      [Required(ErrorMessage = "Reference is required \n")]
      public string Reference { get; set; }

      [Required(ErrorMessage = "Payment Type is required \n")]
      public PaymentType Type { get; set; }

      public string Email { get; set; }

      [Required(ErrorMessage = "Date is required \n")]
      public DateTime DateTime { get; set; }

      public DateTime ExpireDate { get; set; }

      [Required(ErrorMessage = "Order is required \n")]
      [ForeignKey("OrderId")]
      [JsonIgnore]
      public Order Order { get; set; }
   }
}
