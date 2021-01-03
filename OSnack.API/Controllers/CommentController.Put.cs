using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OSnack.API.Database.Models;
using OSnack.API.Extras;
using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;
using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class CommentController
   {
      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]

      #endregion
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      [HttpPut("[action]/{commentId}/{show}")]
      public async Task<IActionResult> Put(int commentId, bool show)
      {

         try
         {
            Comment comment = await _DbContext.Comments
               .SingleOrDefaultAsync(c => c.Id == commentId).ConfigureAwait(false);

            if (comment == null)
            {
               CoreFunc.Error(ref ErrorsList, "Comment not exist.");
               return StatusCode(412, ErrorsList);
            }

            comment.Show = show;

            _DbContext.Comments.Update(comment);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            return Ok("Comment Updated.");
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
