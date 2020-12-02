using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using OSnack.API.Database;
using OSnack.API.Database.Models;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   [AutoValidateAntiforgeryToken]
   public class NewsletterController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }
      private List<Error> ErrorsList = new List<Error>();

      /// <summary>
      ///     Class Constructor. Set the local properties
      /// </summary>
      /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
      public NewsletterController(OSnackDbContext db) => _DbContext = db;

      /// <summary>
      ///     Subscribe to newsletter
      /// </summary>
      #region *** 201 Created, 400 BadRequest, 422 UnprocessableEntity, 417 ExpectationFailed ***
      [HttpPost("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      // [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      public async Task<IActionResult> Post([FromBody] Newsletter newsletter)
      {
         try
         {
            /// if model validation failed
            if (!TryValidateModel(newsletter))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return the errors
               return UnprocessableEntity(ErrorsList);
            }
            if (_DbContext.Newsletters.Find(newsletter.Email) != null)
            {
               return Created("Success", newsletter);
            }
            /// Add the new Newsletter to the EF context
            await _DbContext.Newsletters.AddAsync(newsletter).ConfigureAwait(false);

            /// save the changes to the data base
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            /// return 201 created status with the new object
            /// and success message
            return Created("Success", newsletter);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Delete Newsletter
      /// </summary>
      #region *** 200 OK,417 ExpectationFailed, 400 BadRequest, 404 NotFound ***
      [HttpDelete("[action]/{email}")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(StatusCodes.Status404NotFound)]
      #endregion
      //[Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test
      public async Task<IActionResult> Delete(string email)
      {
         try
         {
            /// if the Newsletter record with the same id is not found
            Newsletter newsletter = _DbContext.Newsletters.Find(email);
            if (newsletter != null)
            {
               /// now delete the Newsletter record
               _DbContext.Newsletters.Remove(newsletter);

               /// save the changes to the database
               await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            }
            /// return 200 OK status
            return Ok($"{email} is now unsubscribed");
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