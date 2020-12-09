using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using OSnack.API.Database;
using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;
using P8B.UK.API.Services;

using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   [AutoValidateAntiforgeryToken]
   [ApiControllerAttribute]
   public class ScoreController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }
      private LoggingService _LoggingService { get; }
      private List<Error> ErrorsList = new List<Error>();

      /// <summary>
      ///     Class Constructor. Set the local properties
      /// </summary>
      /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
      public ScoreController(OSnackDbContext db, LoggingService loggingService)
      {
         _DbContext = db;
         _LoggingService = loggingService;
      }

      /// <summary>
      ///     Create a new Score
      /// </summary>
      #region *** 201 Created, 400 BadRequest, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
      [HttpPost("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(typeof(Score), StatusCodes.Status201Created)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Secret)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status422UnprocessableEntity)]
      [ProducesDefaultResponseType]
      /// Ready For Test   
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
            return Created("Succes", newScore);
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
