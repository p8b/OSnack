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
      [ProducesResponseType(typeof(Tuple<List<Order>, int>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{filterStatus}/{isSortAsce}/{sortName}")]
      [Authorize(AppConst.AccessPolicies.Secret)]
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
                .ThenInclude(sp => sp.Product)
                .ThenInclude(p => p.Category)
                .Include(o => o.OrderItems)
                .Include(o => o.User)
                .Include(o => o.Coupon)
                .Include(o => o.Payment)
                .ToListAsync()
                .ConfigureAwait(false);
            return Ok(new Tuple<List<Order>, int>(list, totalCount));
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
      [ProducesResponseType(typeof(Tuple<List<Order>, int>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/MyOrder/{selectedPage}/{maxNumberPerItemsPage}/{filterStatus}/{isSortAsce}/{sortName}")]
      [Authorize(AppConst.AccessPolicies.Official)]
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
               .Include(o => o.User)
               .Where(o => o.User.Id == userId)
                .CountAsync(r => filterStatus.Equals(CoreConst.GetAllRecords) ? true : r.Status.Equals((OrderStatusType)Enum.Parse(typeof(OrderStatusType), filterStatus, true)))
                //.CountAsync(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c. .Contains(searchValue))
                .ConfigureAwait(false);

            List<Order> list = await _DbContext.Orders
               .Include(o => o.User)
               .Where(o => o.User.Id == userId)
                .Where(r => filterStatus.Equals(CoreConst.GetAllRecords) ? true : r.Status.Equals((OrderStatusType)Enum.Parse(typeof(OrderStatusType), filterStatus, true)))
                .OrderByDynamic(sortName, isSortAsce)
                // .Where(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c.Code.Contains(searchValue))
                .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                .Take(maxNumberPerItemsPage)
                .Include(o => o.OrderItems)
                .ThenInclude(sp => sp.Product)
                .ThenInclude(p => p.Category)
                .Include(o => o.OrderItems)
                .Include(o => o.Coupon)
                .Include(o => o.Payment)
                .ToListAsync()
                .ConfigureAwait(false);
            return Ok(new Tuple<List<Order>, int>(list, totalCount));
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

   }
}
