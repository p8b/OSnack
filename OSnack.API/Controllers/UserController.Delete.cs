using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
   public partial class UserController
   {
      /// <summary>
      /// Delete a user (Manager & Admin)
      /// </summary>
      #region *** ***
      [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpDelete("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test 
      public async Task<IActionResult> Delete([FromBody] User thisUser)
      {
         try
         {
            /// if the User record with the same id is not found
            if (!_DbContext.Users.Any(u => u.Id == thisUser.Id))
            {
               CoreFunc.Error(ref ErrorsList, "User not found");
               return StatusCode(412, ErrorsList);
            }
            /// else the User is found
            /// now delete the user record
            _DbContext.Users.Remove(_DbContext.Users.Find(thisUser.Id));
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            /// return 200 OK status
            return Ok($"User ID ('{thisUser.Id}') was deleted");
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
