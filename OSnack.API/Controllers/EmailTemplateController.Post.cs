using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class EmailTemplateController
   {
      #region *** Response Types ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPost("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public async Task<IActionResult> Post([FromBody] EmailTemplate emailTemplate)
      {
         try
         {
            /// if model validation failed
            if (!TryValidateModel(emailTemplate))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }

            if (!emailTemplate.ValidateHTMLServerVariables(ref ErrorsList))
               return UnprocessableEntity(ErrorsList);


            emailTemplate.IsDefaultTemplate = false;

            /// save files
            emailTemplate.SaveFilesToWWWRoot(WebHost.WebRootPath);

            /// save to db
            _DbContext.EmailTemplates.Add(emailTemplate);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);


            /// return Ok with the object
            return Created("", emailTemplate);
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
