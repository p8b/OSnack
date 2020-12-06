using Newtonsoft.Json;

using P8B.Core.CSharp.Attributes;

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OSnack.API.Database.Models
{
   public class NutritionalInfo
   {
      [Key]
      [DefaultValue(0)]
      public int Id { get; set; }

      public int PerGram { get; set; } = 100;

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n")]
      public decimal? EnergyKJ { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n")]
      public decimal? EnergyKcal { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n")]
      public decimal? Fat { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n")]
      public decimal? SaturateFat { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n")]
      public decimal? Carbohydrate { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n")]
      public decimal? carbohydrateSugar { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n")]
      public decimal? Fibre { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n")]
      public decimal? Protein { get; set; }

      [Column(TypeName = "decimal(5,2)")]
      [PositiveDecimalIncludingZero(ErrorMessage = "Must be positive number \n")]
      public decimal? Salt { get; set; }

      [JsonIgnore]
      [ForeignKey("ProductId")]
      [Required]
      public Product Product { get; set; }
   }
}
