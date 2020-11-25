using Newtonsoft.Json;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("Categories")]
   public class oCategory
   {
      [Key]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(256)")]
      [Required(ErrorMessage = "Name is Required \n")]
      [StringLength(256, ErrorMessage = "Must be less than 256 Characters \n")]
      public string Name { get; set; }

      [Display(Name = "Display Image")]
      public string ImagePath { get; set; }

      [Display(Name = "Original Display Image")]
      public string OriginalImagePath { get; set; }

      //[JsonIgnore]
      //[InverseProperty("Category")]
      //public ICollection<oProduct> Products { get; set; }

      [NotMapped]
      [Required(ErrorMessage = "Image is Required \n")]
      public string ImageBase64 { get; set; }

      [NotMapped]
      [Required(ErrorMessage = "Original Image is Required \n")]
      public string OriginalImageBase64 { get; set; }
   }
}