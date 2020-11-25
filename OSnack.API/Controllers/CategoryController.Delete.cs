using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class CategoryController
   {
      #region ***  ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(StatusCodes.Status404NotFound)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      #endregion
      [HttpDelete("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      public async Task<IActionResult> Delete([FromBody] oCategory category)
      {
         try
         {
            /// if the Category record with the same id is not found
            if (!await _AppDbContext.Categories
                .AnyAsync(c => c.Id == category.Id)
                .ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Category not found");
               return NotFound(ErrorsList);
            }

            /// If the category is in use by any product then do not allow delete
            if (await _AppDbContext.Products
                .AnyAsync(c => c.Category.Id == category.Id)
                .ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Category is in use by at least one ");
               return StatusCode(412, ErrorsList);
            }

            /// else the Category is found
            /// now delete the Category record
            _AppDbContext.Categories.Remove(category);
            /// save the changes to the database
            await _AppDbContext.SaveChangesAsync().ConfigureAwait(false);

            try
            {
               CoreFunc.DeleteFromWWWRoot(category.ImagePath, _WebHost.WebRootPath);
               CoreFunc.DeleteFromWWWRoot(category.OriginalImagePath, _WebHost.WebRootPath);
               CoreFunc.ClearEmptyImageFolders(_WebHost.WebRootPath);
            }
            catch (Exception)
            {
               _AppDbContext.AppLogs.Add(new oAppLog { Massage = string.Format("Category deleted record but Images was not. The path is: {0}", category.ImagePath) });
            }
            /// return 200 OK status
            return Ok($"Category '{category.Name}' was deleted");
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
