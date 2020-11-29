using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OSnack.API.Database.ModelsDependencies
{
   public abstract class OrderAddressBase
   {

      [Column(TypeName = "nvarchar(200)")]
      [Required(ErrorMessage = "Name is Required \n")]
      [StringLength(200, ErrorMessage = "Must be less than 200 Characters \n")]
      public string Name { get; set; }

      [Column(TypeName = "nvarchar(400)")]
      [Required(ErrorMessage = "First Line is Required \n")]
      [StringLength(400, ErrorMessage = "Must be less than 400 Characters \n")]
      public string FirstLine { get; set; }

      [Column(TypeName = "nvarchar(300)")]
      [StringLength(400, ErrorMessage = "Must be less than 300 Characters \n")]
      public string SecondLine { get; set; }

      [Column(TypeName = "nvarchar(50)")]
      [Required(ErrorMessage = "City is Required \n")]
      [StringLength(50, ErrorMessage = "Must be less than 50 Characters \n")]
      public string City { get; set; }

      [Column(TypeName = "nvarchar(8)")]
      [Required(ErrorMessage = "Postcode is Required \n")]
      [StringLength(8, ErrorMessage = "Must be less than 8 Characters \n")]
      public string Postcode { get; set; }
   }
}
