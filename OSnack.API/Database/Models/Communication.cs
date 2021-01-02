using Newtonsoft.Json;
using OSnack.API.Extras.Attributes;
using OSnack.API.Extras.CustomTypes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{


   [Table("Communications")]
   public class Communication
   {
      [Key]
      [Column(TypeName = "nvarchar(9)")]
      [StringLength(9, ErrorMessage = "Must be less than 9 Characters \n")]
      [EmailTemplateVariable(Name = "DisputeId")]
      public string Id { get; set; }

      [Required(ErrorMessage = "Contact Type is Required \n")]
      public ContactType Type { get; set; }

      public bool IsOpen { get; set; }

      [Column(TypeName = "nvarchar(200)")]
      [StringLength(200, ErrorMessage = "Must be less than 200 Characters \n")]
      [EmailTemplateVariable(Name = "FullName")]
      public string FullName { get; set; }

      [DataType(DataType.EmailAddress, ErrorMessage = "Invalid Email \n")]
      [Required(ErrorMessage = "Email is Required \n")]
      [RegularExpression(@"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
       ErrorMessage = "Invalid Email \n")]
      public string Email { get; set; }

      [RegularExpression(@"^\+?(?:\d\s?){10,12}$", ErrorMessage = "Invalid UK Phone Number \n")]
      public string PhoneNumber { get; set; }

      [ForeignKey("OrderId")]
      [JsonIgnore]
      public Order Order { get; set; }

      [NotMapped]
      public string Order_Id { get; set; }

      [InverseProperty("Communication")]
      public List<Message> Messages { get; set; }

      public DateTime Date { get; set; } = DateTime.UtcNow;
   }

}
