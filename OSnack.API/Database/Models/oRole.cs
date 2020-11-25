using Newtonsoft.Json;

using OSnack.API.Extras.Attributes;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("Roles")]
   public class oRole
   {
      [Key]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(30)")]
      [Required(ErrorMessage = "Role Name is Required \n")]
      public string Name { get; set; }

      [Column(TypeName = "nvarchar(30)")]
      [Required(ErrorMessage = "Access Claim is Required \n")]
      //[JsonIgnore]
      [ValidateAccessClaim]
      public string AccessClaim { get; set; }

      [JsonIgnore]
      [InverseProperty("Role")]
      public ICollection<oUser> Users { get; set; }
   }
}
