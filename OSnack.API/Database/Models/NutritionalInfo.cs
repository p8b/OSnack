using Newtonsoft.Json;

using P8B.Core.CSharp.Attributes;

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   public class NutritionalInfo
   {
      [Key]
      [DefaultValue(0)]
      public int Id { get; set; }

      public int PerGram { get; set; } = 100;

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n", AllowNull = true)]
      public decimal? EnergyKJ { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n", AllowNull = true)]
      public decimal? EnergyKcal { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n", AllowNull = true)]
      public decimal? Fat { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n", AllowNull = true)]
      public decimal? SaturateFat { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n", AllowNull = true)]
      public decimal? Carbohydrate { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n", AllowNull = true)]
      public decimal? carbohydrateSugar { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n", AllowNull = true)]
      public decimal? Fibre { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n", AllowNull = true)]
      public decimal? Protein { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n", AllowNull = true)]
      public decimal? Salt { get; set; }

      [JsonIgnore]
      [ForeignKey("ProductId")]
      [Required]
      public Product Product { get; set; }
   }
}
