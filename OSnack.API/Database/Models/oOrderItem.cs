using Newtonsoft.Json;

using OSnack.API.Extras.CustomTypes;

using P8B.Core.CSharp.Attributes;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("OrderItems")]
   public class oOrderItem
   {
      [Key]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(256)")]
      [Required(ErrorMessage = "Product Name is Required \n")]
      [StringLength(256, ErrorMessage = "Must be less than 256 Characters \n")]
      public string ProductName { get; set; }

      [Column(TypeName = "decimal(7,2)")]
      [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
      [Required(ErrorMessage = "Product Price is Required \n")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Price should not be negative. \n")]
      public decimal ProductPrice { get; set; }
      [Required(ErrorMessage = "Net/ Item Quantity is Required \n")]
      public int ProductNetQuantity { get; set; }

      [Required(ErrorMessage = "Unit Type is Required \n")]
      public ProductUnitType? ProductUnitType { get; set; }

      [Column(TypeName = "nvarchar(256)")]
      [Required(ErrorMessage = "Category Name is Required \n")]
      [StringLength(256, ErrorMessage = "Must be less than 256 Characters \n")]
      public string ProductCategoryName { get; set; }

      [Column(Order = 0)]
      public int? ProductId { get; set; }

      [ForeignKey("ProductId")]
      [JsonIgnore]
      public oProduct Product { get; set; }

      [Required(ErrorMessage = "Quantity is Required")]
      public int Quantity { get; set; }

      [Required(ErrorMessage = "Order is Required")]
      [ForeignKey("OrderId")]
      [JsonIgnore]
      public oOrder Order { get; set; }
   }
}