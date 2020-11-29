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
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      public async Task<IActionResult> Put([FromBody] oCoupon modifiedCoupon)
      {
         try
         {
            if (!TryValidateModel(modifiedCoupon))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }

            if (!await _AppDbContext.Coupons.AnyAsync(d =>
                        d.Code == modifiedCoupon.Code).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Coupon Not exists.");
               return StatusCode(412, ErrorsList);
            }

            if (await _AppDbContext.Coupons.AnyAsync(d => d.Code == modifiedCoupon.Code &&
                                                      d.Type != modifiedCoupon.Type).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Coupon Type Can't be Change.");
               return StatusCode(412, ErrorsList);
            }

            oCoupon originalCoupon = await _AppDbContext.Coupons.FindAsync(modifiedCoupon.Code).ConfigureAwait(false);
            originalCoupon.MaxUseQuantity = modifiedCoupon.MaxUseQuantity;
            originalCoupon.ExpiryDate = modifiedCoupon.ExpiryDate;
            originalCoupon.PendigCode = originalCoupon.Code;

            _AppDbContext.Coupons.Update(originalCoupon);
            await _AppDbContext.SaveChangesAsync().ConfigureAwait(false);

            return Ok(originalCoupon);
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
