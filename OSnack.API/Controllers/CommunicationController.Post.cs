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
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class CommunicationController
   {
      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(string), StatusCodes.Status201Created)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      [HttpPost("Post/[action]")]
      public async Task<IActionResult> PostDispute([FromBody] Communication newContact)
      {
         try
         {

            if (!string.IsNullOrEmpty(newContact.Order_Id) &&
               (await _DbContext.Orders.SingleOrDefaultAsync(o => o.Id == newContact.Order_Id) == null))
            {
               CoreFunc.Error(ref ErrorsList, "Cannot find your order.");
               return UnprocessableEntity(ErrorsList);
            }

            var user = await _DbContext.Users.SingleOrDefaultAsync(u => u.Id == AppFunc.GetUserId(User));
            newContact.Email = user.Email;
            newContact.FullName = $"{user.FirstName} {user.Surname}";
            newContact.PhoneNumber = user.PhoneNumber;
            newContact.IsOpen = true;
            newContact.Order = await _DbContext.Orders.SingleOrDefaultAsync(o => o.Id == newContact.Order_Id);
            newContact.Type = ContactType.Dispute;
            newContact.Messages[0].IsCustomer = true;

            TryValidateModel(newContact);

            foreach (var key in ModelState.Keys)
            {
               if (key.StartsWith("User") || key.StartsWith("Messages") || key.StartsWith("Order") || key.StartsWith("OrderItem"))
                  ModelState.Remove(key);
            }

            if (!ModelState.IsValid)
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }


            await TryToSave(newContact, 0);
            /// return 201 created status with the new object
            /// and success message
            return Created("", $"Your message submitted.Contact Referense : {newContact.Id }");
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }



      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(string), StatusCodes.Status201Created)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Public)]  /// Ready For Test
      [HttpPost("Post/[action]")]
      public async Task<IActionResult> PostQuestion([FromBody] Communication newContact)
      {

         try
         {

            if (AppFunc.GetUserId(User) != 0)
            {
               var user = await _DbContext.Users.SingleOrDefaultAsync(u => u.Id == AppFunc.GetUserId(User));
               newContact.Email = user.Email;
               newContact.FullName = $"{user.FirstName} {user.Surname}";
               newContact.PhoneNumber = user.PhoneNumber;
            }
            newContact.IsOpen = true;
            newContact.Type = ContactType.Question;
            ModelState.Clear();
            TryValidateModel(newContact);

            foreach (var key in ModelState.Keys)
            {
               if (key.StartsWith("User") || key.StartsWith("Messages"))
                  ModelState.Remove(key);
            }

            if (!ModelState.IsValid)
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }


            await TryToSave(newContact, 0);
            /// return 201 created status with the new object
            /// and success message
            return Created("", $"Your message submitted.Contact Referense : {newContact.Id }");
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

      async Task<Communication> TryToSave(Communication contactData, int tryCount)
      {
         try
         {
            contactData.Id = $"{CoreFunc.StringGenerator(4, 4, 0, 4, 0)}-{CoreFunc.StringGenerator(4, 4, 0, 4, 0)}";
            await _DbContext.Communications.AddAsync(contactData).ConfigureAwait(false);
            if (contactData.Order != null)
            {
               _DbContext.Entry(contactData.Order).State = EntityState.Unchanged;
            }
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            return contactData;
         }
         catch (Exception ex)
         {
            _LoggingService.Log(Request.Path, AppLogType.Exception, new { contactData, exception = ex }, User);
            if (tryCount > 4)
            {
               throw ex;
            }
            return await TryToSave(contactData, tryCount++);

         }
      }
   }
}
