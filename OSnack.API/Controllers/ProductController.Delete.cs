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
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class ProductController
   {
      #region ***  ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status404NotFound)]
      #endregion
      [HttpDelete("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Done    
      [ApiExplorerSettings(GroupName = AppConst.AccessPolicies.Secret)]
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
            catch (Exception)
            {
               _DbContext.AppLogs.Add(new AppLog { Massage = string.Format("Category deleted record but Images was not. The path is: {0}", product.ImagePath) });
            }
            return Ok($"Product '{product.Name}' was deleted");
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
