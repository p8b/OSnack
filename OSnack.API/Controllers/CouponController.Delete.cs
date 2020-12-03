using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;

using System;
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class CouponController
   {

      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(StatusCodes.Status404NotFound)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      #endregion
      [HttpDelete("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      public async Task<IActionResult> Delete([FromBody] Coupon coupon)
      {
         try
         {
            if (!await _DbContext.Coupons.AnyAsync(d => d.Code == coupon.Code)
                           .ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Coupon not found");
               return NotFound(ErrorsList);
            }

            if (await _DbContext.Orders.AnyAsync(c => c.Coupon.Code == coupon.Code)
                           .ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Coupon is in use by at least one Order.");
               return StatusCode(412, ErrorsList);
            }

            _DbContext.Coupons.Remove(coupon);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            return Ok($"Coupon '{coupon.Code}' was deleted");
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
