using OSnack.API.Extras.CustomTypes;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("ServerVariablesForEmail")]
   public class oServerVariables
   {

      [Key]
      public int Id { get; set; }

      [Required]
      public EmailTemplateServerVariables EnumValue { get; set; }

      [Required]
      public string ReplacementValue { get; set; }

      public oServerVariables() { }
      public oServerVariables(EmailTemplateServerVariables enumValue)
      {
         EnumValue = enumValue;
         ReplacementValue = $"@@{enumValue}@@";
      }
   }
}