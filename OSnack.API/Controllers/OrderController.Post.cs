using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;

using P8B.Core.CSharp;

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
      ///     Create a new Order
      /// </summary>
      #region *** 201 Created, 400 BadRequest, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(List<PayPalCheckoutSdk.Orders.PurchaseUnit>), StatusCodes.Status201Created)]
      [ProducesResponseType(typeof(System.Collections.Generic.List<P8B.Core.CSharp.Models.Error>), StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(typeof(System.Collections.Generic.List<P8B.Core.CSharp.Models.Error>), StatusCodes.Status422UnprocessableEntity)]
      #endregion
      [HttpPost("[action]")]
      [Authorize(AppConst.AccessPolicies.Official)]
      /// Ready For Test
      public async Task<IActionResult> Post([FromBody] Order newOrder)
      {
         try
         {
            Address currentAddress = await _DbContext.Addresses.AsTracking()
               .Include(a => a.User)
               .SingleOrDefaultAsync(a => a.Id == newOrder.Id && a.User.Id == AppFunc.GetUserId(User))
               .ConfigureAwait(false);

            if (currentAddress == null)
            {
               CoreFunc.Error(ref ErrorsList, "Address Required");
               return UnprocessableEntity(ErrorsList);
            }
            if (newOrder.DeliveryOption.Price == 0
               && newOrder.DeliveryOption.MinimumOrderTotal > newOrder.TotalPrice
               && newOrder.DeliveryOption.IsPremitive)
            {
               CoreFunc.Error(ref ErrorsList, $"You do not meet the free delivery requirement of £{newOrder.DeliveryOption.MinimumOrderTotal}");
               return UnprocessableEntity(ErrorsList);
            }


            newOrder.Name = currentAddress.Name;
            newOrder.FirstLine = currentAddress.FirstLine;
            newOrder.SecondLine = currentAddress.SecondLine;
            newOrder.City = currentAddress.City;
            newOrder.Postcode = currentAddress.Postcode;
            newOrder.DeliveryOption = await _DbContext.DeliveryOptions.AsTracking()
               .SingleOrDefaultAsync(a => a.Id == newOrder.DeliveryOption.Id)
               .ConfigureAwait(false);

            ModelState.Clear();
            TryValidateModel(newOrder);
            ModelState.Remove("Payment");
            ModelState.Remove("Coupon");

            if (!ModelState.IsValid)
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }

            //Check coupon
            if (newOrder.Coupon != null && !newOrder.Coupon.Code.Equals(""))
            {
               Coupon currentCoupon = await _DbContext.Coupons.AsTracking()
                              .SingleOrDefaultAsync(c => c.Code == newOrder.Coupon.Code)
                              .ConfigureAwait(false);
               if (currentCoupon == null || currentCoupon.MaxUseQuantity < 1 || currentCoupon.ExpiryDate < DateTime.UtcNow)
               {
                  _LoggingService.Log(Request.Path, AppLogType.OrderException,
                                    new { message = "Coupon Invalid", order = newOrder }, User);
                  CoreFunc.Error(ref ErrorsList, $"'{newOrder.Coupon.Code}' is invalid");
                  newOrder.Coupon = null;
                  return UnprocessableEntity(ErrorsList);
               }
               else
                  newOrder.Coupon = currentCoupon;
            }

            List<Product> productList = await _DbContext.Products
               .Include(p => p.Category)
               .Where(p => newOrder.OrderItems.Select(t => t.ProductId).ToList().Contains(p.Id))
               .ToListAsync()
               .ConfigureAwait(false);
            Product originalProduct;

            List<PayPalCheckoutSdk.Orders.Item> orderItems = new List<PayPalCheckoutSdk.Orders.Item>();
            List<OrderItem> checkedOrderItems = new List<OrderItem>();
            foreach (var orderItem in newOrder.OrderItems)
            {
               originalProduct = productList.SingleOrDefault(t => t.Id == orderItem.ProductId);
               if (orderItem.Price != originalProduct.Price)
               {
                  _LoggingService.Log(Request.Path, AppLogType.OrderException,
                                    new { message = "Product Price mismatch.", order = newOrder }, User);
                  CoreFunc.Error(ref ErrorsList, "Product Price mismatch");
                  return UnprocessableEntity(ErrorsList);
               }
               if (orderItem.Quantity > originalProduct.StockQuantity)
               {
                  CoreFunc.Error(ref ErrorsList, $"Product '{orderItem.Name}' is out of stock");
                  return UnprocessableEntity(ErrorsList);
               }
               newOrder.TotalItemPrice += (orderItem.Quantity * originalProduct.Price ?? 0);
               checkedOrderItems.Add(new OrderItem(originalProduct, orderItem.Quantity));
               orderItems.Add(new PayPalCheckoutSdk.Orders.Item()
               {
                  Name = originalProduct.Name,
                  Description = originalProduct.Description,
                  Quantity = orderItem.Quantity.ToString(),
                  UnitAmount = new PayPalCheckoutSdk.Orders.Money()
                  {
                     CurrencyCode = AppConst.Settings.PayPal.CurrencyCode,
                     Value = originalProduct.Price.ToString()
                  }
               });

            }

            newOrder.CalculateTotalPrice();

            var purchasUnit = await newOrder.ConvertToPayPalOrder(orderItems).ConfigureAwait(false);

            await _DbContext.Orders.AddAsync(newOrder).ConfigureAwait(false);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            return Created("Success", purchasUnit);
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

   }
}
