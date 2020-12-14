using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;
using OSnack.API.Extras.Paypal;

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
      ///     Update a modified Order
      /// </summary>
      #region *** ***
      [HttpPut("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(Order), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Secret)]

      /// Ready For Test     
      public async Task<IActionResult> Put([FromBody] Order modifiedOrder)
      {
         try
         {
            /// if model validation failed
            if (!TryValidateModel(modifiedOrder))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }

            ///TODO Change Statues Only Or Update ALl

            /// Update the current Order to the EF context
            _DbContext.Orders.Update(modifiedOrder);

            /// save the changes to the data base
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            /// return 200 OK (Update) status with the modified object
            /// and success message
            return Ok(modifiedOrder);
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Update a modified Order
      /// </summary>
      #region *** 200 OK, 304 NotModified,412 PreconditionFailed ,422 UnprocessableEntity, 417 ExpectationFailed***
      [HttpPut("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(Order), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Secret)]
      /// Ready For Test
      public async Task<IActionResult> PutOrderStatus([FromBody] Order modifiedOrder)
      {
         try
         {

            ///TODO Change Statues Only
            Order orginalOrder = await _DbContext.Orders.FindAsync(modifiedOrder.Id).ConfigureAwait(false);
            orginalOrder.Status = modifiedOrder.Status;
            /// Update the current Order to the EF context
            _DbContext.Orders.Update(orginalOrder);

            /// save the changes to the data base
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            /// return 200 OK (Update) status with the modified object
            /// and success message
            return Ok(orginalOrder);
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

      #region *** ***
      [HttpPut("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(Order), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status503ServiceUnavailable)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Secret)]
      public async Task<IActionResult> VarifyOrderPayment([FromBody] string payPalOrderID)
      {
         try
         {
            if (string.IsNullOrEmpty(payPalOrderID))
            {
               CoreFunc.Error(ref ErrorsList, "Cannot find your order.");
               return UnprocessableEntity(ErrorsList);
            }

            Order order = await _DbContext.Orders.AsTracking()
               .Include(o => o.Payment)
               .SingleOrDefaultAsync(o => o.Payment.Reference.Equals(payPalOrderID))
               .ConfigureAwait(false);

            if (order == null)
            {
               CoreFunc.Error(ref ErrorsList, "Order number is invalid.");
               return UnprocessableEntity(ErrorsList);
            }

            var request = new PayPalCheckoutSdk.Orders.OrdersCaptureRequest(order.Payment.Reference);
            request.Prefer("return=representation");
            request.RequestBody(new PayPalCheckoutSdk.Orders.OrderActionRequest());
            var response = await PayPalClient.client().Execute(request);

            var paypalOrder = response.Result<PayPalCheckoutSdk.Orders.Order>();
            if (!paypalOrder.Status.Equals("COMPLETE"))
            {
               CoreFunc.Error(ref ErrorsList, "Payment cannot be varified.");
               return UnprocessableEntity(ErrorsList);
            }

            order.Status = OrderStatusType.Hold;
            order.Payment.DateTime = DateTime.Parse(paypalOrder.UpdateTime);

            try
            {
               await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            }
            catch (Exception)
            {
               AppLog log = _LoggingService.Log(Request.Path, AppLogType.PaymentException, order, User);
               CoreFunc.Error(ref ErrorsList, $"There was a issue with your payment. Please get in touch with us referencing {log.Id} Id.");
               return StatusCode(503, ErrorsList);
            }
            return Ok();
         }
         catch (Exception ex)
         {

            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
