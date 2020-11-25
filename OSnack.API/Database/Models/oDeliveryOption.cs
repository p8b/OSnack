using Microsoft.EntityFrameworkCore.Metadata.Internal;

using Newtonsoft.Json;

using OSnack.API.Database.Models;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Extras
{

   [Table("DeliveryOption")]
   public class oDeliveryOption
   {

      [Key]
      public int Id { get; set; }

      [StringLength(50, ErrorMessage = "Must be less than 50 Characters \n")]
      [Required(ErrorMessage = "Name Is Required \n")]
      public string Name { get; set; }


      [Column(TypeName = "decimal(7,2)")]
      [Required(ErrorMessage = "Price Is Required \n")]
      public decimal Price { get; set; }


      [Column(TypeName = "decimal(7,2)")]
      [Required(ErrorMessage = "Minimum Order Total Is Required \n")]
      public decimal MinimumOrderTotal { get; set; }

      [JsonIgnore]
      public ICollection<oOrder> Orders { get; set; }
   }
}
