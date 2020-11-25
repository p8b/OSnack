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
      ///     Update a modified Product
      /// </summary>
      #region *** 200 OK, 304 NotModified,412 PreconditionFailed ,422 UnprocessableEntity, 417 ExpectationFailed***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Done
      public async Task<IActionResult> Put([FromBody] oProduct modifiedProduct)
      {
         try
         {
            bool containsNewImages = true;
            if (modifiedProduct.Category.Id == 0)
               modifiedProduct.Category = null;

            ModelState.Clear();
            TryValidateModel(modifiedProduct);
            ModelState.Remove("Category.Name");
            ModelState.Remove("Category.ImageBase64");
            ModelState.Remove("NutritionalInfo.Product");
            ModelState.Remove("Category.OriginalImageBase64");

            /// if new image is not provided do not check for new images
            if (string.IsNullOrWhiteSpace(modifiedProduct.ImageBase64) && string.IsNullOrWhiteSpace(modifiedProduct.OriginalImageBase64))
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

            /// check the database to see if a Product with the same name exists
            if (await _AppDbContext.Products.AnyAsync(d => d.Id != modifiedProduct.Id && d.Name == modifiedProduct.Name && d.Category.Id == modifiedProduct.Category.Id).ConfigureAwait(false))
            {
               /// extract the errors and return bad request containing the errors
               CoreFunc.Error(ref ErrorsList, "Duplicated product name in selected category.");
               return StatusCode(412, ErrorsList);
            }

            string oldImagePath = modifiedProduct.ImagePath.Clone().ToString();
            string oldOriginalImagePath = modifiedProduct.OriginalImagePath.Clone().ToString();
            /// if new image is provided save the new image
            if (containsNewImages)
            {
               try
               {
                  string folderName = CoreFunc.StringGenerator(10, 3, 3, 4);
                  modifiedProduct.ImagePath = CoreFunc.SaveImageToWWWRoot(CoreFunc.StringGenerator(10, 3, 3, 4),
                          _WebHost.WebRootPath,
                          modifiedProduct.ImageBase64,
                          $"Images\\Products\\{folderName}");
                  modifiedProduct.OriginalImagePath = CoreFunc.SaveImageToWWWRoot(CoreFunc.StringGenerator(10, 3, 3, 4),
                          _WebHost.WebRootPath,
                          modifiedProduct.OriginalImageBase64,
                          $"Images\\Products\\{folderName}");
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
               modifiedProduct.ImagePath = CoreFunc.MoveImageInWWWRoot(
                  oldImagePath,
                  CoreFunc.StringGenerator(10, 3, 3, 4),
                  _WebHost.WebRootPath,
                  $"Images\\Products\\{folderName}");
               modifiedProduct.OriginalImagePath = CoreFunc.MoveImageInWWWRoot(
                  oldOriginalImagePath,
                  CoreFunc.StringGenerator(10, 3, 3, 4),
                  _WebHost.WebRootPath,
                  $"Images\\Products\\{folderName}");
            }

            try
            {

               /// Update the current Product to the EF context
               _AppDbContext.Products.Update(modifiedProduct);

               /// save the changes to the data base
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
                  CoreFunc.DeleteFromWWWRoot(modifiedProduct.ImagePath, _WebHost.WebRootPath);
                  CoreFunc.DeleteFromWWWRoot(modifiedProduct.OriginalImagePath, _WebHost.WebRootPath);
                  CoreFunc.ClearEmptyImageFolders(_WebHost.WebRootPath);
               }
            }
            /// return 200 OK (Update) status with the modified object
            /// and success message
            return Ok(modifiedProduct);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
      /// <summary>
      ///     Update a modified Product
      /// </summary>
      #region *** 200 OK, 304 NotModified,412 PreconditionFailed ,422 UnprocessableEntity, 417 ExpectationFailed***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPut("[action]/StoreInfo")]
      [Authorize(AppConst.AccessPolicies.Secret)] //Done
      //public async Task<IActionResult> Put([FromBody] oStoreProduct modifiedStoreProduct)
      public async Task<IActionResult> Put([FromBody] dynamic modifiedStoreProduct)
      {
         try
         {
            ModelState.Clear();
            TryValidateModel(modifiedStoreProduct);
            ModelState.Remove("Product.ImageBase64");
            ModelState.Remove("Product.Category.ImageBase64");
            ModelState.Remove("Store.Name");

            /// if model validation failed
            if (!ModelState.IsValid)
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }


            /// Update the current Product to the EF context
           // _DbContext.StoreProducts.Update(modifiedStoreProduct);

            /// save the changes to the data base
            await _AppDbContext.SaveChangesAsync().ConfigureAwait(false);

            /// return 200 OK (Update) status with the modified object
            /// and success message
            return Ok(modifiedStoreProduct);
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
