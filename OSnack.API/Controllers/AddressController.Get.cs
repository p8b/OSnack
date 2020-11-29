using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Extras;

using P8B.Core.CSharp;

using System;
using System.Linq;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
    public partial class AddressController : ControllerBase
    {
        #region *** ***
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
        #endregion
        [HttpGet("Get/[action]")]
        [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
        public async Task<IActionResult> All()
        {
            try
            {
                return Ok(await _DbContext.Addresses.
                    Where(t => t.User.Id == AppFunc.GetUserId(User)).ToListAsync());
            }
            catch (Exception)
            {
                CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
                return StatusCode(417, ErrorsList);
            }
        }
    }
}
