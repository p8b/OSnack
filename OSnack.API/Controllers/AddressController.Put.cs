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
               modifiedAddress.User = await _AppDbContext.Users.AsTracking().Include(u => u.Role)
                   .Include(u => u.RegistrationMethod).SingleOrDefaultAsync(u => u.Id == AppFunc.GetUserId(User));
            }
            ModelState.Clear();
            if (!TryValidateModel(modifiedAddress))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }

            _AppDbContext.Addresses.Update(modifiedAddress);
            await _AppDbContext.SaveChangesAsync().ConfigureAwait(false);

            return Ok(modifiedAddress);
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
