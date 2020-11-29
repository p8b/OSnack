using Newtonsoft.Json;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using P8B.Core.CSharp.Attributes;
using OSnack.API.Extras.CustomTypes;
using Microsoft.AspNetCore.Authentication;

namespace OSnack.API.Database.Models
{
   [Table("Products")]
   public class oProduct
   {
      [Key]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(256)")]
      [Required(ErrorMessage = "Name is Required \n")]
      [StringLength(100, ErrorMessage = "Must be less than 100 Characters \n")]
      public string Name { get; set; }

      [Column(TypeName = "nvarchar(256)")]
      [StringLength(256, ErrorMessage = "Must be less than 256 Characters \n")]
      public string Description { get; set; }

      [Display(Name = "Display Image")]
      [StringLength(50, ErrorMessage = "Must be less than 50 Characters \n")]
      public string ImagePath { get; set; }

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

      [Column(TypeName = "decimal(7,2)")]
      [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
      [Required(ErrorMessage = "Price is Required \n")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Price should not be negative. \n")]
      public decimal? Price { get; set; }

      [Required(ErrorMessage = "Unit Quantity is Required \n")]
      public int? UnitQuantity { get; set; }

      [Required(ErrorMessage = "Unit Type is Required \n")]
      public ProductUnitType UnitType { get; set; }

      [Required(ErrorMessage = "Category is Required \n")]
      public oCategory Category { get; set; }

      [InverseProperty("Product")]
      public oNutritionalInfo NutritionalInfo { get; set; }

      [InverseProperty("Product")]
      public ICollection<oComment> Comments { get; set; }

      [InverseProperty("Product")]
      public ICollection<oScore> Scores { get; set; }

      [NotMapped]
      public int AverageScore { get; set; }
   }
}