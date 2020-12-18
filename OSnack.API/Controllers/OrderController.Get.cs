using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;
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
   public partial class OrderController
   {
      /// <summary>
      /// Used to get a list of all Order with OrderItems
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(MultiResult<List<Order>, int>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("Get/[action]/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{filterStatus}/{isSortAsce}/{sortName}")]
      [Authorize(AppConst.AccessPolicies.Secret)]
      public async Task<IActionResult> All(
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
                .ThenInclude(sp => sp.Product)
                .ThenInclude(p => p.Category)
                .Include(o => o.OrderItems)
                .Include(o => o.User)
                .Include(o => o.Coupon)
                .Include(o => o.Payment)
                .ToListAsync()
                .ConfigureAwait(false);
            return Ok(new MultiResult<List<Order>, int>(list, totalCount));
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Used to get a list of all Order with OrderItems
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(MultiResult<List<Order>, int>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("Get/[action]/{userId}/{selectedPage}/{maxNumberPerItemsPage}/{filterStatus}")]
      [Authorize(AppConst.AccessPolicies.Secret)]
      public async Task<IActionResult> AllUser(int userId,
          int selectedPage,
          int maxNumberPerItemsPage,
          string filterStatus = CoreConst.GetAllRecords) =>
        await AllOrder(userId, selectedPage, maxNumberPerItemsPage, filterStatus).ConfigureAwait(false);

      /// <summary>
      /// Used to get a list of all Order with OrderItems
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(MultiResult<List<Order>, int>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("Get/[action]/{selectedPage}/{maxNumberPerItemsPage}/{filterStatus}")]
      [Authorize(AppConst.AccessPolicies.Official)]
      public async Task<IActionResult> All(int selectedPage,
          int maxNumberPerItemsPage,
          string filterStatus = CoreConst.GetAllRecords) =>
        await AllOrder(AppFunc.GetUserId(User), selectedPage, maxNumberPerItemsPage, filterStatus).ConfigureAwait(false);

      private async Task<IActionResult> AllOrder(int userId, int selectedPage,
          int maxNumberPerItemsPage,
          string filterStatus = CoreConst.GetAllRecords)
      {
         try
         {
            int totalCount = await _DbContext.Orders
               .Include(o => o.User)
               .Where(o => o.User.Id == userId)
                .CountAsync(r => filterStatus.Equals(CoreConst.GetAllRecords) ? true : r.Status.Equals((OrderStatusType)Enum.Parse(typeof(OrderStatusType), filterStatus, true)))
                .ConfigureAwait(false);

            List<Order> list = await _DbContext.Orders
               .Include(o => o.User)
               .Where(o => o.User.Id == userId)
               .Where(r => filterStatus.Equals(CoreConst.GetAllRecords) ? true : r.Status.Equals((OrderStatusType)Enum.Parse(typeof(OrderStatusType), filterStatus, true)))
               .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                .Take(maxNumberPerItemsPage)
                .Include(o => o.OrderItems)
                .Include(o => o.Payment)
                .Include(o => o.DeliveryOption)
                .OrderByDescending(o => o.Date).ThenBy(o => o.Status)
                .ToListAsync()
                .ConfigureAwait(false);
            return Ok(new MultiResult<List<Order>, int>(list, totalCount));
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

      #region *** 200 OK, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(Order), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/{orderId}")]
      [Authorize(AppConst.AccessPolicies.Official)]
      public async Task<IActionResult> Get(string orderId)
      {
         try
         {
            Order order = await _DbContext.Orders
                .Include(o => o.User)
                .Where(o => o.User.Id == AppFunc.GetUserId(User))
                .Include(o => o.OrderItems)
                .Include(o => o.Payment)
                .SingleOrDefaultAsync(o => o.Id == orderId)
                .ConfigureAwait(false);
            if (order == null)
            {
               CoreFunc.Error(ref ErrorsList, "Cannot find your order.");
               return UnprocessableEntity(ErrorsList);
            }

            return Ok(order);
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

   }
}
