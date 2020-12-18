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
   public partial class OrderController
   {
      /// <summary>
      /// Delete Order
      /// </summary>
      #region *** 200 OK,417 ExpectationFailed, 400 BadRequest,404 NotFound,412 PreconditionFailed ***
      [HttpDelete("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status404NotFound)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Secret)]
      /// Ready For Test 
      public async Task<IActionResult> Delete([FromBody] Order order)
      {
         try
         {
            /// if the Order record with the same id is not found
            //if (!await _DbContext.Categories.AnyAsync(d => d.Id == order.Id).ConfigureAwait(false))
            //{
            //   CoreFunc.Error(ref ErrorsList, "Order not found");
            //   return NotFound(ErrorsList);
            //}

            /// now delete the Order record
            // _DbContext.Orders.Remove(order);
            /// save the changes to the database
            /// await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            /// return 200 OK status
            return Ok($"Order '{order.Id}' was deleted");
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
