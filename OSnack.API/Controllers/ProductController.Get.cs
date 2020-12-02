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
using System.Text;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class ProductController
   {
      #region ***  ***
      [ProducesResponseType(typeof(ResultList<Product>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/{selectedPage}/{maxItemsPerPage}/{filterCategory}/{searchValue}/{filterStatus}/{isSortAsce}/{sortName}")]
      public async Task<IActionResult> Get(
          int selectedPage,
          int maxItemsPerPage,
          string filterCategory = CoreConst.GetAllRecords,
          string searchValue = CoreConst.GetAllRecords,
          string filterStatus = CoreConst.GetAllRecords,
          bool isSortAsce = true,
          string sortName = "Name")
      {
         try
         {
            bool.TryParse(filterStatus, out bool boolFilterStatus);
            int.TryParse(filterCategory, out int filterProductCategoryId);

            int totalCount = await _DbContext.Products
                .Where(p => filterStatus.Equals(CoreConst.GetAllRecords) || p.Status == boolFilterStatus)
                .Where(p => filterCategory.Equals(CoreConst.GetAllRecords) || p.Category.Id == filterProductCategoryId)
                .CountAsync(p => searchValue.Equals(CoreConst.GetAllRecords) || (p.Name.Contains(searchValue) || p.Id.ToString().Contains(searchValue)))
                .ConfigureAwait(false);

            /// Include the necessary properties
            List<Product> list = await _DbContext.Products
                .Where(p => filterStatus.Equals(CoreConst.GetAllRecords) || p.Status == boolFilterStatus)
                .Include(p => p.Category)
                .Include(p => p.NutritionalInfo)
                .Where(p => filterCategory.Equals(CoreConst.GetAllRecords) || p.Category.Id == filterProductCategoryId)
                .Where(p => searchValue.Equals(CoreConst.GetAllRecords) || (p.Name.Contains(searchValue) || p.Id.ToString().Contains(searchValue)))
                .OrderByDynamic(sortName, isSortAsce)
                .Skip((selectedPage - 1) * maxItemsPerPage)
                .Take(maxItemsPerPage)
                .ToListAsync()
                .ConfigureAwait(false);
            return Ok(new ResultList<Product>(list, totalCount));
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }


      /// <summary>
      /// Get a single product by using product and category name 
      /// </summary>
      #region ***  ***
      [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("[action]/{categoryName}/{productName}")]
      public async Task<IActionResult> Get(string categoryName, string productName)
      {
         try
         {
            Product product = await _DbContext.Products
                .Include(p => p.Category)
                .Include(p => p.NutritionalInfo)
                .FirstOrDefaultAsync(p => p.Category.Name.Equals(categoryName) && p.Name.Equals(productName))
                .ConfigureAwait(false);

            List<Product> relatedProducts = await _DbContext.Products
                .Include(p => p.Category)
                .Where(p => p.Category.Id == product.Category.Id && p.Id != product.Id)
                .Take(3)
                .ToListAsync()
                .ConfigureAwait(false);

            if (relatedProducts.Count < 3)
               relatedProducts.AddRange(await _DbContext.Products
                .Include(p => p.Category)
                .Take(3 - relatedProducts.Count)
                .Where(p => !relatedProducts.Contains(p) && p.Id != product.Id)
                .ToListAsync()
                .ConfigureAwait(false));


            return Ok(new { product, relatedProducts });
         }
         catch (Exception)
         {
            CoreFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
