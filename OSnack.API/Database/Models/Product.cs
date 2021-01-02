using Newtonsoft.Json;
using OSnack.API.Database.ModelsDependencies;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace OSnack.API.Database.Models
{
   [Table("Products")]
   public class Product : OrderProductBase
   {
      [Key]
      [DefaultValue(0)]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(256)")]
      [StringLength(256, ErrorMessage = "Must be less than 256 Characters \n")]
      public string Description { get; set; }

      [Display(Name = "Original Display Image")]
      [StringLength(50, ErrorMessage = "Must be less than 50 Characters \n")]
      public string OriginalImagePath { get; set; }

      [NotMapped]
      [Required(ErrorMessage = "Image is Required \n")]
      public string ImageBase64 { get; set; }

      [NotMapped]
      [Required(ErrorMessage = "Original Image is Required \n")]
      public string OriginalImageBase64 { get; set; }

      public bool Status { get; set; } = false;

      [Required(ErrorMessage = "Quantity is Required")]
      public int StockQuantity { get; set; }

      [Required(ErrorMessage = "Category is Required \n")]
      public Category Category { get; set; }

      [InverseProperty("Product")]
      public NutritionalInfo NutritionalInfo { get; set; }

      [InverseProperty("Product")]
      [JsonIgnore]

      public ICollection<Comment> Comments { get; set; }

      [NotMapped]
      public string Score { get { return Comments == null ? "" : Comments.ToList().Select(t => t.Rate).Average().ToString("0.00"); } }

      [NotMapped]
      public int AverageScore { get; set; }
   }
}
