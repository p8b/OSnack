using Newtonsoft.Json;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using P8B.Core.CSharp.Attributes;
using OSnack.API.Extras.CustomTypes;
using Microsoft.AspNetCore.Authentication;
using OSnack.API.Database.ModelsDependencies;
using System.ComponentModel;

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

      [Required(ErrorMessage = "Category is Required \n")]
      public Category Category { get; set; }

      [InverseProperty("Product")]
      public NutritionalInfo NutritionalInfo { get; set; }

      [InverseProperty("Product")]
      public ICollection<Comment> Comments { get; set; }

      [InverseProperty("Product")]
      public ICollection<Score> Scores { get; set; }

      [NotMapped]
      public int AverageScore { get; set; }
   }
}