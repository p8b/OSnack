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
      /// <summary>
      /// Delete email template
      /// </summary>
      #region *** Response Types ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
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
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }
            if (foundTemplate.Locked)
            {
               ErrorsList.Add(new Error("", "Template locked."));
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }     
            if (foundTemplate.IsDefaultTemplate)
            {
               ErrorsList.Add(new Error("", "Cannot Delete Default Template."));
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }
            /// save files
            foundTemplate.DeleteFiles(WebHost.WebRootPath);

            _DbContext.Remove(foundTemplate);

            /// save to db
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);


            /// return Ok with the object
            return Ok(emailTemplate);
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
