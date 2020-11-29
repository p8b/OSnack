using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Extentions;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class CategoryController
   {
      /// <summary>
      /// Search or get all the categories.
      /// search by name or filter by unit or status
      /// </summary>
      #region *** ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("Get/[action]/{selectedPage}/{maxNumberPerItemsPage}/{searchValue}/{isSortAsce}/{sortName}")]
      public async Task<IActionResult> Search(
          int selectedPage,
          int maxNumberPerItemsPage,
          string searchValue = "",
          bool isSortAsce = true,
          string sortName = "Name")
      {
         try
         {
            int totalCount = await _AppDbContext.Categories
                .CountAsync(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c.Name.Contains(searchValue))
                .ConfigureAwait(false);

            List<oCategory> list = await _AppDbContext.Categories
               .AsNoTracking()
                .OrderByDynamic(sortName, isSortAsce)
                .Where(c => searchValue.Equals(CoreConst.GetAllRecords) ? true : c.Name.Contains(searchValue))
                .Skip((selectedPage - 1) * maxNumberPerItemsPage)
                .Take(maxNumberPerItemsPage)
                .ToListAsync()
                .ConfigureAwait(false);

            return Ok(new { list, totalCount });
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      #region ***  ***
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("Get/[action]")]
      public async Task<IActionResult> All()
      {
         try
         {
            return Ok(await _AppDbContext.Categories.AsNoTracking().ToListAsync()
               .ConfigureAwait(false));
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
