using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OSnack.API.Database.Models;
using OSnack.API.Extras;
using P8B.Core.CSharp;
using P8B.Core.CSharp.Attributes;
using P8B.Core.CSharp.Extentions;
using P8B.Core.CSharp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class CommunicationController
   {
      /// <summary>
      /// Search or get all the categories.
      /// search by name or filter by unit or status
      /// </summary>
      #region *** ***
      [MultiResultPropertyNames("contactList", "totalCount")]
      [ProducesResponseType(typeof(MultiResult<List<Communication>, int>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("Get/[action]/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{isSortAsce}/{sortName}")]
      [Authorize(AppConst.AccessPolicies.Secret)]
      public async Task<IActionResult> Search(
          int selectedPage,
          int maxNumberPerItemsPage,
          string searchValue = "",
          bool isSortAsce = false,
          string sortName = "Date")
      {
         try
         {
            int totalCount = await _DbContext.Contacts.Include(c => c.Order).ThenInclude(o => o.User)
                .CountAsync(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c.Messages.Count(m => m.FullName == searchValue) > 0
                                                                                     || c.Email.Contains(searchValue)
                                                                                     || c.Order.User.Email.Contains(searchValue)
                                                                                     || c.Order.User.FirstName.Contains(searchValue)
                                                                                     || c.Order.User.Surname.Contains(searchValue)
                                                                                     || c.Order.User.PhoneNumber.Contains(searchValue)
                                                                                     || c.PhoneNumber.Contains(searchValue))
                .ConfigureAwait(false);

            List<Communication> list = await _DbContext.Contacts.Include(c => c.Order).ThenInclude(o => o.User)
               .Include(c => c.Messages)
                .OrderByDynamic(sortName, isSortAsce)
                .Where(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c.Messages.Count(m => m.FullName == searchValue) > 0
                                                                                     || c.Email.Contains(searchValue)
                                                                                     || c.Order.User.Email.Contains(searchValue)
                                                                                     || c.Order.User.FirstName.Contains(searchValue)
                                                                                     || c.Order.User.Surname.Contains(searchValue)
                                                                                     || c.Order.User.PhoneNumber.Contains(searchValue)
                                                                                     || c.PhoneNumber.Contains(searchValue))
                .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                .Take(maxNumberPerItemsPage)
                .ToListAsync()
                .ConfigureAwait(false);

            return Ok(new MultiResult<List<Communication>, int>(list, totalCount, CoreFunc.GetCustomAttributeTypedArgument(this.ControllerContext)));
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

      #region ***  ***
      [ProducesResponseType(typeof(List<Category>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("Get/[action]")]
      [Authorize(AppConst.AccessPolicies.Official)]
      public async Task<IActionResult> AllOfficial()
      {
         try
         {
            return Ok(await _DbContext.Contacts.Include(c => c.Order).ThenInclude(o => o.User).Include(c => c.Messages)
                                                 .Where(c => c.Order.User.Id == AppFunc.GetUserId(User))
                                                 .ToListAsync().ConfigureAwait(false));
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
