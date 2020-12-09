using Newtonsoft.Json;

using OSnack.API.Extras.CustomTypes;

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("ServerVariablesForEmail")]
   public class ServerVariables
   {

      [Key]
      [DefaultValue(0)]
      public int Id { get; set; }

      [Required]
      public EmailTemplateServerVariables EnumValue { get; set; }

      [Required]
      public string ReplacementValue { get; set; }

      [JsonIgnore]
      public EmailTemplate EmailTemplate { get; set; }
      public ServerVariables() { }
      public ServerVariables(EmailTemplateServerVariables enumValue)
      {
         EnumValue = enumValue;
         ReplacementValue = $"@@{enumValue}@@";
      }
   }
}
