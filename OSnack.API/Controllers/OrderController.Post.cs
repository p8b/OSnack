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
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class OrderController
   {
      #region *** ***
      [HttpPost("[action]/{paypalId}")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(Order), StatusCodes.Status201Created)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status503ServiceUnavailable)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Public)]
      public async Task<IActionResult> Post(string paypalId, [FromBody] Order orderData)
      {
         try
         {
            if (string.IsNullOrEmpty(paypalId))
            {
               CoreFunc.Error(ref ErrorsList, "Cannot find your order.");
               return UnprocessableEntity(ErrorsList);
            }

            orderData = await CheckOrderDetail(orderData).ConfigureAwait(false);
            if (orderData == null)
            {
               return UnprocessableEntity(ErrorsList);
            }
            orderData.User = _DbContext.Users.AsTracking().SingleOrDefault(u => u.Id == AppFunc.GetUserId(User));
            orderData.Payment = new Payment()
            {
               PaymentProvider = "PayPal",
               Reference = paypalId,
               DateTime = DateTime.UtcNow,
            };


            var request = new PayPalCheckoutSdk.Orders.OrdersCaptureRequest(paypalId);
            request.Prefer("return=representation");
            request.RequestBody(new PayPalCheckoutSdk.Orders.OrderActionRequest());
            var response = await PayPalClient.client().Execute(request);
            var paypalOrder = response.Result<PayPalCheckoutSdk.Orders.Order>();
            if (!paypalOrder.Status.Equals("COMPLETED"))
            {
               await _DbContext.SaveChangesAsync().ConfigureAwait(false);
               CoreFunc.Error(ref ErrorsList, "Payment cannot be varified.");
               return UnprocessableEntity(ErrorsList);
            }
            orderData.Status = OrderStatusType.InProgress;
            orderData.Payment.Reference = paypalOrder.PurchaseUnits.FirstOrDefault().Payments.Captures.FirstOrDefault().Id;
            orderData.Payment.DateTime = DateTime.Parse(paypalOrder.UpdateTime);
            orderData.Payment.Type = PaymentType.Complete;
            orderData.Payment.Email = paypalOrder.Payer.Email;


            var purchaseUnit = paypalOrder.PurchaseUnits.FirstOrDefault();
            orderData.Name = purchaseUnit.ShippingDetail.Name.FullName;
            orderData.FirstLine = purchaseUnit.ShippingDetail.AddressPortable.AddressLine1;
            orderData.SecondLine = purchaseUnit.ShippingDetail.AddressPortable.AddressLine2;
            if (purchaseUnit.ShippingDetail.AddressPortable.AdminArea1 != null)
               orderData.City = purchaseUnit.ShippingDetail.AddressPortable.AdminArea1;
            if (purchaseUnit.ShippingDetail.AddressPortable.AdminArea2 != null)
               orderData.City = purchaseUnit.ShippingDetail.AddressPortable.AdminArea2;
            orderData.Postcode = purchaseUnit.ShippingDetail.AddressPortable.PostalCode;

            orderData = await TryToSave(orderData, 1);

            return Created("Success", orderData);
         }
         catch (Exception ex)
         {

            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

      #region ***  ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(PayPalCheckoutSdk.Orders.Order), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      #endregion
      [HttpPost("[action]")]
      [Authorize(AppConst.AccessPolicies.Public)]
      public async Task<IActionResult> VerifyOrder([FromBody] Order newOrder)
      {
         try
         {
            newOrder = await CheckOrderDetail(newOrder).ConfigureAwait(false);
            if (newOrder == null)
            {
               return UnprocessableEntity(ErrorsList);
            }
            var paypalOrder = await newOrder.ConvertToPayPalOrder().ConfigureAwait(false);
            return Ok(paypalOrder);
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

      private async Task<Order> TryToSave(Order orderData, int tryCount)
      {

         try
         {
            orderData.Id = $"{CoreFunc.StringGenerator(3, 4, 0, 4, 0)}-{CoreFunc.StringGenerator(3, 4, 0, 4, 0)}";
            await _DbContext.Orders.AddAsync(orderData).ConfigureAwait(false);
            if (orderData.User != null)
            {
               foreach (Address address in orderData.User.Addresses)
               {
                  _DbContext.Entry(address).State = EntityState.Unchanged;
               }
               _DbContext.Entry(orderData.User).State = EntityState.Unchanged;
            }
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            return orderData;
         }
         catch (Exception ex)
         {
            _LoggingService.Log(Request.Path, AppLogType.OrderException, new { orderData, exception = ex }, User);
            if (tryCount > 4)
            {
               throw ex;
            }
            return await TryToSave(orderData, tryCount++);

         }
      }

      private async Task<Order> CheckOrderDetail(Order orderData)
      {


         if (orderData.DeliveryOption.Price == 0
            && orderData.DeliveryOption.MinimumOrderTotal > orderData.TotalPrice
            && orderData.DeliveryOption.IsPremitive)
         {
            CoreFunc.Error(ref ErrorsList, $"You do not meet the free delivery requirement of £{orderData.DeliveryOption.MinimumOrderTotal}");
            return null;
         }

         Address currentAddress = await _DbContext.Addresses.Include(a => a.User)
          .SingleOrDefaultAsync(a => a.Id == orderData.AddressId && a.User.Id == AppFunc.GetUserId(User));
         if (currentAddress != null)
         {
            orderData.Name = currentAddress.Name;
            orderData.FirstLine = currentAddress.FirstLine;
            orderData.SecondLine = currentAddress.SecondLine;
            orderData.City = currentAddress.City;
            orderData.Postcode = currentAddress.Postcode;
            orderData.User = currentAddress.User;
         }
         orderData.DeliveryOption = await _DbContext.DeliveryOptions.AsTracking()
            .SingleOrDefaultAsync(a => a.Id == orderData.DeliveryOption.Id)
            .ConfigureAwait(false);

         ModelState.Clear();
         TryValidateModel(orderData);
         foreach (var key in ModelState.Keys)
         {
            if (
                  (key.StartsWith("Payment") || key.StartsWith("Coupon") || key.StartsWith("OrderItems") || key.StartsWith("User"))
                  ||
                  (AppFunc.GetUserId(User) == 0 && currentAddress == null && (key.StartsWith("Name") || key.StartsWith("City") || key.StartsWith("Postcode") || key.StartsWith("FirstLine")))
               )
               ModelState.Remove(key);
         }
         if (!ModelState.IsValid)
         {
            CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
            return null;
         }



         List<Product> productList = await _DbContext.Products.AsTracking()
           .Include(p => p.Category)
           .Where(p => orderData.OrderItems.Select(t => t.ProductId).ToList().Contains(p.Id))
           .ToListAsync()
           .ConfigureAwait(false);
         Product originalProduct;
         List<OrderItem> CheckedOrderItems = new List<OrderItem>();
         orderData.TotalItemPrice = 0;
         foreach (var orderItem in orderData.OrderItems)
         {
            originalProduct = productList.SingleOrDefault(t => t.Id == orderItem.ProductId);
            if (originalProduct == null)
            {
               _LoggingService.Log(Request.Path, AppLogType.OrderException,
                              new { message = $"Product ({orderItem.Name}) Unavailable.", order = orderData }, User);
               CoreFunc.Error(ref ErrorsList, $"Product ({orderItem.Name}) Unavailable.");
               return null;
            }
            if (orderItem.Price != originalProduct.Price)
            {
               _LoggingService.Log(Request.Path, AppLogType.OrderException,
                                 new { message = "Product Price mismatch.", order = orderData }, User);
               CoreFunc.Error(ref ErrorsList, "Product Price mismatch");
               return null;
            }
            if (orderItem.Quantity > originalProduct.StockQuantity)
            {
               CoreFunc.Error(ref ErrorsList, $"Product '{orderItem.Name}' is out of stock");
               return null;
            }
            if (orderItem.Quantity == 0)
            {
               _LoggingService.Log(Request.Path, AppLogType.OrderException,
               new { message = "Product quantity can't be zero.", order = orderData }, User);
               CoreFunc.Error(ref ErrorsList, $"Product quantity can't be zero.");
               return null;
            }
            orderData.TotalItemPrice += (orderItem.Quantity * originalProduct.Price ?? 0);
            originalProduct.StockQuantity -= orderItem.Quantity;
            CheckedOrderItems.Add(new OrderItem(originalProduct, orderItem.Quantity));


         }

         //Check coupon
         if (orderData.Coupon != null && !string.IsNullOrEmpty(orderData.Coupon.Code))
         {
            Coupon currentCoupon = await _DbContext.Coupons.AsTracking()
                           .SingleOrDefaultAsync(c => c.Code == orderData.Coupon.Code)
                           .ConfigureAwait(false);
            if (currentCoupon == null || currentCoupon.MaxUseQuantity < 1 || currentCoupon.ExpiryDate < DateTime.UtcNow || orderData.TotalItemPrice < currentCoupon.MinimumOrderPrice)
            {
               _LoggingService.Log(Request.Path, AppLogType.OrderException,
                                 new { message = "Coupon Invalid", order = orderData }, User);
               CoreFunc.Error(ref ErrorsList, $"'{orderData.Coupon.Code}' is invalid");
               return null;
            }
            else
               orderData.Coupon = currentCoupon;
         }
         orderData.CalculateTotalPrice();
         return orderData;
      }
   }
}
