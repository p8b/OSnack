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
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class ProductController
   {
      #region ***  ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
      #endregion
      [HttpDelete("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status404NotFound)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      /// Done    
      public async Task<IActionResult> Delete([FromBody] Product product)
      {
         try
         {
            if (!await _DbContext.Products.AnyAsync(d => d.Id == product.Id).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Product not found");
               return NotFound(ErrorsList);
            }

            _DbContext.Products.Remove(product);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            try
            {
               CoreFunc.DeleteFromWWWRoot(product.ImagePath, _WebHost.WebRootPath);
               CoreFunc.DeleteFromWWWRoot(product.OriginalImagePath, _WebHost.WebRootPath);
               CoreFunc.ClearEmptyImageFolders(_WebHost.WebRootPath);
            }
            catch (Exception ex)
            {
               _LoggingService.LogException(Request.Path, ex, User, AppLogType.FileModification);
            }
            return Ok($"Product '{product.Name}' was deleted");
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
