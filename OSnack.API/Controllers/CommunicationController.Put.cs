using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;

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
      [ProducesResponseType(typeof(Communication), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      [HttpPut("Put/[action]/{communicationId}/{messageBody}")]
      public async Task<IActionResult> PutOfficial(string communicationId, string messageBody)
         => await Update(communicationId, true, messageBody);

      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(Communication), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      [HttpPut("Put/[action]/{communicationId}/{messageBody}/{status}")]
      public async Task<IActionResult> PutSecret(string communicationId, string messageBody, bool status)
         => await Update(communicationId, false, messageBody, status);

      private async Task<IActionResult> Update(string communicationId, bool isCustomer, string messageBody, bool status = false)
      {
         try
         {
            var originalCommunication = await _DbContext.Communications.Include(c => c.Messages).SingleOrDefaultAsync(c => c.Id == communicationId);
            if (originalCommunication is null)
            {
               CoreFunc.Error(ref ErrorsList, "Dispute Not exists.");
               return StatusCode(412, ErrorsList);
            }

            if (!isCustomer)
               originalCommunication.Status = status;


            if (string.IsNullOrWhiteSpace(messageBody) && originalCommunication.Status)
            {
               /// extract the errors and return bad request containing the errors
               CoreFunc.Error(ref ErrorsList, "Message is required.");
               return StatusCode(412, ErrorsList);
            }

            originalCommunication.Messages.Add(
               new Message()
               {
                  IsCustomer = isCustomer,
                  Body = messageBody
               });

            ModelState.Clear();
            TryValidateModel(originalCommunication);

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

            _DbContext.Communications.Update(originalCommunication);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            /// return 201 created status with the new object
            /// and success message
            return Ok(originalCommunication);
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }


   }
}
