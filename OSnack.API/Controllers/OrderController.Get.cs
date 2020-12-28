using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Attributes;
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
      //[HttpGet("[action]")]
      //[ProducesResponseType(typeof(Order), StatusCodes.Status200OK)]
      //public async Task<IActionResult> TestOrder()
      //{
      //   var order = await _DbContext.Orders
      //           .Include(o => o.User)
      //           .Include(o => o.Payment)
      //           .Include(o => o.OrderItems)
      //           .FirstOrDefaultAsync(o => o.Status == OrderStatusType.Confirmed && o.User.Id == 1)
      //           .ConfigureAwait(false);
      //   await _EmailService.OrderReceiptAsync(order).ConfigureAwait(false);

      //   return Ok(order);
      //}


      /// <summary>
      /// Used to get a list of all Order with OrderItems
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [MultiResultPropertyNames(new string[] { "orderList", "availableTypes", "totalCount" })]
      [ProducesResponseType(typeof(MultiResult<List<Order>, List<OrderStatusType>, int>), StatusCodes.Status200OK)]
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
          string sortName = "Date")
      {
         try
         {
            int totalCount = await _DbContext.Orders.Include(o => o.User).Include(o => o.Payment)
                .Where(r => filterStatus.Equals(CoreConst.GetAllRecords) ? true : r.Status.Equals((OrderStatusType)Enum.Parse(typeof(OrderStatusType), filterStatus, true)))
                .CountAsync(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c.Name.Contains(searchValue)
                                                                                     || c.User.FirstName.Contains(searchValue)
                                                                                     || c.User.Surname.Contains(searchValue)
                                                                                     || c.User.Email.Contains(searchValue)
                                                                                     || c.Id.Contains(searchValue)
                                                                                     || c.Date.ToShortDateString().Contains(searchValue)
                                                                                     || c.Postcode.Contains(searchValue)
                                                                                     || c.Payment.Email.Contains(searchValue)
                                                                                     || c.Payment.Reference.Contains(searchValue))
                .ConfigureAwait(false);

            List<OrderStatusType> availebeStatusTypes = await _DbContext.Orders
                          .Select(o => o.Status)
                          .Distinct()
                          .ToListAsync()
                          .ConfigureAwait(false);

            List<Order> list = await _DbContext.Orders
                .Include(o => o.User)
                .Include(o => o.Payment)
                .Include(o => o.Dispute)
                .ThenInclude(c => c.Messages)
                 .Where(r => filterStatus.Equals(CoreConst.GetAllRecords) ? true : r.Status.Equals((OrderStatusType)Enum.Parse(typeof(OrderStatusType), filterStatus, true)))
                 .Where(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c.Name.Contains(searchValue)
                                                                                     || c.User.FirstName.Contains(searchValue)
                                                                                     || c.User.Surname.Contains(searchValue)
                                                                                     || c.User.Email.Contains(searchValue)
                                                                                     || c.Id.Contains(searchValue)
                                                                                     || c.Date.ToShortDateString().Contains(searchValue)
                                                                                     || c.Postcode.Contains(searchValue)
                                                                                     || c.Payment.Email.Contains(searchValue)
                                                                                     || c.Payment.Reference.Contains(searchValue))
                 .OrderByDynamic(sortName, isSortAsce)
                .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                .Take(maxNumberPerItemsPage)
                .Include(o => o.OrderItems)
                .ToListAsync()
                .ConfigureAwait(false);
            return Ok(new MultiResult<List<Order>, List<OrderStatusType>, int>(list, availebeStatusTypes, totalCount,
               CoreFunc.GetCustomAttributeTypedArgument(this.ControllerContext)));
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
      #region ***  ***
      [Consumes(MediaTypeNames.Application.Json)]
      [MultiResultPropertyNames("orderList", "availableTypes", "fullName", "totalCount")]
      [ProducesResponseType(typeof(MultiResult<List<Order>, List<OrderStatusType>, string, int>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("Get/[action]/{userId}/{selectedPage}/{maxNumberPerItemsPage}/{filterStatus}")]
      [Authorize(AppConst.AccessPolicies.Secret)]
      public async Task<IActionResult> AllUser(int userId,
          int selectedPage,
          int maxNumberPerItemsPage,
          string filterStatus = CoreConst.GetAllRecords,
          bool isSortAsce = true,
          string sortName = "Date") =>
        await AllOrder(userId, selectedPage, maxNumberPerItemsPage, filterStatus, isSortAsce, sortName).ConfigureAwait(false);

      /// <summary>
      /// Used to get a list of all Order with OrderItems
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [MultiResultPropertyNames("orderList", "availableTypes", "fullName", "totalCount")]
      [ProducesResponseType(typeof(MultiResult<List<Order>, List<OrderStatusType>, string, int>), StatusCodes.Status200OK)]
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
          string filterStatus = CoreConst.GetAllRecords, bool isSortAsce = false,
          string sortName = "Date")
      {
         try
         {
            int totalCount = await _DbContext.Orders
               .Include(o => o.User)
               .Where(o => o.User.Id == userId)
                .CountAsync(r => filterStatus.Equals(CoreConst.GetAllRecords) ? true : r.Status.Equals((OrderStatusType)Enum.Parse(typeof(OrderStatusType), filterStatus, true)))
                .ConfigureAwait(false);

            List<OrderStatusType> availebeStatusTypes = await _DbContext.Orders
                           .Include(o => o.User)
                           .Where(o => o.User.Id == userId)
                           .Select(o => o.Status)
                           .Distinct()
                           .ToListAsync()
                           .ConfigureAwait(false);

            List<Order> list = await _DbContext.Orders
               .Include(o => o.User)
               .Include(o => o.Dispute)
               .ThenInclude(c => c.Messages)
               .Where(o => o.User.Id == userId)
               .OrderByDynamic(sortName, isSortAsce)
               .Where(r => filterStatus.Equals(CoreConst.GetAllRecords) ? true : r.Status.Equals((OrderStatusType)Enum.Parse(typeof(OrderStatusType), filterStatus, true)))
               .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                .Take(maxNumberPerItemsPage)
                .Include(o => o.OrderItems)
                .Include(o => o.Payment)
                .Include(o => o.DeliveryOption)
                .ToListAsync()
                .ConfigureAwait(false);

            User user = _DbContext.Users.SingleOrDefault(u => u.Id == userId);

            return Ok(new MultiResult<List<Order>, List<OrderStatusType>, string, int>
               (list, availebeStatusTypes, $"{user.FirstName} {user.Surname}", totalCount,
               CoreFunc.GetCustomAttributeTypedArgument(this.ControllerContext)));
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

      #region ***  ***
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
