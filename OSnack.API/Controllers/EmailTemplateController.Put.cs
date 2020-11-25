using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;

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
      #region *** Response Types ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("Put/[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public async Task<IActionResult> UpdateDetails([FromBody] oEmailTemplate emailTemplate)
      {
         try
         {
            TryValidateModel(emailTemplate);
            ModelState.Remove("HTML");
            ModelState.Remove("Design");

            if (!ModelState.IsValid)
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }

            oEmailTemplate foundTemplate = await _DbContext.EmailTemplates
               .AsTracking()
               .Include(et => et.ServerVariables)
               .FirstOrDefaultAsync((et) => et.Id == emailTemplate.Id).ConfigureAwait(false);

            if (foundTemplate == null)
            {
               ErrorsList.Add(new Error("", "Template cannot be found."));
               return UnprocessableEntity(ErrorsList);
            }

            //  if (!emailTemplate.ValidateHTMLServerVariables(ref ErrorsList))
            //   return UnprocessableEntity(ErrorsList);

            //_DbContext.RemoveRange(foundTemplate.ServerVariables);
            //await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            foundTemplate.Name = emailTemplate.Name;
            foundTemplate.Subject = emailTemplate.Subject;
            foundTemplate.TokenUrlPath = emailTemplate.TokenUrlPath;
            // foundTemplate.ServerVariables = emailTemplate.ServerVariables;

            // ignore changing the lock status of the default template
            if (!await _DbContext.EmailTemplates
               .AnyAsync(et => et.IsDefaultTemplate && et.Id != emailTemplate.Id)
               .ConfigureAwait(false))
               foundTemplate.Locked = emailTemplate.Locked;


            await _DbContext.EmailTemplates.AddAsync(foundTemplate).ConfigureAwait(false);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            return Ok(emailTemplate);
         }
         catch (Exception ee) //ArgumentNullException
         {
            /// in the case any exceptions return the following error
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      #region *** Response Types ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("Put/[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public async Task<IActionResult> UpdateDesgin([FromBody] oEmailTemplate emailTemplate)
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
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);

            oEmailTemplate foundTemplate = await _DbContext.EmailTemplates.AsTracking().FirstOrDefaultAsync((et) => et.Id == emailTemplate.Id).ConfigureAwait(false);
            if (foundTemplate == null)
            {
               ErrorsList.Add(new Error("", "Template cannot be found."));
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }
            foundTemplate.PrepareHtml(WebHost.WebRootPath);
            if (foundTemplate.HTML != emailTemplate.HTML)
            {

               foundTemplate.HTML = emailTemplate.HTML;
               foundTemplate.Design = emailTemplate.Design;
               /// save files
               foundTemplate.SaveFilesToWWWRoot(WebHost.WebRootPath);

               /// save to db
               await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            }


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
