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
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
        #endregion
        [HttpDelete("[action]")]
        [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
        public async Task<IActionResult> Delete([FromBody] oAddress address)
        {
            try
            {
                if (!await _AppDbContext.Addresses.AnyAsync(d => d.Id == address.Id).ConfigureAwait(false))
                {
                    CoreFunc.Error(ref ErrorsList, "Address not found");
                    return NotFound(ErrorsList);
                }

                _AppDbContext.Addresses.Remove(address);
                await _AppDbContext.SaveChangesAsync().ConfigureAwait(false);

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
