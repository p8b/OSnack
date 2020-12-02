using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Newtonsoft.Json;

using OSnack.API.Database.Models;
using OSnack.API.Extras;
using OSnack.API.Extras.AppInterfaces;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class UserController
   {
      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("Put/[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      public async Task<IActionResult> UpdateUser([FromBody] User modifiedUser)
      {
         try
         {
            User user = await _DbContext.Users
               .AsTracking()
               .Include(u => u.Role)
               .Include(u => u.RegistrationMethod)
               .FirstOrDefaultAsync(u => u.Id == modifiedUser.Id)
               .ConfigureAwait(false);


            if (user == null)
            {
               CoreFunc.Error(ref ErrorsList, "User Not Found.");
               return StatusCode(412, ErrorsList);
            }

            modifiedUser.Role = await _DbContext.Roles.AsTracking().SingleOrDefaultAsync(r => r.Id == modifiedUser.Role.Id).ConfigureAwait(false);

            ModelState.Clear();
            /// Try to validate the model
            TryValidateModel(modifiedUser);

            /// remove the passwordHash since
            /// the password update gets handled by another method in this class
            ModelState.Remove("PasswordHash");
            if (!ModelState.IsValid)
            {
               /// extract the errors and return bad request containing the errors
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }

            /// update the user details with the new details
            user.FirstName = modifiedUser.FirstName;
            user.Surname = modifiedUser.Surname;
            if (user.RegistrationMethod.Type == RegistrationTypes.Application)
            {
               user.Email = modifiedUser.Email;
               user.NormalizedEmail = modifiedUser.Email.ToUpper();
            }
            user.PhoneNumber = modifiedUser.PhoneNumber;

            string oldAccessClaim = "";
            if (!user.Role.Equals(modifiedUser.Role))
            {
               oldAccessClaim = user.Role.AccessClaim;
               user.Role = modifiedUser.Role;
            }

            /// thus update user in the context
            _DbContext.Users.Update(user);
            /// save the changes to the database
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            if (!string.IsNullOrEmpty(oldAccessClaim))
            {
               IdentityResult removedClaimResult = await _UserManager.RemoveClaimAsync(user,
                  new Claim(AppConst.AccessClaims.Type, oldAccessClaim)
                  ).ConfigureAwait(false);

               if (removedClaimResult.Succeeded)
               {

                  IdentityResult addedClaimResult = await _UserManager.AddClaimAsync(user,
                     new Claim(AppConst.AccessClaims.Type, user.Role.AccessClaim)
                     ).ConfigureAwait(false);
               }
            }


            /// thus return 200 ok status with the updated object
            return Ok(user);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Update user current record
      /// </summary>
      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("Put/[action]")]
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      public async Task<IActionResult> UpdateCurrentUser([FromBody] UpdateCurrentUserData data)
      {
         try
         {
            /// find the current user details from the database
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "UserId").Value, out int userId);
            User user = await _DbContext.Users
               .Include(u => u.RegistrationMethod)
               .FirstOrDefaultAsync(u => u.Id == userId)
               .ConfigureAwait(false);

            /// If the user is not the currently signed in user
            if (user == null || data.User.Id != user.Id)
            {
               CoreFunc.Error(ref ErrorsList, "Information access is denied.");
               return UnprocessableEntity(ErrorsList);
            }

            ModelState.Clear();
            /// Try to validate the model
            TryValidateModel(data.User);
            /// remove the passwordHash since
            /// the password update gets handled by another method in this class
            ModelState.Remove("PasswordHash");
            if (!ModelState.IsValid)
            {
               /// extract the errors and return bad request containing the errors
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }

            if (user.RegistrationMethod.Type == RegistrationTypes.Application && !await _UserManager.CheckPasswordAsync(user, data.CurrentPassword).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Current Password is incorrect.");
               return StatusCode(412, ErrorsList);
            }

            /// update the user details with the new details
            user.FirstName = data.User.FirstName;
            user.Surname = data.User.Surname;
            if (user.RegistrationMethod.Type == RegistrationTypes.Application)
            {
               user.Email = data.User.Email;
               user.NormalizedEmail = data.User.Email.ToUpper();
            }
            user.PhoneNumber = data.User.PhoneNumber;
            /// thus update user in the context
            _DbContext.Users.Update(user);
            /// save the changes to the database
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            /// thus return 200 ok status with the updated object
            return Ok(user);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Check if the user exists then block the user
      /// </summary>
      #region ***  ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Secret)]
      [HttpPut("Put/[action]/{userId}/{lockoutEnabled}")]  /// Ready For Test
      public async Task<IActionResult> UserLockout(int userId, bool lockoutEnabled)
      {
         try
         {
            /// if the user with the same id is not found
            User user = await _DbContext.Users.FindAsync(userId).ConfigureAwait(false);
            if (user == null)
            {
               CoreFunc.Error(ref ErrorsList, "User not found");
               return StatusCode(412, ErrorsList);
            }
            user.LockoutEnabled = lockoutEnabled;
            /// update user in the context
            _DbContext.Users.Update(user);
            /// save the changes to the database
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            /// thus return 200 ok status with the updated object
            return Ok(user);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }


      #region ***  ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("Put/[action]")]
      public async Task<IActionResult> ConfirmEmail([FromBody] string pathName)
      {
         try
         {
            string tokenValue = "";

            for (int i = pathName.Length - 1; i >= 0; i--)
            {
               if (pathName[i] == '/')
                  i = -1;
               else
                  tokenValue = pathName[i] + tokenValue;
            }

            Token token = await _DbContext.Tokens
               .Include(t => t.User)
               .FirstOrDefaultAsync(t => t.Url.Contains(pathName) && t.Value.Equals(tokenValue))
               .ConfigureAwait(false);
            if (token == null || token.Type != Extras.CustomTypes.TokenTypes.ConfirmEmail)
            {
               ErrorsList.Add(new Error("0", "Invalid Request/Token."));
               return StatusCode(412, ErrorsList);
            }

            if (token.ExpiaryDateTime < DateTime.UtcNow)
            {
               ErrorsList.Add(new Error("0", "Token Expired"));
               return StatusCode(412, ErrorsList);
            }

            IdentityResult result = await _UserManager.ConfirmEmailAsync(token.User,
               await _UserManager.GenerateEmailConfirmationTokenAsync(token.User).ConfigureAwait(false))
               .ConfigureAwait(false);

            _DbContext.Entry(token.User).State = EntityState.Unchanged;
            _DbContext.Remove(entity: token);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            if (result.Succeeded)
            {
               return Ok();
            }
            else
            {
               ErrorsList.Add(new Error("0", "Unable to process your request."));
               return StatusCode(412, ErrorsList);
            }
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      [HttpPut("Put/[action]")]
      public async Task<IActionResult> UpdateCurrentUserPassword([FromBody] UpdateCurrentUserData data)
      {
         try
         {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "UserId").Value, out int userId);
            User user = _DbContext.Users.Find(userId);


            if (!await _UserManager.CheckPasswordAsync(user, data.CurrentPassword).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Current Password is incorrect.");
               return StatusCode(412, ErrorsList);
            }


            user.Password = data.User.Password;
            User result = await UpdatePassword(user).ConfigureAwait(false);
            if (result == null)
            {
               return StatusCode(412, ErrorsList);
            }
            return Ok(result);
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("Put/[action]")] /// Ready For Test
      public async Task<IActionResult> UpdatePasswordWithToken([FromBody] dynamic data)
      {
         try
         {
            string passwordString = data.password;
            string email = data.email;
            string pathName = data.pathName;
            bool justCheckToken = data.justCheckToken;

            string tokenValue = "";

            for (int i = pathName.Length - 1; i >= 0; i--)
            {
               if (pathName[i] == '/')
                  i = -1;
               else
                  tokenValue = pathName[i] + tokenValue;
            }

            Token token = await _DbContext.Tokens
               .Include(t => t.User)
               .SingleOrDefaultAsync(t => t.Value.Equals(tokenValue) && t.Url.Contains(pathName))
               .ConfigureAwait(false);


            if (token == null || token.Type != Extras.CustomTypes.TokenTypes.ChangePassword)
            {
               ErrorsList.Add(new Error("0", "Invalid Request/Token."));
               return StatusCode(412, ErrorsList);
            }

            if (token.ExpiaryDateTime < DateTime.UtcNow)
            {
               ErrorsList.Add(new Error("0", "Token Expired"));
               return StatusCode(412, ErrorsList);
            }

            if (justCheckToken)
               return Ok();


            if (!token.User.NormalizedEmail.Equals(email.ToUpper().Trim()))
            {
               ErrorsList.Add(new Error("Email", "Invalid Email."));
               return StatusCode(412, ErrorsList);
            }



            token.User.Password = passwordString;

            User result = await UpdatePassword(token.User).ConfigureAwait(false);

            if (result == null)
               return StatusCode(412, ErrorsList);

            if (!result.EmailConfirmed)
            {
               await _UserManager.ConfirmEmailAsync(result,
                  await _UserManager.GenerateEmailConfirmationTokenAsync(result).ConfigureAwait(false))
                  .ConfigureAwait(false);
            }
            //result.Role = token.User.Role;
            token.User = null;
            //_DbContext.Entry(token.User).State = EntityState.Unchanged;
            _DbContext.Remove(token);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            await _SignInManager.SignInAsync(result, false).ConfigureAwait(false);

            return Ok(result);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      private async Task<User> UpdatePassword(User selectedUser)
      {
         /// find the current user details from the database
         User userDetails = _DbContext.Users.Find(selectedUser.Id);
         if (userDetails == null)
         {
            CoreFunc.Error(ref ErrorsList, "User not found!");
            return null;
         }
         /// generate new password reset token
         string passResetToken = await _UserManager.GeneratePasswordResetTokenAsync(userDetails).ConfigureAwait(false);
         /// reset user's password
         IdentityResult result = await _UserManager.ResetPasswordAsync(
                     userDetails, passResetToken, selectedUser.Password).ConfigureAwait(false);
         /// if result is Failed
         if (!result.Succeeded)
         {
            foreach (var item in result.Errors)
               ErrorsList.Add(new Error(item.Code, item.Description));
            return null;
         }
         /// else the result is a success.
         return userDetails;
      }
   }
}
