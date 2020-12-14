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
            Address currentAddress = await _DbContext.Addresses.Include(a => a.User).AsTracking().SingleOrDefaultAsync(a => a.Id == newOrder.Address.Id).ConfigureAwait(false);
            if (currentAddress == null)
            {
               CoreFunc.Error(ref ErrorsList, "Address Required");
               return UnprocessableEntity(ErrorsList);
            }
            if (newOrder.DeliveryOption.Price == 0 && newOrder.DeliveryOption.MinimumOrderTotal > newOrder.TotalPrice && newOrder.DeliveryOption.IsPremitive)
            {
               CoreFunc.Error(ref ErrorsList, $"You do not meet the free delivery requirement of £{newOrder.DeliveryOption.MinimumOrderTotal}");
               return UnprocessableEntity(ErrorsList);
            }
            newOrder.City = newOrder.Address.City;
            newOrder.FirstLine = newOrder.Address.FirstLine;
            newOrder.SecondLine = newOrder.Address.SecondLine;
            newOrder.Name = newOrder.Address.Name;
            newOrder.Postcode = newOrder.Address.Postcode;
            ModelState.Clear();
            TryValidateModel(newOrder);

            foreach (var key in ModelState.Keys)
            {
               if (key.Contains("Payment") || key.Contains("Coupon") || key.Contains("OrderItems") || key.Contains("User"))
                  ModelState.Remove(key);
            }
            /// if model validation failed
            if (!ModelState.IsValid)
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }

            Order finalOrder = new Order()
            {
               Address = currentAddress,
               City = newOrder.Address.City,
               FirstLine = newOrder.Address.FirstLine,
               SecondLine = newOrder.Address.SecondLine,
               Name = newOrder.Address.Name,
               Postcode = newOrder.Address.Postcode,
               DeliveryOption = await _DbContext.DeliveryOptions.AsTracking().SingleOrDefaultAsync(a => a.Id == newOrder.DeliveryOption.Id).ConfigureAwait(false),
               OrderItems = new List<OrderItem>()
            };

            //Check coupon
            if (newOrder.Coupon != null && !newOrder.Coupon.Code.Equals(""))
            {
               Coupon currentCoupon = await _DbContext.Coupons.AsTracking()
                              .SingleOrDefaultAsync(c => c.Code == newOrder.Coupon.Code).ConfigureAwait(false);
               if (currentCoupon == null || currentCoupon.MaxUseQuantity < 1 || currentCoupon.ExpiryDate < DateTime.UtcNow)
               {
                  _LoggingService.Log(Request.Path, AppLogType.OrderException,
                                    new { message = "Coupon Invalid", order = newOrder }, User);
                  CoreFunc.Error(ref ErrorsList, $"'{newOrder.Coupon.Code}' is invalid");
                  newOrder.Coupon = null;
                  return UnprocessableEntity(ErrorsList);
               }
               else
                  finalOrder.Coupon = currentCoupon;
            }

            List<Product> productList = await _DbContext.Products.Include(p => p.Category).Where(p => newOrder.OrderItems.Select(t => t.ProductId).ToList().Contains(p.Id)).ToListAsync();
            Product originalProduct;

            List<PayPalCheckoutSdk.Orders.Item> orderItems = new List<PayPalCheckoutSdk.Orders.Item>();
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
               if (originalProduct.Price == null)
               {
                  CoreFunc.Error(ref ErrorsList, $"Product Price can't be zero");
                  return UnprocessableEntity(ErrorsList);
               }
               finalOrder.TotalItemPrice += (orderItem.Quantity * originalProduct.Price ?? 0);
               finalOrder.OrderItems.Add(new OrderItem()
               {
                  ProductId = originalProduct.Id,
                  Name = originalProduct.Name,
                  ProductCategoryName = originalProduct.Category.Name,
                  Price = originalProduct.Price,
                  Quantity = orderItem.Quantity,
                  UnitType = originalProduct.UnitType,
                  UnitQuantity = originalProduct.UnitQuantity,
                  ImagePath = originalProduct.ImagePath
               });
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


            finalOrder.CalculateTotalPrice();
            finalOrder.Payment = new Payment()
            {
               DateTime = DateTime.UtcNow,
               PaymentProvider = "Paypal",
               Reference = "123456789"
            };

            //await _DbContext.Orders.AddAsync(finalOrder).ConfigureAwait(false);
            //await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            var purchasUnit = await finalOrder.ConvertToPayPalOrder(orderItems).ConfigureAwait(false);


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
