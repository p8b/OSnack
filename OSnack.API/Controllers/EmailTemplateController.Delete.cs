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
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class EmailTemplateController
   {
      #region *** ***
      [ProducesResponseType(typeof(EmailTemplate), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpDelete("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public async Task<IActionResult> Delete([FromBody] EmailTemplate emailTemplate)
      {
         try
         {
            EmailTemplate foundTemplate = await _DbContext.EmailTemplates.AsTracking().FirstOrDefaultAsync((et) => et.Id == emailTemplate.Id).ConfigureAwait(false);
            if (foundTemplate == null)
            {
               ErrorsList.Add(new Error("", "Template cannot be found."));
               return UnprocessableEntity(ErrorsList);
            }
            if (foundTemplate.Locked)
            {
               ErrorsList.Add(new Error("", "Template locked."));
               return UnprocessableEntity(ErrorsList);
            }
            if (foundTemplate.IsDefaultTemplate)
            {
               ErrorsList.Add(new Error("", "Cannot Delete Default Template."));
               return UnprocessableEntity(ErrorsList);
            }
            /// save files
            foundTemplate.DeleteFiles(WebHost.WebRootPath);

            _DbContext.Remove(foundTemplate);

            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            return Ok(emailTemplate);
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
