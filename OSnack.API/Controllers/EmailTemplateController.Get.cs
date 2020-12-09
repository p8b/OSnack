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
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class EmailTemplateController
   {
      #region *** ***
      [ProducesResponseType(typeof(List<EmailTemplate>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("Get/[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public async Task<IActionResult> All()
      {
         try
         {
            List<EmailTemplate> templateList = await _DbContext.EmailTemplates
               // .Include(et => et.ServerVariables)
               .OrderByDescending(et => et.Name)
               .ToListAsync().ConfigureAwait(false);

            EmailTemplate copyDefaultTemplate = null;
            foreach (EmailTemplate item in templateList)
            {
               if (item.IsDefaultTemplate)
                  copyDefaultTemplate = item;
               item.PrepareDesign(WebHost.WebRootPath);
               item.PrepareHtml(WebHost.WebRootPath);
            }

            if (copyDefaultTemplate != null)
            {
               templateList.Remove(copyDefaultTemplate);
               templateList = templateList.Prepend(copyDefaultTemplate).ToList();
            }
            return Ok(templateList);
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User)); ;
            return StatusCode(417, ErrorsList);
         }
      }

      #region *** ***
      [ProducesResponseType(typeof(MultiResult<EmailTemplate, EmailTemplate>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/{templateId}")]
      [Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public async Task<IActionResult> Get(int templateId)
      {
         try
         {
            var defaultTemplate = await _DbContext.EmailTemplates
               .Include(et => et.ServerVariables)
               .SingleOrDefaultAsync(et => et.IsDefaultTemplate).ConfigureAwait(false);
            var template = await _DbContext.EmailTemplates
               .Include(et => et.ServerVariables)
               .SingleOrDefaultAsync(et => et.Id == templateId).ConfigureAwait(false);

            defaultTemplate.PrepareDesign(WebHost.WebRootPath);
            template.PrepareDesign(WebHost.WebRootPath);

            return Ok(new MultiResult<EmailTemplate, EmailTemplate>(template, defaultTemplate));
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

      #region *** ***
      [ProducesResponseType(typeof(List<ServerVariables>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public IActionResult GetServerVariables()
      {
         try
         {
            var List = new List<ServerVariables>();

            List.Add(new ServerVariables(EmailTemplateServerVariables.ExpiaryDateTime));
            List.Add(new ServerVariables(EmailTemplateServerVariables.RegistrationMethod));
            List.Add(new ServerVariables(EmailTemplateServerVariables.Role));
            List.Add(new ServerVariables(EmailTemplateServerVariables.TokenUrl));
            List.Add(new ServerVariables(EmailTemplateServerVariables.UserName));

            return Ok(List);
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
