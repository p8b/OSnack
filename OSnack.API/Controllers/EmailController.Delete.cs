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
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class EmailController
   {
      #region *** ***
      [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpDelete("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public async Task<IActionResult> DeleteTemplate([FromBody] EmailTemplate emailTemplate)
      {
         try
         {
            EmailTemplate foundTemplate = await _DbContext.EmailTemplates.AsTracking()
               .FirstOrDefaultAsync((et) => et.Id == emailTemplate.Id)
               .ConfigureAwait(false);
            if (foundTemplate == null)
            {
               ErrorsList.Add(new Error("", "Template cannot be found."));
               return UnprocessableEntity(ErrorsList);
            }

            foundTemplate.DeleteFiles(WebHost.WebRootPath);

            _DbContext.Remove(foundTemplate);

            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            return Ok($"Email Template ('{emailTemplate.Name}') was deleted");
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
