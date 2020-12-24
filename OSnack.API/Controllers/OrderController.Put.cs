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
using PayPalCheckoutSdk.Payments;
using System;
using System.Collections.Generic;
using System.Linq;
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


      #region *** ***
      [HttpPut("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(Order), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Secret)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesDefaultResponseType]
      /// Ready For Test
      public async Task<IActionResult> PutOrderStatus([FromBody] Order modifiedOrder)
      {
         try
         {

            Order originalOrder = await _DbContext.Orders.AsTracking()
                     .Include(o => o.Payment).AsTracking()
                     .Include(o => o.OrderItems)
                     .SingleOrDefaultAsync(o => o.Id == modifiedOrder.Id).ConfigureAwait(false);


            if (originalOrder == null)
            {
               /// extract the errors and return bad request containing the errors
               CoreFunc.Error(ref ErrorsList, "Order not exist");
               return StatusCode(412, ErrorsList);
            }

            if (!originalOrder.ChangeStatus(modifiedOrder.Status))
            {
               _LoggingService.Log(Request.Path, AppLogType.OrderException,
                        new { message = $"Order Status Mismatch.", originalOrder = originalOrder, modifiedOrder = modifiedOrder }, User);
               CoreFunc.Error(ref ErrorsList, "Order Status Mismatch.");
               return StatusCode(412, ErrorsList);
            }

            if (originalOrder.Status == OrderStatusType.Canceled)
            {
               try
               {
                  RefundRequest refundRequest = new RefundRequest()
                  {
                     Amount = new Money
                     {
                        CurrencyCode = AppConst.Settings.PayPal.CurrencyCode,
                        Value = originalOrder.TotalPrice.ToString("0.00")
                     },

                     NoteToPayer = modifiedOrder.Message
                  };
                  var request = new CapturesRefundRequest(originalOrder.Payment.Reference);
                  request.Prefer("return=representation");
                  request.RequestBody(refundRequest);
                  var response = await PayPalClient.client().Execute(request);
                  originalOrder.Payment.RefundAmount = originalOrder.TotalPrice;
                  originalOrder.Payment.Type = PaymentType.FullyRefunded;
                  originalOrder.Message = modifiedOrder.Message;
                  await backItemToProductQuantity(originalOrder);
               }
               catch (Exception ex)
               {
                  _LoggingService.Log(Request.Path, AppLogType.OrderException,
                      new { message = $"Refund Proccess Failed.", ex = ex, modifiedOrder = modifiedOrder }, User);
                  CoreFunc.Error(ref ErrorsList, "Refund Proccess Failed.");
                  return StatusCode(412, ErrorsList);
               }
            }
            if (originalOrder.Status == OrderStatusType.Confirmed)
               originalOrder.ShippingReference = modifiedOrder.ShippingReference;
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            return Ok(originalOrder);
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

      private async Task backItemToProductQuantity(Order order)
      {
         List<Product> productList = await _DbContext.Products.AsTracking()
           .Where(p => order.OrderItems.Select(t => t.ProductId).Contains(p.Id) == true)
           .ToListAsync();
         foreach (var product in productList)
         {
            product.StockQuantity += order.OrderItems.SingleOrDefault(o => o.ProductId == product.Id).Quantity;
         }
      }
   }
}
