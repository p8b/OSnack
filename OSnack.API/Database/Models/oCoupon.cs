using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Newtonsoft.Json;

using OSnack.API.Extras.CustomTypes;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;

namespace OSnack.API.Database.Models
{
   [Table("Coupons")]
   public class oCoupon
   {
      [Key]
      [StringLength(25, ErrorMessage = "Must be less than 25 Characters \n")]
      [Required(ErrorMessage = "Coupon Code Required \n")]
      public string Code { get; set; }

      [NotMapped]
      public string PendigCode { get; set; }

      [Required(ErrorMessage = "Coupon Type is Required \n")]
      public CouponType? Type { get; set; }

      public int MaxUseQuantity { get; set; }

      [Column(TypeName = "decimal(7,2)")]
      public decimal DiscountAmount { get; set; }

      [Column(TypeName = "nvarchar(50)")]
      [DataType(DataType.Date)]
      [Required(ErrorMessage = "Expiry Date is Required \n")]
      public DateTime ExpiryDate { get; set; }

      [JsonIgnore]
      public ICollection<oOrder> Orders { get; set; }

      public bool IsValid(ref List<Error> ErrorsList)
      {
         switch (this.Type)
         {
            case CouponType.FreeDelivery:
               this.DiscountAmount = 0;
               break;
            case CouponType.PercentageOfTotal:
               if (this.DiscountAmount > 100)
               {
                  CoreFunc.Error(ref ErrorsList, $"Discount Amount must be less than 100");
                  return false;
               }
               break;
            case CouponType.DiscountPrice:
               break;
            default:
               break;
         }


         return true;

      }
   }
}
