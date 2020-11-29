using Newtonsoft.Json;
using OSnack.API.Database.ModelsDependencies;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("Addresses")]
   public class oAddress : OrderAddressBase
   {
      [Key]
      public int Id { get; set; }

      public bool IsDefault { get; set; } = false;

      [Column(TypeName = "nvarchar(500)")]
      [StringLength(500, ErrorMessage = "Must be less than 500 Characters \n")]
      public string Instructions { get; set; }

      [Required(ErrorMessage = "User is Required \n")]
      [JsonIgnore]
      [ForeignKey("UserId")]
      public oUser User { get; set; }

      [InverseProperty("Address")]
      [JsonIgnore]
      public ICollection<oOrder> Orders { get; set; }

      [NotMapped]
      public int UserId { get; set; }
   }
}
