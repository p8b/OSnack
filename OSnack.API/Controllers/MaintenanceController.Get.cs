using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;

using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Attributes;
using P8B.Core.CSharp.Models;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class MaintenanceController
   {

      #region *** ***                                                 
      [MultiResultPropertyNames("maintenanceModeStatus", "isUserAllowedInMaintenance")]
      [ProducesResponseType(typeof(MultiResult<bool, bool>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]")]
      [Authorize(AppConst.AccessPolicies.Public)] /// Done  
      public async Task<IActionResult> Get()
      {
         try
         {
            User user = new User();
            bool maintenanceModeStatus = AppConst.Settings.MaintenanceModeStatus;
            bool isUserAllowedInMaintenance = false;

            if (_SignInManager.IsSignedIn(User))
               foreach (string policy in AppFunc.GetCurrentRequestPolicies(Request))
               {
                  AuthorizationResult authResult = await _AuthService.AuthorizeAsync(User, policy).ConfigureAwait(false);
                  if (authResult.Succeeded)
                  {
                     user = await _DbContext.Users
                        .Include(u => u.Role)
                        .Include(u => u.RegistrationMethod)
                        .FirstOrDefaultAsync(u => u.Id == AppFunc.GetUserId(User))
                        .ConfigureAwait(false);
                     break;
                  }
               }

            Request.Headers.TryGetValue("Origin", out StringValues OriginValue);
            if ((user.Role != null && (user.Role.AccessClaim == AppConst.AccessClaims.Admin
                                    || user.Role.AccessClaim == AppConst.AccessClaims.Manager))
              || AppConst.Settings.AppDomains.AdminApp.EqualCurrentCultureIgnoreCase(OriginValue))
               isUserAllowedInMaintenance = true;

            return Ok(new MultiResult<bool, bool>
              (maintenanceModeStatus, isUserAllowedInMaintenance
              , CoreFunc.GetCustomAttributeTypedArgument(ControllerContext)));
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
