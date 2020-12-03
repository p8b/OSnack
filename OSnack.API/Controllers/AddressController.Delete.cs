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
using System.ComponentModel.DataAnnotations;
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class AddressController
   {
      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status404NotFound)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      #endregion
      [HttpDelete("[action]")]
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test 
      [ApiExplorerSettings(GroupName = AppConst.AccessPolicies.Secret)]
      public async Task<IActionResult> Delete([FromBody] Address address)
      {
         try
         {
            if (!await _DbContext.Addresses.AnyAsync(a => a.Id == address.Id).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Address not found");
               return NotFound(ErrorsList);
            }

            if (address.IsDefault == true)
            {
               CoreFunc.Error(ref ErrorsList, "You cannot delete your default address.");
               return StatusCode(412, ErrorsList);
            }

            _DbContext.Addresses.Remove(address);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            return Ok($"Address was deleted");
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
