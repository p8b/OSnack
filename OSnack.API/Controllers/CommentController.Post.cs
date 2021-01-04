using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OSnack.API.Database.Models;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;
using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class CommentController
   {
      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(string), StatusCodes.Status201Created)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      [HttpPost("[action]")]
      public async Task<IActionResult> Post([FromBody] Comment newComment)
      {

         try
         {
            List<Comment> list = await _DbContext.Comments.Include(c => c.Product)
               .Include(c => c.OrderItem)
               .Where(c => c.Product.Id == newComment.Product.Id)
               .ToListAsync()
               .ConfigureAwait(false);

            bool isAllowForComment = false;
            if (AppFunc.GetUserId(User) != 0)
            {
               User user = await _DbContext.Users.Include(u => u.Orders)
                  .ThenInclude(o => o.OrderItems).SingleOrDefaultAsync(u => u.Id == AppFunc.GetUserId(User)).ConfigureAwait(false);
               List<int> orderItemIdList = new List<int>();
               foreach (var order in user.Orders.Where(o => o.Status != OrderStatusType.Canceled &&
                                   o.OrderItems.SingleOrDefault(oi => oi.ProductId == newComment.Product.Id) != null))
               {
                  orderItemIdList.Add(order.OrderItems.SingleOrDefault(oi => oi.ProductId == newComment.Product.Id).Id);
               }
               if (list.Count(c => orderItemIdList.Contains(c.OrderItem.Id)) != orderItemIdList.Count)
               {
                  isAllowForComment = true;
                  foreach (var orderItemId in orderItemIdList)
                  {
                     if (list.Count(c => c.OrderItem.Id == orderItemId) == 0)
                     {
                        newComment.OrderItem = _DbContext.OrdersItems.SingleOrDefault(oi => oi.Id == orderItemId);
                        newComment.Name = $"{user.FirstName} {user.Surname.ToUpper().First()}";
                        break;
                     }
                  }
               }
            }
            if (!isAllowForComment)
            {
               _LoggingService.Log(Request.Path, AppLogType.OrderException,
                                 new { message = $"Try to add comment without order.", newContact = newComment }, User);
               CoreFunc.Error(ref ErrorsList, "You Can't post for this product.Try again or Contact Admin.");
               return StatusCode(412, ErrorsList);
            }

            newComment.Product = _DbContext.Products.SingleOrDefault(p => p.Id == newComment.OrderItem.ProductId);


            ModelState.Clear();
            TryValidateModel(newComment);
            foreach (var key in ModelState.Keys)
            {
               if (key.StartsWith("OrderItem") || key.StartsWith("Product"))
                  ModelState.Remove(key);
            }

            if (!ModelState.IsValid)
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }


            await newComment.CencoredDescription();
            await _DbContext.Comments.AddAsync(newComment).ConfigureAwait(false);
            _DbContext.Entry(newComment.OrderItem).State = EntityState.Unchanged;
            _DbContext.Entry(newComment.Product).State = EntityState.Unchanged;
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            return Created("", "Your comment submitted.");
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

   }
}
