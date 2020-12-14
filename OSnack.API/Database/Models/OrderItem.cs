using Newtonsoft.Json;

using OSnack.API.Database.ModelsDependencies;

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("OrderItems")]
   public class OrderItem : OrderProductBase
   {
      public OrderItem()
      {
      }

      public OrderItem(Product originalProduct, int quantity)
      {
         ProductId = originalProduct.Id;
         Name = originalProduct.Name;
         ProductCategoryName = originalProduct.Category.Name;
         Price = originalProduct.Price;
         Quantity = quantity;
         UnitType = originalProduct.UnitType;
         UnitQuantity = originalProduct.UnitQuantity;
         ImagePath = originalProduct.ImagePath;
      }

      [Key]
      [DefaultValue(0)]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(256)")]
      [Required(ErrorMessage = "Category Name is Required \n")]
      [StringLength(256, ErrorMessage = "Must be less than 256 Characters \n")]
      public string ProductCategoryName { get; set; }

      [ForeignKey("ProductId")]
      [JsonIgnore]
      public Product Product { get; set; }
      [Column(Order = 0)]
      public int? ProductId { get; set; }

      [Required(ErrorMessage = "Quantity is Required")]
      public int Quantity { get; set; }

      [Required(ErrorMessage = "Order is Required")]
      [ForeignKey("OrderId")]
      [JsonIgnore]
      public Order Order { get; set; }
   }
}
