using OSnack.API.Extras.Attributes;
using OSnack.API.Extras.CustomTypes;

using P8B.Core.CSharp.Attributes;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.ModelsDependencies
{
   public abstract class OrderProductBase
   {
      [EmailTemplateVariable(Name = "ProductName")]
      [Column(TypeName = "nvarchar(50)")]
      [Required(ErrorMessage = "Product Name is Required \n")]
      [StringLength(50, ErrorMessage = "Must be less than 50 Characters \n")]
      public string Name { get; set; }

      [EmailTemplateVariable(Name = "ProductPrice")]
      [Column(TypeName = "decimal(7,2)")]
      [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
      [Required(ErrorMessage = "Price is Required \n")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Price should not be negative. \n")]
      public decimal? Price { get; set; }

      [Required(ErrorMessage = "Unit Quantity is Required \n")]
      public int? UnitQuantity { get; set; }

      [Required(ErrorMessage = "Unit Type is Required \n")]
      public ProductUnitType UnitType { get; set; }

      [Display(Name = "Display Image")]
      [StringLength(50, ErrorMessage = "Must be less than 50 Characters \n")]
      public string ImagePath { get; set; }
   }
}
