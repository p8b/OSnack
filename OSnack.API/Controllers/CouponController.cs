using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database;
using OSnack.API.Database.Models;
using OSnack.API.Extras.CustomTypes;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Extentions;
using P8B.Core.CSharp.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   public class CouponController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }
      private List<Error> ErrorsList = new List<Error>();

      public CouponController(OSnackDbContext db) => _DbContext = db;

      /// <summary>
      /// Used to get a list of all Coupons
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{filterType}/{isSortAsce}/{sortName}")]
      // [Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public async Task<IActionResult> Get(
          int selectedPage,
          int maxNumberPerItemsPage,
          string searchValue = "",
          string filterType = CoreConst.GetAllRecords,
          bool isSortAsce = true,
          string sortName = "Code")
      {
         try
         {
            int totalCount = await _DbContext.Coupons
                .Where(r => filterType.Equals(CoreConst.GetAllRecords) ? true : r.Type.Equals((CouponType)Enum.Parse(typeof(CouponType), filterType, true)))
                .CountAsync(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c.Code.Contains(searchValue))
                .ConfigureAwait(false);

            List<oCoupon> list = await _DbContext.Coupons
                     .Where(r => filterType.Equals(CoreConst.GetAllRecords) ? true : r.Type.Equals((CouponType)Enum.Parse(typeof(CouponType), filterType, true)))
                .OrderByDynamic(sortName, isSortAsce)
                .Where(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c.Code.Contains(searchValue))
                .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                .Take(maxNumberPerItemsPage)
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
      /// Used to get a list of all Coupons
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      #endregion
      [HttpGet("[action]/validation/{couponCode?}")]
      // [Authorize(AppConst.AccessPolicies.Secret)] /// Done
      public async Task<IActionResult> Get(string couponCode)
      {
         try
         {
            oCoupon coupon = await _DbContext.Coupons.FindAsync(couponCode);

            if (coupon == null)
            {
               /// in the case any exceptions return the following error
               CoreFunc.Error(ref ErrorsList, "Code not found");
               return StatusCode(412, ErrorsList);
            }

            if (coupon.MaxUseQuantity == 0 || coupon.ExpiryDate < DateTime.UtcNow)
            {
               /// in the case any exceptions return the following error
               CoreFunc.Error(ref ErrorsList, "Coupon has expired");
               return StatusCode(412, ErrorsList);
            }

            /// return the list of Categories
            return Ok(coupon);
         }
         catch (Exception) //ArgumentNullException
         {
            /// in the case any exceptions return the following error
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Create a new Coupon
      /// </summary>
      #region *** 201 Created, 400 BadRequest, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
      [HttpPost("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      // [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      public async Task<IActionResult> Post([FromBody] oCoupon newCoupon)
      {
         try
         {
            if (!newCoupon.IsValid(ref ErrorsList))
            {
               return UnprocessableEntity(ErrorsList);
            }
            if (await _DbContext.Coupons.AnyAsync(c => c.Code == newCoupon.PendigCode).ConfigureAwait(false))
            {
               /// extract the errors and return bad request containing the errors
               CoreFunc.Error(ref ErrorsList, "Coupon Code already exists.");
               return StatusCode(412, ErrorsList);
            }
            newCoupon.Code = newCoupon.PendigCode;
            ModelState.Clear();
            /// if model validation failed
            if (!TryValidateModel(newCoupon))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }


            /// Add the new Coupons to the EF context
            await _DbContext.Coupons.AddAsync(newCoupon).ConfigureAwait(false);
            /// save the changes to the data base
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            /// return 201 created status with the new object
            /// and success message
            return Created("Success", newCoupon);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Update a modified Coupon
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
      public async Task<IActionResult> Put([FromBody] oCoupon modifiedCoupon)
      {
         try
         {
            /// if model validation failed
            if (!TryValidateModel(modifiedCoupon))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }

            /// check the database to see if a coupon with the same Code exists
            if (!await _DbContext.Coupons.AnyAsync(d => d.Code == modifiedCoupon.Code).ConfigureAwait(false))
            {
               /// extract the errors and return bad request containing the errors
               CoreFunc.Error(ref ErrorsList, "Coupon Not exists.");
               return StatusCode(412, ErrorsList);
            }

            /// check the database to see if a coupon type changed
            if (await _DbContext.Coupons.AnyAsync(d => d.Code == modifiedCoupon.Code &&
                                                      d.Type != modifiedCoupon.Type).ConfigureAwait(false))
            {
               /// extract the errors and return bad request containing the errors
               CoreFunc.Error(ref ErrorsList, "Coupon Type Can't be Change.");
               return StatusCode(412, ErrorsList);
            }

            oCoupon originalCoupon = await _DbContext.Coupons.FindAsync(modifiedCoupon.Code).ConfigureAwait(false);
            originalCoupon.MaxUseQuantity = modifiedCoupon.MaxUseQuantity;
            originalCoupon.ExpiryDate = modifiedCoupon.ExpiryDate;
            originalCoupon.PendigCode = originalCoupon.Code;

            /// Update the current Coupon to the EF context
            _DbContext.Coupons.Update(originalCoupon);
            /// save the changes to the data base
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            /// return 200 OK (Update) status with the modified object
            /// and success message
            return Ok(originalCoupon);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Delete Coupon
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
      public async Task<IActionResult> Delete([FromBody] oCoupon coupon)
      {
         try
         {
            /// if the coupon record with the same id is not found
            if (!await _DbContext.Coupons.AnyAsync(d => d.Code == coupon.Code).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Coupon not found");
               return NotFound(ErrorsList);
            }

            /// If the coupon is in use by any Order then do not allow delete
            if (await _DbContext.Orders.AnyAsync(c => c.Coupon.Code == coupon.Code).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Coupon is in use by at least one Order.");
               return StatusCode(412, ErrorsList);
            }

            /// now delete the coupon record
            _DbContext.Coupons.Remove(coupon);
            /// save the changes to the database
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            /// return 200 OK status
            return Ok($"Coupon '{coupon.Code}' was deleted");
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