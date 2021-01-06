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
      [MultiResultPropertyNames(new string[] { "commentList", "comment" })]
      [ProducesResponseType(typeof(MultiResult<List<Comment>, Comment, int>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/{productId}")]
      [Authorize(AppConst.AccessPolicies.Public)]
      public async Task<IActionResult> Get(int productId)
      {
         try
         {

            List<Comment> list = await _DbContext.Comments
               .Include(c => c.User)
               .Include(c => c.Product)
               .Where(c => c.Product.Id == productId)
               .OrderBy(c => c.Date)
               .ToListAsync()
               .ConfigureAwait(false);

            Comment selectComment = null;
            if (AppFunc.GetUserId(User) != 0)
            {
               User user = await _DbContext.Users.Include(u => u.Orders)
                  .ThenInclude(o => o.OrderItems).SingleOrDefaultAsync(u => u.Id == AppFunc.GetUserId(User)).ConfigureAwait(false);
               if (user.Orders.Any(o => o.Status == OrderStatusType.Delivered &&
                                   o.OrderItems.Any(oi => oi.ProductId == productId)))
               {
                  selectComment = await _DbContext.Comments.Include(c => c.User)
             .SingleOrDefaultAsync(c => c.Product.Id == productId && c.User.Id == AppFunc.GetUserId(User));
                  if (selectComment == null)
                     selectComment = new Comment()
                     {
                        Id = 0,
                        Product = await _DbContext.Products.SingleOrDefaultAsync(p => p.Id == productId),
                        User = user
                     };
               }
            }
            return Ok(new MultiResult<List<Comment>, Comment>(list, selectComment, CoreFunc.GetCustomAttributeTypedArgument(ControllerContext)));
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
      [Authorize(AppConst.AccessPolicies.Secret)]
      public async Task<IActionResult> All(int productId)
      {
         try
         {

            List<Comment> list = await _DbContext.Comments.Include(c => c.Product).Include(c => c.User)
               .Where(c => c.Product.Id == productId)
               .OrderBy(c => c.Date)
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
