using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OSnack.API.Database.Models;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;
using P8B.Core.CSharp;
using P8B.Core.CSharp.Attributes;
using P8B.Core.CSharp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class CommentController
   {

      #region *** 200 OK, 417 ExpectationFailed ***
      [MultiResultPropertyNames(new string[] { "commentList", "allowComment" })]
      [ProducesResponseType(typeof(MultiResult<List<Comment>, bool>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/{productId}")]
      [Authorize(AppConst.AccessPolicies.Public)] /// To be implemented
      public async Task<IActionResult> Get(int productId)
      {
         try
         {

            List<Comment> list = await _DbContext.Comments.Include(c => c.Product)
               .Where(c => c.Product.Id == productId && c.Show)
               .OrderBy(c => c.Date)
               .ToListAsync()
               .ConfigureAwait(false);

            bool isAllowForComment = false;
            if (AppFunc.GetUserId(User) != 0)
            {
               User user = await _DbContext.Users.Include(u => u.Orders)
                  .ThenInclude(o => o.OrderItems).SingleOrDefaultAsync(u => u.Id == AppFunc.GetUserId(User)).ConfigureAwait(false);
               List<int> orderItemIdList = new List<int>();
               foreach (var order in user.Orders.Where(o => o.Status != OrderStatusType.Canceled && o.Status != OrderStatusType.InProgress &&
                                    o.OrderItems.SingleOrDefault(oi => oi.ProductId == productId) != null))
               {
                  orderItemIdList.Add(order.OrderItems.SingleOrDefault(oi => oi.ProductId == productId).Id);
               }
               List<Comment> commentsList = await _DbContext.Comments.Include(c => c.OrderItem)
               .Where(c => c.Product.Id == productId)
               .ToListAsync()
               .ConfigureAwait(false);
               if (commentsList.Count(c => orderItemIdList.Contains(c.OrderItem.Id)) != orderItemIdList.Count)
                  isAllowForComment = true;
            }


            return Ok(new MultiResult<List<Comment>, bool>(list, isAllowForComment, CoreFunc.GetCustomAttributeTypedArgument(ControllerContext)));
         }
         catch (Exception ex)
         {
            /// in the case any exceptions return the following error
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

      #region *** 200 OK, 417 ExpectationFailed ***
      [ProducesResponseType(typeof(List<Comment>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("Get/[action]/{productId}")]
      [Authorize(AppConst.AccessPolicies.Secret)] /// To be implemented
      public async Task<IActionResult> All(int productId)
      {
         try
         {

            List<Comment> list = await _DbContext.Comments.Include(c => c.Product)
               .Where(c => c.Product.Id == productId)
               .OrderBy(c => c.Show)
               .ThenBy(c => c.Date)
               .ToListAsync()
               .ConfigureAwait(false);

            return Ok(list);
         }
         catch (Exception ex)
         {
            /// in the case any exceptions return the following error
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

   }
}
