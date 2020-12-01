using Newtonsoft.Json;
using OSnack.API.Database.ModelsDependencies;
using OSnack.API.Extras.CustomTypes;

using P8B.Core.CSharp.Attributes;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("OrderItems")]
   public class OrderItem : OrderProductBase
   {
      [Key]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(256)")]
      [Required(ErrorMessage = "Category Name is Required \n")]
      [StringLength(256, ErrorMessage = "Must be less than 256 Characters \n")]
      public string ProductCategoryName { get; set; }

      [Column(Order = 0)]
      public int? ProductId { get; set; }

      [ForeignKey("ProductId")]
      [JsonIgnore]
      public Product Product { get; set; }

      [Required(ErrorMessage = "Quantity is Required")]
      public int Quantity { get; set; }

      [Required(ErrorMessage = "Order is Required")]
      [ForeignKey("OrderId")]
      [JsonIgnore]
      public Order Order { get; set; }
   }
}