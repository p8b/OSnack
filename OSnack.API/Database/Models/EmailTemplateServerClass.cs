using Newtonsoft.Json;

using OSnack.API.Extras.CustomTypes;

using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("EmailTemplateServerClass")]
   public class EmailTemplateServerClass
   {

      [Key]
      [DefaultValue(0)]
      public int Id { get; set; }

      [Required]
      public EmailTemplateClassNames Value { get; set; }

      [NotMapped]
      public List<string> ClassProperties { get; set; }

      [JsonIgnore]
      public EmailTemplate EmailTemplate { get; set; }
   }
}
