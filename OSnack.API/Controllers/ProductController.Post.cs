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
      #region *** ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPost("[action]")]
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Done
      public async Task<IActionResult> Post([FromBody] oProduct newProduct)
      {
         try
         {
            ModelState.Clear();

            if (newProduct.Category.Id == 0)
               newProduct.Category = null;

            TryValidateModel(newProduct);
            ModelState.Remove("Category.Name");
            ModelState.Remove("Category.ImageBase64");
            ModelState.Remove("NutritionalInfo.Product");
            ModelState.Remove("Category.OriginalImageBase64");
            if (ModelState.ContainsKey("ImageBase64"))
               ModelState.Remove("OriginalImageBase64");

            if (!ModelState.IsValid)
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }

            /// check the database to see if a Product with the same name exists
            if (await _DbContext.Products.AnyAsync(d => d.Name == newProduct.Name && d.Category.Id == newProduct.Category.Id).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Product already exists.");
               return StatusCode(412, ErrorsList);
            }

            try
            {
               string folderName = CoreFunc.StringGenerator(10, 3, 3, 4);
               newProduct.ImagePath = CoreFunc.SaveImageToWWWRoot(CoreFunc.StringGenerator(10, 3, 3, 4),
                       _WebHost.WebRootPath,
                       newProduct.ImageBase64,
                       $"Images\\Products\\{folderName}");
               newProduct.OriginalImagePath = CoreFunc.SaveImageToWWWRoot(CoreFunc.StringGenerator(10, 3, 3, 4),
                       _WebHost.WebRootPath,
                       newProduct.OriginalImageBase64,
                       $"Images\\Products\\{folderName}");
            }
            catch (Exception)
            {
               CoreFunc.Error(ref ErrorsList, "Image cannot be saved.");
               return StatusCode(412, ErrorsList);
            }

            try
            {
               await _DbContext.Products.AddAsync(newProduct).ConfigureAwait(false);
               _DbContext.Entry(newProduct.Category).State = EntityState.Unchanged;
               await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            }
            catch (Exception)
            {
               CoreFunc.DeleteFromWWWRoot(newProduct.ImagePath, _WebHost.WebRootPath);
               CoreFunc.DeleteFromWWWRoot(newProduct.OriginalImagePath, _WebHost.WebRootPath);
               CoreFunc.ClearEmptyImageFolders(_WebHost.WebRootPath);
               throw;
            }

            return Created("", newProduct);
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }


      /// <summary>
      ///     Create/ update a new Score
      /// </summary>
      #region *** 201 Created, 400 BadRequest, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpPost("[action]/Score")]
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      public async Task<IActionResult> Post([FromBody] oScore newScore)
      {
         try
         {
            /// if model validation failed
            if (!TryValidateModel(newScore))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }

            /// else score object is made without any errors
            /// Add the new score to the EF context
            await _DbContext.Scores.AddAsync(newScore).ConfigureAwait(false);

            /// save the changes to the data base
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            /// return 201 created status with the new object
            /// and success message
            return Created("Success", newScore);
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
