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
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class CommunicationController
   {
      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(Communication), StatusCodes.Status201Created)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Official)]
      [HttpPost("Post/[action]")]
      public async Task<IActionResult> PostDispute([FromBody] Communication newDispute)
      {
         try
         {
            if (string.IsNullOrWhiteSpace(newDispute.Messages.FirstOrDefault().Body))
            {
               CoreFunc.Error(ref ErrorsList, "Message is required.");
               return StatusCode(412, ErrorsList);
            }

            if (!string.IsNullOrEmpty(newDispute.Order_Id) &&
               (await _DbContext.Orders.SingleOrDefaultAsync(o => o.Id == newDispute.Order_Id) == null))
            {
               CoreFunc.Error(ref ErrorsList, "Cannot find your order.");
               return UnprocessableEntity(ErrorsList);
            }

            User user = await _DbContext.Users.SingleOrDefaultAsync(u => u.Id == AppFunc.GetUserId(User));
            newDispute.Email = user.Email;
            newDispute.FullName = $"{user.FirstName} {user.Surname}";
            newDispute.Status = true;
            newDispute.Order = await _DbContext.Orders.SingleOrDefaultAsync(o => o.Id == newDispute.Order_Id);
            newDispute.Type = ContactType.Dispute;
            newDispute.Messages[0].IsCustomer = true;

            TryValidateModel(newDispute);

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

            await _DbContext.Communications.AddAsync(newDispute).ConfigureAwait(false);
            _DbContext.Entry(newDispute.Order).State = EntityState.Unchanged;
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            await _EmailService.OrderDisputeAsync(newDispute.Order).ConfigureAwait(false);

            return Created("", newDispute);
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
            if (newContact.Messages.Count != 1)
            {
               /// extract the errors and return bad request containing the errors
               CoreFunc.Error(ref ErrorsList, "The message is empty.");
               return StatusCode(412, ErrorsList);
            }

            if (AppFunc.GetUserId(User) != 0)
            {
               var user = await _DbContext.Users.SingleOrDefaultAsync(u => u.Id == AppFunc.GetUserId(User));
               newContact.Email = user.Email;
               newContact.FullName = $"{user.FirstName} {user.Surname}";
            }
            newContact.Status = true;
            newContact.Type = ContactType.Question;
            newContact.Messages[0].IsCustomer = true;
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

            await _DbContext.Communications.AddAsync(newContact).ConfigureAwait(false);

            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            //   await _EmailService.EmailConfirmationAsync(orderData).ConfigureAwait(false);
            return Created("", $"Your message submitted.Contact Referense : {newContact.Id }");
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

   }
}
