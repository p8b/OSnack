using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class AuthenticationController
   {
      /// <summary>
      /// This method is used to get the antiforgery cookie. 
      /// The setup is done in the startup.cs
      /// </summary>
      [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
      [Authorize(AppConst.AccessPolicies.Public)]
      [HttpGet("Get/[action]")]
      public void AntiforgeryToken()
      {
         SetAntiforgeryCookie();
      }

      #region *** ***
      [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Official)]
      [HttpGet("Get/[action]")]
      public async Task<IActionResult> Logout()
      {
         try
         {
            /// try to sign-out the user and return ok
            await _SignInManager.SignOutAsync().ConfigureAwait(false);

            SetAntiforgeryCookie();

            return Ok();
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      #region ***  ***
      [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status401Unauthorized)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Official)]
      [HttpPost("Post/[action]")]
      public async Task<IActionResult> SilentOfficial() => await Silence().ConfigureAwait(false);

      #region ***  ***
      [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status401Unauthorized)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Secret)]
      [HttpPost("Post/[action]")]
      public async Task<IActionResult> SilentSecret() => await Silence().ConfigureAwait(false);

      private async Task<IActionResult> Silence()
      {
         try
         {
            var test = User.Claims
                .FirstOrDefault(c => c.Type == "UserId");
            int.TryParse(User.Claims
                .FirstOrDefault(c => c.Type == "UserId")?.Value, out int userId);

            User user = await _DbContext.Users.Include(u => u.Role)
              .Include(u => u.RegistrationMethod)
              .FirstOrDefaultAsync(u => u.Id == userId)
              .ConfigureAwait(false);

            SetAntiforgeryCookie();

            if (user == null)
            {
               CoreFunc.Error(ref ErrorsList, "Wrong Password");
               return Unauthorized(ErrorsList);
            }
            else
               return Ok(user);
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      private void SetAntiforgeryCookie()
      {
         CookieOptions antiForgeryCookieOptions;
         if (_WebHostingEnv.IsDevelopment())
         {
            antiForgeryCookieOptions = new CookieOptions()
            {
               HttpOnly = false,
               SameSite = SameSiteMode.Lax,
               Secure = true,
            };
         }
         else
         {
            antiForgeryCookieOptions = new CookieOptions()
            {
               HttpOnly = false,
               SameSite = SameSiteMode.Lax,
               Secure = true,
               Domain = AppConst.Settings.AntiforgeryCookieDomain
            };
         }
         AntiforgeryTokenSet tokens = _Antiforgery.GetAndStoreTokens(HttpContext);

         Response.Cookies.Append(
            "AF-TOKEN",
            tokens.RequestToken,
            antiForgeryCookieOptions);
      }
   }
}
