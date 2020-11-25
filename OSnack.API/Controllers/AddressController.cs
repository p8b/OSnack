using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OSnack.API.Database;
using OSnack.API.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using P8B.Core.CSharp.Models;
using OSnack.API.Extras;
using P8B.Core.CSharp;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   public class AddressController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }
      private List<Error> ErrorsList = new List<Error>();

      /// <summary>
      ///     Class Constructor. Set the local properties
      /// </summary>
      /// <param name="db">Receive the AppDbContext instance from the ASP.Net Pipeline</param>
      public AddressController(OSnackDbContext db) => _DbContext = db;

      /// <summary>
      /// Used to get a list of Address for the current user
      /// </summary>
      #region *** 200 OK, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]")]
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      public async Task<IActionResult> Get()
      {
         try
         {
            int.TryParse(User.Claims.FirstOrDefault(
                               c => c.Type == "UserId")?.Value, out int userId);
            /// return the list of User's Address 
            return Ok(await _DbContext.Addresses.Where(t => t.User.Id == userId).ToListAsync());
         }
         catch (Exception) //ArgumentNullException
         {
            /// in the case any exceptions return the following error
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Create a new Address
      /// </summary>
      #region *** 201 Created, 400 BadRequest, 422 UnprocessableEntity, 417 ExpectationFailed ***
      [HttpPost("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      public async Task<IActionResult> Post([FromBody] oAddress newAddress)
      {
         try
         {
            if (newAddress != null)
            {
               int.TryParse(User.Claims.FirstOrDefault(
                                       c => c.Type == "UserId")?.Value, out int userId);
               newAddress.UserId = userId;
               newAddress.User = await _DbContext.Users.Include(u => u.Role).SingleOrDefaultAsync(u => u.Id == userId);
            }
            ModelState.Clear();
            /// if model validation failed
            if (!TryValidateModel(newAddress))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }

            /// Add the new Address to the EF context
            await _DbContext.Addresses.AddAsync(newAddress).ConfigureAwait(false);

            /// save the changes to the data base
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);

            /// return 201 created status with the new object
            /// and success message
            return Created("Success", newAddress);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Update a modified Address
      /// </summary>
      #region *** 200 OK, 304 NotModified,422 UnprocessableEntity, 417 ExpectationFailed***
      [HttpPut("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      public async Task<IActionResult> Put([FromBody] oAddress modifiedAddress)
      {
         try
         {
            if (modifiedAddress != null)
            {
               int.TryParse(User.Claims.FirstOrDefault(
                                       c => c.Type == "UserId")?.Value, out int userId);
               modifiedAddress.UserId = userId;
               modifiedAddress.User = await _DbContext.Users.Include(u => u.Role).SingleOrDefaultAsync(u => u.Id == userId);
            }
            ModelState.Clear();
            /// if model validation failed
            if (!TryValidateModel(modifiedAddress))
            {
               CoreFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return Unprocessable Entity with all the errors
               return UnprocessableEntity(ErrorsList);
            }

            /// Update the current Address to the EF context
            _DbContext.Addresses.Update(modifiedAddress);

            /// save the changes to the data base
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            /// return 200 OK (Update) status with the modified object
            /// and success message
            return Ok(modifiedAddress);
         }
         catch (Exception) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      /// Delete Address
      /// </summary>
      #region *** 200 OK,417 ExpectationFailed, 400 BadRequest, 404 NotFound ***
      [HttpDelete("[action]")]
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      [ProducesResponseType(StatusCodes.Status404NotFound)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      #endregion
      [Authorize(AppConst.AccessPolicies.Official)]  /// Ready For Test
      public async Task<IActionResult> Delete([FromBody] oAddress address)
      {
         try
         {

            /// if the Address record with the same id is not found
            if (!await _DbContext.Addresses.AnyAsync(d => d.Id == address.Id).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Address not found");
               return NotFound(ErrorsList);
            }
            /// If the coupon is in use by any Order then do not allow delete
            if (await _DbContext.Orders.AnyAsync(c => c.Address.Id == address.Id).ConfigureAwait(false))
            {
               CoreFunc.Error(ref ErrorsList, "Address is in use by at least one Order.");
               return StatusCode(412, ErrorsList);
            }

            /// now delete the Address record
            _DbContext.Addresses.Remove(address);
            /// save the changes to the database
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            /// return 200 OK status
            return Ok($"Address was deleted");
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