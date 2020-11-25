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
   public partial class ProductController
   {
      /// <summary>
      /// Delete Product
      /// </summary>
      #region ***  ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(StatusCodes.Status404NotFound)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      #endregion
      [HttpDelete("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      public async Task<IActionResult> Delete([FromBody] oProduct product)
      {
         try
         {

            /// if the Product record with the same id is not found
            if (!await _AppDbContext.Products.AnyAsync(d => d.Id == product.Id).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Product not found");
               return NotFound(ErrorsList);
            }

            /// now delete the Product record
            _AppDbContext.Products.Remove(product);
            /// save the changes to the database
            await _AppDbContext.SaveChangesAsync().ConfigureAwait(false);

            try
            {
               CoreFunc.DeleteFromWWWRoot(product.ImagePath, _WebHost.WebRootPath);
               CoreFunc.DeleteFromWWWRoot(product.OriginalImagePath, _WebHost.WebRootPath);
               CoreFunc.ClearEmptyImageFolders(_WebHost.WebRootPath);
            }
            catch (Exception)
            {
               _AppDbContext.AppLogs.Add(new oAppLog { Massage = string.Format("Category deleted record but Images was not. The path is: {0}", product.ImagePath) });
            }
            /// return 200 OK status
            return Ok($"Product '{product.Name}' was deleted");
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
