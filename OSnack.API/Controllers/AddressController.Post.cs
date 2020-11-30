using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;
using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class AddressController
   {
      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(oAddress), StatusCodes.Status201Created)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPost("[action]")]
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      public async Task<IActionResult> Post([FromBody] oAddress newAddress)
      {
         try
         {
            if (newAddress != null)
            {
               newAddress.User = await _DbContext.Users.AsTracking().Include(u => u.Role)
                  .Include(u => u.RegistrationMethod)
                   .SingleOrDefaultAsync(u => u.Id == AppFunc.GetUserId(User));
            }
            ModelState.Clear();
            if (!TryValidateModel(newAddress))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }

            if (!await _DbContext.Addresses.AnyAsync(a => a.User.Id == AppFunc.GetUserId(User)))
            {
               newAddress.IsDefault = true;
            }

            await _DbContext.Addresses.AddAsync(newAddress).ConfigureAwait(false);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            return Created("Success", newAddress);
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
