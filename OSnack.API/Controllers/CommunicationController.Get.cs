using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OSnack.API.Database.Models;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;
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
      [MultiResultPropertyNames("communicationList", "totalCount")]
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
            int totalCount = await _DbContext.Communications
               .Where(c => c.Type == ContactType.Question)
                .CountAsync(c => searchValue.Equals(CoreConst.GetAllRecords) || c.Id.Contains(searchValue)
                                                                                     || c.FullName.Contains(searchValue)
                                                                                     || c.Email.Contains(searchValue)
                                                                                     || c.PhoneNumber.Contains(searchValue))
                .ConfigureAwait(false);

            List<Communication> list = await _DbContext.Communications.Include(c => c.Order).ThenInclude(o => o.User)
               .Include(c => c.Messages)
               .Where(c => c.Type == ContactType.Question)
                .Where(c => searchValue.Equals(CoreConst.GetAllRecords) || c.Id.Contains(searchValue)
                                                                                     || c.FullName.Contains(searchValue)
                                                                                     || c.Email.Contains(searchValue)
                                                                                     || c.PhoneNumber.Contains(searchValue))
                .OrderByDynamic(sortName, isSortAsce)
                .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                .Take(maxNumberPerItemsPage)
                .ToListAsync()
                .ConfigureAwait(false);

            return Ok(new MultiResult<List<Communication>, int>(list, totalCount, CoreFunc.GetCustomAttributeTypedArgument(ControllerContext)));
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

   }
}
