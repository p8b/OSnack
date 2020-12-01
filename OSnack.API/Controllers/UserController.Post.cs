using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;

using OSnack.API.Database;
using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;
using P8B.UK.API.Services;

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
      private bool isUserCreated { get; set; }

      #region *** 201 Created, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPost("Post/[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      public async Task<IActionResult> CreateUser([FromBody] User newUser)
      {
         try
         {
            if (string.IsNullOrWhiteSpace(newUser.Password))
               newUser.Password = CoreFunc.StringGenerator(10, 3, 3, 2, 2);

            TryValidateModel(newUser);
            ModelState.Remove("PasswordHash");
            /// if model validation failed
            if (!ModelState.IsValid)
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }


            /// find the selected role object of the user
            newUser.Role = await _DbContext.Roles.AsTracking()
                .FirstOrDefaultAsync(r => r.Id == newUser.Role.Id).ConfigureAwait(false);

            IActionResult result = await PrivateCreateUser(newUser).ConfigureAwait(false);

            if (isUserCreated)
            {
               Request.Headers.TryGetValue("Origin", out StringValues Originvalue);
               await EmailService
                  .NewEmployeePasswordAsync(newUser, Originvalue)
                  .ConfigureAwait(false);
            }
            newUser.Password = string.Empty;

            return result;
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            if (isUserCreated)
            {
               _DbContext.Remove(newUser);
               await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            }
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Create a new Customer
      /// </summary>
      #region *** 201 Created, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPost("Post/[action]")]
      public async Task<IActionResult> CreateCustomer([FromBody] User newCustomer)
      {
         try
         {
            if (newCustomer.RegistrationMethod == null)
               newCustomer.RegistrationMethod = new RegistrationMethod
               {
                  Type = RegistrationTypes.Application
               };

            newCustomer.Role = await _DbContext.Roles.AsTracking()
                .SingleOrDefaultAsync(r => r.AccessClaim.Equals(AppConst.AccessClaims.Customer))
                .ConfigureAwait(false);

            IActionResult result = await PrivateCreateUser(newCustomer).ConfigureAwait(false);

            if (isUserCreated)
            {
               switch (newCustomer.RegistrationMethod.Type)
               {
                  case RegistrationTypes.Application:
                     Request.Headers.TryGetValue("Origin", out StringValues Originvalue);
                     await EmailService.EmailConfirmationAsync(newCustomer, Originvalue)
                        .ConfigureAwait(false);
                     break;
                  case RegistrationTypes.Facebook:
                  case RegistrationTypes.Google:

                     await EmailService.ExternalRegistrationWelcomeAsync(newCustomer)
                        .ConfigureAwait(false);
                     break;
               }
               await _SignInManager.SignInAsync(newCustomer, false).ConfigureAwait(false);
            }
            else
            {
               return result;
            }
            newCustomer.Password = string.Empty;

            return Created("", newCustomer);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            if (isUserCreated)
            {
               _DbContext.Remove(newCustomer);
               await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            }
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Create a Password reset token which is emailed to the intended user
      /// </summary>
      #region *** Response Types ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPost("Post/[action]")]
      public async Task<IActionResult> RequestPasswordReset([FromBody] string email)
      {
         try
         {
            /// If email parameter is empty
            /// return "unauthorized" response (stop code execution)
            if (string.IsNullOrWhiteSpace(email))
            {
               /// in the case any exceptions return the following error
               CoreFunc.Error(ref ErrorsList, "Email is required!");
               return StatusCode(412, ErrorsList);
            }

            /// Find the user with the provided email address
            User user = await _UserManager
                    .FindByEmailAsync(email).ConfigureAwait(false);

            /// if no user is found on the database
            if (user == null)
            {
               /// in the case any exceptions return the following error
               CoreFunc.Error(ref ErrorsList, "Email not registered");
               return StatusCode(412, ErrorsList);
            }
            RegistrationMethod registrationMethod = await _DbContext.RegistrationMethods.FirstOrDefaultAsync(rm => rm.User.Id == user.Id).ConfigureAwait(false);
            if (registrationMethod.Type != RegistrationTypes.Application)
            {
               /// in the case any exceptions return the following error
               CoreFunc.Error(ref ErrorsList, $"Your account is linked to your {registrationMethod.Type} account.");
               return StatusCode(412, ErrorsList);
            }

            /// Check if user's account is locked
            if (user.LockoutEnabled)
            {
               /// get the current lockout end dateTime
               var currentLockoutDate =
                   await _UserManager.GetLockoutEndDateAsync(user).ConfigureAwait(false);

               /// if the user's lockout is not expired (stop code execution)
               if (user.LockoutEnd > DateTimeOffset.UtcNow)
               {
                  /// in the case any exceptions return the following error
                  CoreFunc.Error(ref ErrorsList, string.Format("Account Locked for {0}"
                      , CoreFunc.CompareWithCurrentTime(user.LockoutEnd)));
                  return StatusCode(412, ErrorsList);
               }
               /// else lockout time has expired
               // disable user lockout
               await _UserManager.SetLockoutEnabledAsync(user, false).ConfigureAwait(false);
               await _UserManager.ResetAccessFailedCountAsync(user).ConfigureAwait(false);
            }
            Request.Headers.TryGetValue("Origin", out StringValues Originvalue);
            if (!await EmailService.PasswordResetAsync(user, Originvalue).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Unable to send email.");
               return StatusCode(417, ErrorsList);
            }
            return Created("", null);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      private async Task<IActionResult> PrivateCreateUser(User newUser)
      {
         try
         {
            newUser.PasswordHash = newUser.Password;
            if (newUser.RegistrationMethod.Type != RegistrationTypes.Application)
            {
               newUser.PasswordHash = CoreFunc.StringGenerator(40, 10, 10, 10, 10);
               newUser.EmailConfirmed = true;
            }
            ModelState.Clear();
            /// if model validation failed
            if (!TryValidateModel(newUser))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return bad request with all the errors
               return UnprocessableEntity(ErrorsList);
            }
            /// check the database to see if a user with the same email exists
            if (_DbContext.Users.Any(d => d.Email == newUser.Email))
            {
               /// extract the errors and return bad request containing the errors
               CoreFunc.Error(ref ErrorsList, "You are already registered.");
               return StatusCode(412, ErrorsList);
            }
            /// Create the new user
            IdentityResult newUserResult = await _UserManager.CreateAsync(newUser, newUser.PasswordHash)
                                                            .ConfigureAwait(false);
            /// If result failed
            if (!newUserResult.Succeeded)
            {
               /// Add the error below to the error list and return bad request
               foreach (var error in newUserResult.Errors)
               {
                  CoreFunc.Error(ref ErrorsList, error.Description, error.Code);
               }
               return StatusCode(417, ErrorsList);
            }
            /// else result is successful the try to add the access claim for the user
            IdentityResult addedClaimResult = await _UserManager.AddClaimAsync(
                    newUser,
                    new Claim(AppConst.AccessClaims.Type, newUser.Role.AccessClaim)
                ).ConfigureAwait(false);
            /// if claim failed to be created
            if (!addedClaimResult.Succeeded)
            {
               /// remove the user account and return appropriate error
               _DbContext.Users.Remove(newUser);
               await _DbContext.SaveChangesAsync().ConfigureAwait(false);
               CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
               return StatusCode(417, ErrorsList);
            }
            await _UserManager.SetLockoutEnabledAsync(newUser, false);
            isUserCreated = true;
            /// return 201 created status with the new object
            /// and success message
            return Created("Success", newUser);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
