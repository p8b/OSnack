using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class CategoryController
   {

      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status404NotFound)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      public async Task<IActionResult> Put([FromBody] oCategory modifiedCategory)
      {
         try
         {
            bool containsNewImages = true;
            TryValidateModel(modifiedCategory);

            /// if new image is not provided do not check for new images
            if (string.IsNullOrWhiteSpace(modifiedCategory.ImageBase64) && string.IsNullOrWhiteSpace(modifiedCategory.OriginalImageBase64))
            {
               containsNewImages = false;
               ModelState.Remove("ImageBase64");
               ModelState.Remove("OriginalImageBase64");
            }
            if (ModelState.ContainsKey("ImageBase64"))
               ModelState.Remove("OriginalImageBase64");
            /// if model validation failed
            if (!ModelState.IsValid)
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }

            /// check the database to see if a Category with the same name exists
            if (await _AppDbContext.Categories
                .AnyAsync(c => c.Name == modifiedCategory.Name && c.Id != modifiedCategory.Id)
                .ConfigureAwait(false))
            {
               /// extract the errors and return bad request containing the errors
               CoreFunc.Error(ref ErrorsList, "Category with the given name already exists.");
               return StatusCode(412, ErrorsList);
            }

            /// get the current category
            oCategory currentCatogory = await _AppDbContext.Categories
                .SingleOrDefaultAsync(c => c.Id == modifiedCategory.Id)
                .ConfigureAwait(false);

            // if the current category does not exists
            if (currentCatogory == null)
            {
               CoreFunc.Error(ref ErrorsList, "Category Not Found");
               return NotFound(ErrorsList);
            }

            string oldImagePath = modifiedCategory.ImagePath.Clone().ToString();
            string oldOriginalImagePath = modifiedCategory.OriginalImagePath.Clone().ToString();

            /// if new image is provided save the new image
            if (containsNewImages)
            {
               try
               {
                  string folderName = CoreFunc.StringGenerator(10, 3, 3, 4);
                  modifiedCategory.ImagePath = CoreFunc.SaveImageToWWWRoot(CoreFunc.StringGenerator(10, 3, 3, 4),
                          _WebHost.WebRootPath,
                          modifiedCategory.ImageBase64,
                          $"Images\\Categories\\{folderName}");
                  modifiedCategory.OriginalImagePath = CoreFunc.SaveImageToWWWRoot(CoreFunc.StringGenerator(10, 3, 3, 4),
                          _WebHost.WebRootPath,
                          modifiedCategory.OriginalImageBase64,
                          $"Images\\Categories\\{folderName}");
               }
               catch (Exception)
               {
                  CoreFunc.Error(ref ErrorsList, "Image cannot be saved.");
                  return StatusCode(412, ErrorsList);
               }
            }
            else /// move the existing image files to a new directory 
            {
               string folderName = CoreFunc.StringGenerator(10, 3, 3, 4);
               modifiedCategory.ImagePath = CoreFunc.MoveImageInWWWRoot(oldImagePath, CoreFunc.StringGenerator(10, 3, 3, 4),
                  _WebHost.WebRootPath, $"Images\\Categories\\{folderName}");
               modifiedCategory.OriginalImagePath = CoreFunc.MoveImageInWWWRoot(oldOriginalImagePath, CoreFunc.StringGenerator(10, 3, 3, 4),
                  _WebHost.WebRootPath, $"Images\\Categories\\{folderName}");
            }

            try
            {
               /// else Category object is made without any errors
               /// Update the current Category to the EF context
               _AppDbContext.Categories.Update(modifiedCategory);

               /// save the changes to the database
               await _AppDbContext.SaveChangesAsync().ConfigureAwait(false);

               if (containsNewImages)
               {
                  CoreFunc.DeleteFromWWWRoot(oldImagePath, _WebHost.WebRootPath);
                  CoreFunc.DeleteFromWWWRoot(oldOriginalImagePath, _WebHost.WebRootPath);
                  CoreFunc.ClearEmptyImageFolders(_WebHost.WebRootPath);
               }
            }
            catch (Exception)
            {
               if (containsNewImages)
               {
                  CoreFunc.DeleteFromWWWRoot(modifiedCategory.ImagePath, _WebHost.WebRootPath);
                  CoreFunc.DeleteFromWWWRoot(modifiedCategory.OriginalImagePath, _WebHost.WebRootPath);
                  CoreFunc.ClearEmptyImageFolders(_WebHost.WebRootPath);
               }
               throw;
            }
            /// return 200 OK (Update) status with the modified object
            /// and success message
            return Ok(modifiedCategory);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
