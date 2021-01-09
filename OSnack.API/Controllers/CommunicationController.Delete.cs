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
      [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status404NotFound)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      #endregion
      [HttpDelete("[action]/{communicationId}")]
      [Authorize(AppConst.AccessPolicies.Secret)]
      /// Ready For Test
      public async Task<IActionResult> Delete(string communicationId)
      {
         try
         {
            Communication currentDeliveryOption = await _DbContext.Communications.SingleOrDefaultAsync(d => d.Id == communicationId)
                           .ConfigureAwait(false);
            if (currentDeliveryOption is null)
            {
               CoreFunc.Error(ref ErrorsList, "Communication not found");
               return NotFound(ErrorsList);
            }

            if (currentDeliveryOption.Type == Extras.CustomTypes.ContactType.Dispute)
            {
               /// extract the errors and return bad request containing the errors
               CoreFunc.Error(ref ErrorsList, "Dispute can't be delete.");
               return StatusCode(412, ErrorsList);
            }
            _DbContext.Communications.Remove(currentDeliveryOption);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            return Ok("Communication was deleted");
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(Communication), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status404NotFound)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      #endregion
      [HttpDelete("[action]/{communicationId}/{messageId}")]
      [Authorize(AppConst.AccessPolicies.Secret)]
      public async Task<IActionResult> DeleteMessage(string communicationId, int messageId)
      {
         try
         {
            Message currentMessage = await _DbContext.Messages.SingleOrDefaultAsync(m => m.Id == messageId)
                           .ConfigureAwait(false);

            if (currentMessage is null)
            {
               CoreFunc.Error(ref ErrorsList, "Message not found");
               return NotFound(ErrorsList);
            }

            if (currentMessage.IsCustomer)
            {
               CoreFunc.Error(ref ErrorsList, "Cannot delete customer message");
               return NotFound(ErrorsList);
            }

            _DbContext.Messages.Remove(currentMessage);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);


            Communication originalCommunication = await _DbContext.Communications
               .Include(c => c.Messages)
            .SingleOrDefaultAsync(c => c.Id.Equals(communicationId))
            .ConfigureAwait(false);

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
