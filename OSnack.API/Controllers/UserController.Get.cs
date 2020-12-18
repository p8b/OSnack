using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Extentions;
using P8B.Core.CSharp.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class UserController
   {

      /// <summary>
      /// Used to get a list of all users
      /// </summary>
      #region ***  ***
      [ProducesResponseType(typeof(MultiResult<List<User>, int>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/" +
          "{selectedPage}/" +
          "{maxItemsPerPage}/" +
          "{searchValue}/" +
          "{filterRole}/" +
          "{isSortAsce}/" +
          "{sortName}")]
      [Authorize(AppConst.AccessPolicies.Secret)] /// Ready For Test  
      public async Task<IActionResult> Get(
          int selectedPage = 1,
          int maxItemsPerPage = 5,
          string searchValue = CoreConst.GetAllRecords,
          string filterRole = CoreConst.GetAllRecords,
          bool isSortAsce = true,
          string sortName = "Name"
          )
      {
         try
         {
            //1.Check the search parameter and filters and return the appropriate user list
            //      a.If search value is empty or null then return the filtered users
            //          Note(Default value for parameters)
            //                    searchValue = null
            //ALL OTHER PARAMETERS = ***GET - ALL ***
            int.TryParse(filterRole, out int filterRoleId);
            int totalCount = await _DbContext.Users.AsNoTracking()
                .Include(u => u.Role)
                .Where(u => filterRole.Equals(CoreConst.GetAllRecords) || u.Role.Id == filterRoleId)
                .CountAsync(u => searchValue.Equals(CoreConst.GetAllRecords) || (u.FirstName.Contains(searchValue)
                               || searchValue.Equals(CoreConst.GetAllRecords) || u.Surname.Contains(searchValue)
                               || searchValue.Equals(CoreConst.GetAllRecords) || u.Id.ToString().Equals(searchValue)
                               || searchValue.Equals(CoreConst.GetAllRecords) || u.Email.Contains(searchValue)
                               || searchValue.Equals(CoreConst.GetAllRecords) || u.PhoneNumber.Contains(searchValue))
                ).ConfigureAwait(false);
            List<User> list = await _DbContext.Users
                .Include(u => u.Role)
                .Include(u => u.RegistrationMethod)
                .Where(u => filterRole.Equals(CoreConst.GetAllRecords) || u.Role.Id == filterRoleId)
                .Where(u => searchValue.Equals(CoreConst.GetAllRecords) || u.FirstName.Contains(searchValue)
                               || searchValue.Equals(CoreConst.GetAllRecords) || u.Surname.Contains(searchValue)
                               || searchValue.Equals(CoreConst.GetAllRecords) || u.Id.ToString().Equals(searchValue)
                               || searchValue.Equals(CoreConst.GetAllRecords) || u.Email.Contains(searchValue)
                               || searchValue.Equals(CoreConst.GetAllRecords) || u.PhoneNumber.Contains(searchValue)
                )
                .OrderByDynamic(sortName, isSortAsce)
                .Skip((selectedPage - 1) * maxItemsPerPage)
                .Take(maxItemsPerPage)
                .Include(u => u.Orders)

                .ToListAsync()
                .ConfigureAwait(false);
            list.ForEach(u => u.OrderLength = u.Orders.Count());
            /// return the list of Role ordered by name
            return Ok(new MultiResult<List<User>, int>(list, totalCount));
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
