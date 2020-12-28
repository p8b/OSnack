using OSnack.API.Extras.CustomTypes;
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
      public string Id { get; set; }

      [Required(ErrorMessage = "Contact Type is Required \n")]
      public ContactType Type { get; set; }

      public bool IsOpen { get; set; }

      [DataType(DataType.EmailAddress, ErrorMessage = "Invalid Email \n")]
      [Required(ErrorMessage = "Email is Required \n")]
      [RegularExpression(@"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
       ErrorMessage = "Invalid Email \n")]
      public string Email { get; set; }

      [RegularExpression(@"^\+?(?:\d\s?){10,12}$", ErrorMessage = "Invalid UK Phone Number \n")]
      public string PhoneNumber { get; set; }

      [ForeignKey("OrderId")]
      public Order Order { get; set; }

      [InverseProperty("Communication")]
      public List<Message> Messages { get; set; }
   }

}
