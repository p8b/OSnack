using Newtonsoft.Json;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{

   [Table("Messages")]
   public class Message
   {
      [Key]
      [DefaultValue(0)]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(100)")]
      [DataType(DataType.Date)]
      public DateTime Date { get; set; } = DateTime.UtcNow;

      [Required(ErrorMessage = "Communication is Required \n")]
      [JsonIgnore, ForeignKey("CommunicationId")]
      public Communication Communication { get; set; }

      [Column(TypeName = "nvarchar(200)")]
      [StringLength(200, ErrorMessage = "Must be less than 200 Characters \n")]
      public string FullName { get; set; }

      public string Body { get; set; }
   }
}
