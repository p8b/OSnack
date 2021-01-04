using OSnack.API.Extras;
using P8B.Core.CSharp.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

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

      [Column(TypeName = "nvarchar(500)")]
      public string Reply { get; set; }

      [ForeignKey("OrderItemId")]
      public OrderItem OrderItem { get; set; }
      [Column(Order = 0)]
      public int OrderItemId { get; set; }

      [Column(TypeName = "nvarchar(200)")]
      [Required(ErrorMessage = "Name is Required")]
      public string Name { get; set; }

      public DateTime Date { get; set; } = DateTime.UtcNow;

      [IntRange(ErrorMessage = "", MinValue = 0, MaxValue = 5)]
      public int Rate { get; set; }

      [ForeignKey("ProductId")]
      public Product Product { get; set; }

      public async Task CencoredDescription()
      {
         string fileList = await File.ReadAllTextAsync(Path.Combine(@$"{Directory.GetCurrentDirectory()}\StaticFiles\list.txt")).ConfigureAwait(false);
         List<string> badWord = fileList.Split("\r\n").ToList();
         foreach (var word in Description.Split(" "))
         {
            if (badWord.Contains(word))
               Description = Description.Replace(word, AppFunc.GetCencoredWord(word.Length));
         }
      }
   }
}
