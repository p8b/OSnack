using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database;
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
   public partial class RoleController
   {

      /// <summary>
      /// Get all the Roles.
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]")]
      //[Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public async Task<IActionResult> Get()
      {
         try
         {
            /// return the list of All Roles
            return Ok(await _DbContext.Roles.ToListAsync().ConfigureAwait(false));
         }
         catch (Exception) //ArgumentNullException
         {
            /// in the case any exceptions return the following error
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

   }
}

