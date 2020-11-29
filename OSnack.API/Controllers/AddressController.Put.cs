using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class AddressController
   {
      #region ******
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("[action]")]
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      public async Task<IActionResult> Put([FromBody] oAddress modifiedAddress)
      {
         try
         {
            if (modifiedAddress != null)
            {
               modifiedAddress.User = await _DbContext.Users.AsTracking().Include(u => u.Role)
                   .Include(u => u.RegistrationMethod).SingleOrDefaultAsync(u => u.Id == AppFunc.GetUserId(User));
            }
            ModelState.Clear();
            if (!TryValidateModel(modifiedAddress))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }

            _DbContext.Addresses.Update(modifiedAddress);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            return Ok(modifiedAddress);
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
      #region ******
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("Put/[action]")]
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      public async Task<IActionResult> SetDefault([FromBody] int addressId)
      {
         try
         {
            List<oAddress> addresses = await _DbContext.Addresses.AsTracking()
                    .Include(a => a.User)
                    .ThenInclude(u => u.Role)
                    .Include(a => a.User)
                    .ThenInclude(u => u.RegistrationMethod)
                    .Where(a => a.User.Id == AppFunc.GetUserId(User)).ToListAsync();
            if (addresses.SingleOrDefault(a => a.Id == addressId) != null)
            {
               foreach (var address in addresses)
               {
                  if (address.Id == addressId)
                     address.IsDefault = true;
                  else
                     address.IsDefault = false;
               }
            }

            _DbContext.Addresses.UpdateRange(addresses);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            return Ok();
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
