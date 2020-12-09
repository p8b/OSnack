using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class EmailTemplateController
   {
      #region *** ***
      [ProducesResponseType(typeof(EmailTemplate), StatusCodes.Status201Created)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPost("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)] /// Done   
      public async Task<IActionResult> Post([FromBody] EmailTemplate emailTemplate)
      {
         try
         {
            if (!TryValidateModel(emailTemplate))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }

            if (!emailTemplate.ValidateHTMLServerVariables(ref ErrorsList))
               return UnprocessableEntity(ErrorsList);


            emailTemplate.IsDefaultTemplate = false;

            /// save files
            emailTemplate.SaveFilesToWWWRoot(WebHost.WebRootPath);

            _DbContext.EmailTemplates.Add(emailTemplate);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            return Created("", emailTemplate);
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
