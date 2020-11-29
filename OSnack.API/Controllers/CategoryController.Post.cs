using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;

using System;
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class CategoryController
   {
      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      [HttpPost("[action]")]
      public async Task<IActionResult> Post([FromBody] oCategory newCategory)
      {
         try
         {
            TryValidateModel(newCategory);

            if (ModelState.ContainsKey("ImageBase64"))
               ModelState.Remove("OriginalImageBase64");

            if (!ModelState.IsValid)
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }

            if (await _AppDbContext.Categories
                .AnyAsync(d => d.Name.Equals(newCategory.Name)).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Category already exists.");
               return StatusCode(412, ErrorsList);
            }

            try
            {
               string folderName = CoreFunc.StringGenerator(10, 3, 3, 4);
               newCategory.ImagePath = CoreFunc.SaveImageToWWWRoot(CoreFunc.StringGenerator(10, 3, 3, 4),
                       _WebHost.WebRootPath,
                       newCategory.ImageBase64,
                       $"Images\\Categories\\{folderName}");
               newCategory.OriginalImagePath = CoreFunc.SaveImageToWWWRoot(CoreFunc.StringGenerator(10, 3, 3, 4),
                       _WebHost.WebRootPath,
                       newCategory.OriginalImageBase64,
                       $"Images\\Categories\\{folderName}");
            }
            catch (Exception)
            {
               CoreFunc.Error(ref ErrorsList, "Image cannot be saved.");
               return StatusCode(412, ErrorsList);
            }
            try
            {
               await _AppDbContext.Categories.AddAsync(newCategory).ConfigureAwait(false);
               await _AppDbContext.SaveChangesAsync().ConfigureAwait(false);
            }
            catch (Exception)
            {
               CoreFunc.DeleteFromWWWRoot(newCategory.ImagePath, _WebHost.WebRootPath);
               CoreFunc.DeleteFromWWWRoot(newCategory.OriginalImagePath, _WebHost.WebRootPath);
               CoreFunc.ClearEmptyImageFolders(_WebHost.WebRootPath);
               throw;
            }

            return Created("", newCategory);
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
