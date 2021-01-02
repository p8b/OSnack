using P8B.Core.CSharp.Attributes;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("Comments")]
   public class Comment
   {
      [Key]
      [DefaultValue(0)]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(500)")]
      [Required(ErrorMessage = "Description is Required")]
      public string Description { get; set; }

      [ForeignKey("OrderItemId")]
      public OrderItem OrderItem { get; set; }
      [Column(Order = 0)]
      public int OrderItemId { get; set; }

      [Column(TypeName = "nvarchar(200)")]
      [Required(ErrorMessage = "Name is Required")]
      public string Name { get; set; }

      public bool Show { get; set; }

      public DateTime Date { get; set; } = DateTime.UtcNow;

      [IntRange(ErrorMessage = "", MinValue = 0, MaxValue = 5)]
      public int Rate { get; set; }

      [ForeignKey("ProductId")]
      public Product Product { get; set; }
   }
}
