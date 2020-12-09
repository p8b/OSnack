namespace OSnack.API.Controllers
{
   public partial class OrderController
   {

      /// <summary>
      ///     Create a new Order
      /// </summary>
      #region *** 201 Created, 400 BadRequest, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
      //[HttpPost("[action]")]
      //[Consumes(MediaTypeNames.Application.Json)]
      //[ProducesResponseType(StatusCodes.Status201Created)]
      //[ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      //[ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      //[ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      //[Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      //public async Task<IActionResult> Post([FromBody] oOrder newOrder)
      //{
      //   try
      //   {
      //      int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "UserId").Value, out int userId);

      //      /// if model validation failed
      //      if (!await _DbContext.Addresses.AsNoTracking().AnyAsync(a => a.Id == newOrder.Address.Id))
      //      {
      //         /// Add the error below to the error list and return bad request
      //         CoreFunc.Error(ref ErrorsList, "Address Required");
      //         /// return Unprocessable Entity with all the errors
      //         return UnprocessableEntity(ErrorsList);
      //      }
      //      ///// if model validation failed
      //      //if ((newOrder.DeliveryOption == DeliveryPriceOptions.Free && newOrder.TotalPrice < 30) && newOrder.Coupon.Type != CouponType.FreeDelivery)
      //      //{
      //      //   /// Add the error below to the error list and return bad request
      //      //   CoreFunc.Error(ref ErrorsList, $"You do not meet the free delivery requirement of £30");
      //      //   /// return Unprocessable Entity with all the errors
      //      //   return UnprocessableEntity(ErrorsList);
      //      //}
      //      ModelState.Clear();
      //      TryValidateModel(newOrder);


      //      foreach (var key in ModelState.Keys)
      //      {
      //         if (key.Contains("Payment") || key.Contains("Coupon") || key.Contains("OrderItems") || key.Contains("User"))
      //            ModelState.Remove(key);
      //      }
      //      /// if model validation failed
      //      if (!ModelState.IsValid)
      //      {
      //         CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
      //         /// return Unprocessable Entity with all the errors
      //         return UnprocessableEntity(ErrorsList);
      //      }

      //      bool recalculateTotalPriceAtTheEnd = false;
      //      if (!newOrder.Coupon.Code.Equals(""))
      //      {
      //         oCoupon currentCoupon = await _DbContext.Coupons.AsNoTracking()
      //                                    .SingleOrDefaultAsync(c => c.Code == newOrder.Coupon.Code).ConfigureAwait(false);
      //         newOrder.Coupon.MaxUseQuantity = currentCoupon.MaxUseQuantity - 1;

      //         switch (newOrder.Coupon.Type)
      //         {
      //            case CouponType.FreeDelivery:
      //               newOrder.DeliveryOption = DeliveryPriceOptions.Free;
      //               break;
      //            case CouponType.DiscountPrice:
      //               newOrder.TotalPrice -= newOrder.Coupon.DiscountAmount;
      //               break;
      //            case CouponType.PercentageOfTotal:
      //               recalculateTotalPriceAtTheEnd = true;
      //               break;
      //            default:
      //               break;
      //         }
      //      }
      //      newOrder.TotalPrice = AppConst.DeliveryOptions[(int)newOrder.DeliveryOption].Price;

      //      //foreach (var item in newOrder.OrderItems)
      //      //{
      //      //   oStoreProduct currentProduct = await _DbContext.StoreProducts
      //      //      .AsNoTracking()
      //      //      .SingleOrDefaultAsync(sp => sp.ProductId == item.StoreProduct.Product.Id
      //      //      && sp.StoreId == item.StoreProduct.Store.Id);
      //      //   item.StoreProduct.Quantity = currentProduct.Quantity - item.Quantity;
      //      //   newOrder.TotalPrice += decimal.Round(item.Quantity * item.StoreProduct.Product.Price, 2, MidpointRounding.AwayFromZero);
      //      //   item.StoreProduct.ProductId = item.StoreProduct.Product.Id;
      //      //   item.StoreProduct.StoreId = item.StoreProduct.Store.Id;
      //      //   _DbContext.Entry(item).State = EntityState.Added;
      //      //   _DbContext.Entry(item.StoreProduct).State = EntityState.Modified;
      //      //   _DbContext.Entry(item.StoreProduct.Product).State = EntityState.Detached;
      //      //   _DbContext.Entry(item.StoreProduct.Store).State = EntityState.Detached;
      //      //}

      //      if (recalculateTotalPriceAtTheEnd)
      //      {
      //         newOrder.TotalPrice -= decimal.Round((newOrder.Coupon.DiscountAmount * newOrder.TotalPrice) / 100, 2, MidpointRounding.AwayFromZero);
      //      }
      //      newOrder.Payment = new oPayment()
      //      {
      //         DateTime = DateTime.UtcNow,
      //         PaymentProvider = "Paypal",
      //         Reference = "123456789"
      //      };
      //      _DbContext.Entry(newOrder).State = EntityState.Added;
      //      /// Add the new Order to the EF context
      //      await _DbContext.Orders.AddAsync(newOrder).ConfigureAwait(false);
      //      _DbContext.Entry(newOrder.Address).State = EntityState.Detached;
      //      _DbContext.Entry(newOrder.Payment).State = EntityState.Added;
      //      if (newOrder.Coupon.Type == null)
      //         _DbContext.Entry(newOrder.Coupon).State = EntityState.Detached;
      //      else
      //         _DbContext.Entry(newOrder.Coupon).State = EntityState.Modified;
      //      /// save the changes to the data base
      //      await _DbContext.SaveChangesAsync().ConfigureAwait(false);

      //      /// return 201 created status with the new object
      //      /// and success message
      //      return Created("Success", newOrder.Id);
      //   }
      //   catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
      //   {
      //      /// Add the error below to the error list and return bad request
      //      CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
      //      return StatusCode(417, ErrorsList);
      //   }
      //}

   }
}
