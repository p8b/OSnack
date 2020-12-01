using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("Comments")]
   public class Comment
   {
      [Key]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(500)")]
      [Required(ErrorMessage = "* Required")]
      public string Description { get; set; }

      [ForeignKey("OrderItemId")]
      public OrderItem OrderItem { get; set; }
      [Column(Order = 0)]
      public int OrderItemId { get; set; }

      [ForeignKey("ProductId")]
      public Product Product { get; set; }
   }
}
