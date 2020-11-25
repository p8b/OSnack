using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database;
using OSnack.API.Database.Models;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;
using P8B.UK.API.Services;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   public class TokenController : Controller
   {
      private UserManager<oUser> _UserManager { get; }
      private OSnackDbContext _DbContext { get; }
      private EmailSettings _EmailSettings { get; }
      private EmailService EmailService
      {
         get => new EmailService();
         //get => new EmailService(_EmailSettings, HttpContext, AppDbContext);
      }
      private List<Error> ErrorsList = new List<Error>();

      /// <summary>
      ///     Class Constructor. Set the local properties
      /// </summary>
      /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
      /// <param name="um)">Receive the UserManager instance from the ASP.Net Pipeline</param>
      public TokenController(OSnackDbContext db,
          UserManager<oUser> um,
          EmailSettings es)
      {
         _DbContext = db;
         _UserManager = um;
         _EmailSettings = es;
      }



      #region *** 201 Created, 412 PreconditionFailed, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("Get/IsTokenValid/{token}")]
      public async Task<IActionResult> GetIsTokenValid(string token)
      {
         try
         {
            /// If email parameter is empty
            /// return "Precondition Failed" response (stop code execution)
            if (string.IsNullOrWhiteSpace(token))
            {
               /// in the case any exceptions return the following error
               CoreFunc.Error(ref ErrorsList, "Token is required!");
               return StatusCode(412, ErrorsList);
            }

            if (!await _DbContext.Tokens.AnyAsync(t => t.Value.Equals(token))
               .ConfigureAwait(false))

            {
               /// in the case any exceptions return the following error
               CoreFunc.Error(ref ErrorsList, "Invalid Token!");
               return StatusCode(412, ErrorsList);
            }

            return Ok(new { isTokenValid = true });
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
