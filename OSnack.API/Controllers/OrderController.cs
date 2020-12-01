using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database;
using OSnack.API.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using P8B.Core.CSharp.Models;
using P8B.Core.CSharp;
using OSnack.API.Extras.CustomTypes;
using P8B.Core.CSharp.Extentions;
using OSnack.API.Extras;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   public class OrderController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }
      private List<Error> ErrorsList = new List<Error>();

      /// <summary>
      ///     Class Constructor. Set the local properties
      /// </summary>
      /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
      public OrderController(OSnackDbContext db) => _DbContext = db;


      /// <summary>
      /// Used to get a list of all Order with OrderItems
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{filterStatus}/{isSortAsce}/{sortName}")]
      // [Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public async Task<IActionResult> Get(
          int selectedPage,
          int maxNumberPerItemsPage,
          string searchValue = "",
          string filterStatus = CoreConst.GetAllRecords,
          bool isSortAsce = true,
          string sortName = "Code")
      {
         try
         {
            int totalCount = await _DbContext.Orders
                .CountAsync(r => filterStatus.Equals(CoreConst.GetAllRecords) ? true : r.Status.Equals((OrderStatusType)Enum.Parse(typeof(OrderStatusType), filterStatus, true)))
                //.CountAsync(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c. .Contains(searchValue))
                .ConfigureAwait(false);

            List<Order> list = await _DbContext.Orders
                     .Where(r => filterStatus.Equals(CoreConst.GetAllRecords) ? true : r.Status.Equals((OrderStatusType)Enum.Parse(typeof(OrderStatusType), filterStatus, true)))
                .OrderByDynamic(sortName, isSortAsce)
                // .Where(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c.Code.Contains(searchValue))
                .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                .Take(maxNumberPerItemsPage)
                .Include(o => o.OrderItems)
                //.ThenInclude(i => i.StoreProduct)
                .ThenInclude(sp => sp.Product)
                .ThenInclude(p => p.Category)
                .Include(o => o.OrderItems)
                //.ThenInclude(i => i.StoreProduct)
                //  .ThenInclude(sp => sp.Store)
                .Include(o => o.Address)
                .Include(o => o.Coupon)
                .Include(o => o.Payment)
                .ToListAsync()
                .ConfigureAwait(false);
            /// return the list of Categories
            return Ok(new { list, totalCount });
         }
         catch (Exception) //ArgumentNullException
         {
            /// in the case any exceptions return the following error
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Used to get a list of all Order with OrderItems
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/MyOrder/{selectedPage}/{maxNumberPerItemsPage}/{filterStatus}/{isSortAsce}/{sortName}")]
      [Authorize(AppConst.AccessPolicies.Official)] /// Done
      public async Task<IActionResult> Get(
          int selectedPage,
          int maxNumberPerItemsPage,
          string filterStatus = CoreConst.GetAllRecords,
          bool isSortAsce = true,
          string sortName = "Code")
      {
         try
         {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "UserId").Value, out int userId);

            int totalCount = await _DbContext.Orders
               .Include(o => o.Address)
               .Where(o => o.Address.UserId == userId)
                .CountAsync(r => filterStatus.Equals(CoreConst.GetAllRecords) ? true : r.Status.Equals((OrderStatusType)Enum.Parse(typeof(OrderStatusType), filterStatus, true)))
                //.CountAsync(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c. .Contains(searchValue))
                .ConfigureAwait(false);

            List<Order> list = await _DbContext.Orders
               .Include(o => o.Address)
               .Where(o => o.Address.UserId == userId)
                .Where(r => filterStatus.Equals(CoreConst.GetAllRecords) ? true : r.Status.Equals((OrderStatusType)Enum.Parse(typeof(OrderStatusType), filterStatus, true)))
                .OrderByDynamic(sortName, isSortAsce)
                // .Where(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c.Code.Contains(searchValue))
                .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                .Take(maxNumberPerItemsPage)
                .Include(o => o.OrderItems)
                //.ThenInclude(i => i.StoreProduct)
                .ThenInclude(sp => sp.Product)
                .ThenInclude(p => p.Category)
                .Include(o => o.OrderItems)
                //.ThenInclude(i => i.StoreProduct)
                //   .ThenInclude(sp => sp.Store)
                .Include(o => o.Coupon)
                .Include(o => o.Payment)
                .ToListAsync()
                .ConfigureAwait(false);
            /// return the list of Categories
            return Ok(new { list, totalCount });
         }
         catch (Exception) //ArgumentNullException
         {
            /// in the case any exceptions return the following error
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

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

      /// <summary>
      ///     Update a modified Order
      /// </summary>
      #region *** 200 OK, 304 NotModified,412 PreconditionFailed ,422 UnprocessableEntity, 417 ExpectationFailed***
      [HttpPut("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      // [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
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
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Update a modified Order
      /// </summary>
      #region *** 200 OK, 304 NotModified,412 PreconditionFailed ,422 UnprocessableEntity, 417 ExpectationFailed***
      [HttpPut("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      // [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
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
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }


      /// <summary>
      /// Delete Order
      /// </summary>
      #region *** 200 OK,417 ExpectationFailed, 400 BadRequest,404 NotFound,412 PreconditionFailed ***
      [HttpDelete("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(StatusCodes.Status404NotFound)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      #endregion
      //[Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      public async Task<IActionResult> Delete([FromBody] Order order)
      {
         try
         {
            /// if the Order record with the same id is not found
            if (!await _DbContext.Categories.AnyAsync(d => d.Id == order.Id).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Order not found");
               return NotFound(ErrorsList);
            }

            /// now delete the Order record
            _DbContext.Orders.Remove(order);
            /// save the changes to the database
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            /// return 200 OK status
            return Ok($"Order '{order.Id}' was deleted");
         }
         catch (Exception)
         {
            /// Add the error below to the error list
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}