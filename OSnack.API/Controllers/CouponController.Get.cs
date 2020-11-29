using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Extentions;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class CouponController
   {
      /// <summary>
      /// Search or get all the coupon
      /// search by Code or filter by type
      /// </summary>
      #region *** ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("Get/[action]/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{filterType}/{isSortAsce}/{sortName}")]
      [Authorize(AppConst.AccessPolicies.Secret)] /// Ready for test
      public async Task<IActionResult> Search(
          int selectedPage,
          int maxNumberPerItemsPage,
          string searchValue = "",
          string filterType = CoreConst.GetAllRecords,
          bool isSortAsce = true,
          string sortName = "Code")
      {
         try
         {
            int totalCount = await _AppDbContext.Coupons
                .Where(r => filterType.Equals(CoreConst.GetAllRecords) ?
                true : r.Type.Equals((CouponType)Enum.Parse(typeof(CouponType), filterType, true)))
                .CountAsync(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c.Code.Contains(searchValue))
                .ConfigureAwait(false);

            List<oCoupon> list = await _AppDbContext.Coupons
                     .Where(r => filterType.Equals(CoreConst.GetAllRecords) ? true : r.Type.Equals((CouponType)Enum.Parse(typeof(CouponType), filterType, true)))
                .OrderByDynamic(sortName, isSortAsce)
                .Where(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c.Code.Contains(searchValue))
                .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                .Take(maxNumberPerItemsPage)
                .ToListAsync()
                .ConfigureAwait(false);

            return Ok(new { list, totalCount });
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Check Coupon code validation
      /// </summary>
      #region *** ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      #endregion
      [HttpGet("Get/[action]/{couponCode?}")]
      [Authorize(AppConst.AccessPolicies.Official)] /// Ready for test
      public async Task<IActionResult> Validate(string couponCode)
      {
         try
         {
            oCoupon coupon = await _AppDbContext.Coupons.FindAsync(couponCode);

            if (coupon == null)
            {
               CoreFunc.Error(ref ErrorsList, "Code not found");
               return StatusCode(412, ErrorsList);
            }

            if (coupon.MaxUseQuantity == 0 || coupon.ExpiryDate < DateTime.UtcNow)
            {
               CoreFunc.Error(ref ErrorsList, "Coupon has expired");
               return StatusCode(412, ErrorsList);
            }

            return Ok(coupon);
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

   }
}
