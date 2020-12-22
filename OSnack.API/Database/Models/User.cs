using Microsoft.AspNetCore.Identity;

using Newtonsoft.Json;

using OSnack.API.Extras.Attributes;

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.API.Database.Models
{
   [Table("Users")]
   public class User : IdentityUser<int>
   {
      [Key]
      [DefaultValue(0)]
      public override int Id { get; set; }
      public User() => UserName = $"p8b{new Random().Next(0, 99)}";

      [EmailTemplateVariable]
      [Column(TypeName = "nvarchar(256)")]
      [Required(ErrorMessage = "Name Required \n")]
      [StringLength(256, ErrorMessage = "Name must be less than 256 Characters \n")]
      public string FirstName { get; set; }

      [EmailTemplateVariable]
      [Column(TypeName = "nvarchar(256)")]
      [Required(ErrorMessage = "Surname Required \n")]
      [StringLength(256, ErrorMessage = "Surname must be less than 256 Characters \n")]
      public string Surname { get; set; }

      [Required(ErrorMessage = "Role Required \n")]
      [ForeignKey("RoleId")]
      public Role Role { get; set; }

      [DataType(DataType.Password)]
      [Required(ErrorMessage = "Password Required \n")]
      [JsonIgnore]
      public override string PasswordHash { get; set; }

      [RegularExpression(@"^\+?(?:\d\s?){10,12}$", ErrorMessage = "Invalid UK Phone Number \n")]
      public override string PhoneNumber { get; set; }

      [Required(ErrorMessage = "Registration Info Required")]
      [InverseProperty("User")]
      public RegistrationMethod RegistrationMethod { get; set; }

      [EmailTemplateVariable]
      [DataType(DataType.EmailAddress, ErrorMessage = "Invalid Email \n")]
      [Required(ErrorMessage = "Email is Required \n")]
      [RegularExpression(@"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
          ErrorMessage = "Invalid Email \n")]
      public override string Email { get; set; }

      [InverseProperty("User")]
      public ICollection<Address> Addresses { get; set; }

      [InverseProperty("User")]
      [JsonIgnore]
      public ICollection<Order> Orders { get; set; }

      [NotMapped]
      public string Password { get; set; }

      [NotMapped]
      public bool SubscribeNewsLetter { get; set; }
      [NotMapped]
      public int OrderLength { get; set; }
      [NotMapped]
      public bool HasOrder { get; set; }

      #region **** JsonIgnore extra properties and sensitive properties ****
      [JsonIgnore]
      public override DateTimeOffset? LockoutEnd { get; set; }
      [JsonIgnore]
      public override bool TwoFactorEnabled { get; set; }
      [JsonIgnore]
      public override bool PhoneNumberConfirmed { get; set; }
      [JsonIgnore]
      public override string ConcurrencyStamp { get; set; }
      [JsonIgnore]
      public override string SecurityStamp { get; set; }
      [JsonIgnore]
      public override string NormalizedEmail { get; set; }
      [JsonIgnore]
      [NotMapped]
      public override string NormalizedUserName { get; set; }
      [JsonIgnore]
      [NotMapped]
      public override string UserName { get; set; }
      [JsonIgnore]
      public override bool LockoutEnabled { get; set; }
      [JsonIgnore]
      public override int AccessFailedCount { get; set; }
      #endregion
   }
}
