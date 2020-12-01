using P8B.Core.CSharp.Attributes;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("Score")]
   public class Score
   {
      [Key]
      public int Id { get; set; }

      [IntRange(ErrorMessage = "", MinValue = 0, MaxValue = 5)]
      public int Rate { get; set; }

      [ForeignKey("OrderItemId")]
      public OrderItem OrderItem { get; set; }

      [Column(Order = 0)]
      public int OrderItemId { get; set; }

      [ForeignKey("ProductId")]
      public Product Product { get; set; }
   }
}
