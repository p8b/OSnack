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
      [HttpPut("Put/[action]")]
      public async Task<IActionResult> AddMessageOfficial([FromBody] Communication modifyCommunication)
         => await Addmessage(modifyCommunication, true);

      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(Communication), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      [HttpPut("Put/[action]")]
      public async Task<IActionResult> AddMessageSecret([FromBody] Communication modifyCommunication)
         => await Addmessage(modifyCommunication, false);

      private async Task<IActionResult> Addmessage(Communication modifyCommunication, bool IsCustomer)
      {
         try
         {
            var originalCommunication = await _DbContext.Communications.Include(c => c.Messages).SingleOrDefaultAsync(c => c.Id == modifyCommunication.Id);
            if (originalCommunication == null)
            {
               CoreFunc.Error(ref ErrorsList, "Dispute Not exists.");
               return StatusCode(412, ErrorsList);
            }

            if (!IsCustomer)
               originalCommunication.IsOpen = modifyCommunication.IsOpen;

            var newMessage = modifyCommunication.Messages.Find(m => m.Id == 0);
            if (!string.IsNullOrEmpty(newMessage.Body))
            {

               newMessage.IsCustomer = IsCustomer;
               originalCommunication.Messages.Add(newMessage);

            }
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
