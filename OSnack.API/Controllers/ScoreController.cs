using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OSnack.API.Database;
using OSnack.API.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using P8B.Core.CSharp.Models;
using P8B.Core.CSharp;
using OSnack.API.Extras;
using Microsoft.AspNetCore.Authorization;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   [AutoValidateAntiforgeryToken]
   [ApiControllerAttribute]
   public class ScoreController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }
      private List<Error> ErrorsList = new List<Error>();

      /// <summary>
      ///     Class Constructor. Set the local properties
      /// </summary>
      /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
      public ScoreController(OSnackDbContext db) => _DbContext = db;

      /// <summary>
      ///     Create a new Score
      /// </summary>
      #region *** 201 Created, 400 BadRequest, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
      [HttpPost("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Secret)]  /// Ready For Test   
      [ApiExplorerSettings(GroupName = AppConst.AccessPolicies.Official)]
      public async Task<IActionResult> Post([FromBody] Score newScore)
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

            ///// check the database to see if a Score with the same name exists
            //if (!await AppDbContext.Categories.AnyAsync(d => d.Name == newRole.Name).ConfigureAwait(false))
            //{
            //    /// extract the errors and return bad request containing the errors
            //    CoreFunc.Error(ref ErrorsList, "Role already exists.");
            //    return StatusCode(412, ErrorsList);
            //}

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


