using Newtonsoft.Json;

using P8B.Core.CSharp;

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("RegistrationMethod")]
   public class oRegistrationMethod
   {
      [Key]
      [JsonIgnore]
      public int Id { get; set; }

      public string ExternalLinkedId { get; set; }

      [Required(ErrorMessage = "Registration type is required \n")]
      public RegistrationTypes Type { get; set; }

      [DataType(DataType.Date)]
      public DateTime RegisteredDate { get; set; } = DateTime.Now;

      [ForeignKey("UserId")]
      [JsonIgnore]
      public oUser User { get; set; }
   }
}
