using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace OSnack.API.Database.Models
{
   [Table("Payments")]
   public class oPayment
   {
      [Key]
      public int Id { get; set; }

      [Required(ErrorMessage = "Provider is required \n")]
      public string PaymentProvider { get; set; }

      [Required(ErrorMessage = "Reference is required \n")]
      public string Reference { get; set; }

      [Required(ErrorMessage = "Date is required \n")]
      public DateTime DateTime { get; set; }

      [Required(ErrorMessage = "Order is required \n")]
      [InverseProperty("Payment")]
      [JsonIgnore]
      public oOrder Order { get; set; }
   }
}
