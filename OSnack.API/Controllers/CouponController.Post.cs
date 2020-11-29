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
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPost("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      public async Task<IActionResult> Post([FromBody] oCoupon newCoupon)
      {
         try
         {
            if (!newCoupon.IsValid(ref ErrorsList))
            {
               return UnprocessableEntity(ErrorsList);
            }
            if (await _DbContext.Coupons.AnyAsync(c => c.Code == newCoupon.PendigCode)
               .ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Coupon Code already exists.");
               return StatusCode(412, ErrorsList);
            }
            newCoupon.Code = newCoupon.PendigCode;

            //ModelState.Clear();

            if (!TryValidateModel(newCoupon))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }

            await _DbContext.Coupons.AddAsync(newCoupon).ConfigureAwait(false);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            return Created("Success", newCoupon);
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
