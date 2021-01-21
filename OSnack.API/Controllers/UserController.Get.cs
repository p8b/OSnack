using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using OSnack.API.Database.Models;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Attributes;
using P8B.Core.CSharp.Extentions;
using P8B.Core.CSharp.JsonConvertor;
using P8B.Core.CSharp.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   public partial class UserController
   {


      #region ***  ***                                  
      [MultiResultPropertyNames("userList", "totalCount")]
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
      [Authorize(AppConst.AccessPolicies.Secret)]
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
            _ = int.TryParse(filterRole, out int filterRoleId);
            int totalCount = await _DbContext.Users
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
                               || searchValue.Equals(CoreConst.GetAllRecords) || u.PhoneNumber.Contains(searchValue))
                .OrderByDynamic(sortName, isSortAsce)
                .Skip((selectedPage - 1) * maxItemsPerPage)
                .Take(maxItemsPerPage)
                .Include(u => u.Orders)
                .ToListAsync()
                .ConfigureAwait(false);

            list.ForEach(u =>
            {
               u.OrderLength = u.Orders.Count(o => o.Status == OrderStatusType.Confirmed
                                                || o.Status == OrderStatusType.InProgress
                                                || (o.Dispute != null && o.Dispute.Status));
               u.HasOrder = u.Orders.Count > 0;
            });

            return Ok(new MultiResult<List<User>, int>(list, totalCount, CoreFunc.GetCustomAttributeTypedArgument(this.ControllerContext)));
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }


      #region *** 200 OK, 417 ExpectationFailed ***
      [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(List<Error>), StatusCodes.Status417ExpectationFailed)]
      #endregion
      [HttpGet("Get/[action]")]
      [Authorize(AppConst.AccessPolicies.Official)]
      public async Task<IActionResult> DownloadData()
      {
         try
         {

            User user = await _DbContext.Users
               .Include(u => u.Role)
               .Include(u => u.RegistrationMethod)
               .SingleOrDefaultAsync(u => u.Id == AppFunc.GetUserId(User)).ConfigureAwait(false);
            List<Order> orders = await _DbContext.Orders
               .Include(o => o.User)
               .Include(o => o.OrderItems)
               .Include(o => o.Dispute)
               .ThenInclude(c => c.Messages)
               .Include(o => o.Payment)
               .Include(o => o.Coupon)
               .Where(u => u.User.Id == AppFunc.GetUserId(User)).ToListAsync().ConfigureAwait(false);

            List<Communication> questions = await _DbContext.Communications
               .Include(c => c.Messages)
               .Where(c => c.Email.ToUpper() == user.NormalizedEmail).ToListAsync().ConfigureAwait(false);

            List<Comment> comments = await _DbContext.Comments
               .Include(c => c.User)
               .Where(c => c.User.Id == user.Id).ToListAsync().ConfigureAwait(false);

            List<Address> addresses = await _DbContext.Addresses
                .Include(c => c.User)
               .Where(c => c.User.Id == user.Id).ToListAsync().ConfigureAwait(false);

            dynamic userData = new { userInfo = user, orders, questions, comments, addresses };
            return Ok(JsonConvert.SerializeObject(userData, Formatting.Indented,
            new JsonSerializerSettings
            {
               Converters = new List<JsonConverter> { new StringEnumConverter(), new DecimalFormatConverter() },
               ContractResolver = new DynamicContractResolver("Id", "Password", "AccessClaim", "OrderLength", "HasOrder"
               , "DeliveryOption", "Order_Id", "captchaToken", "AddressId", "UserId", "ProductId", "ImagePath", "ExternalLinkedId")
            }));
         }
         catch (Exception ex)
         {
            CoreFunc.Error(ref ErrorsList, _LoggingService.LogException(Request.Path, ex, User));
            return StatusCode(417, ErrorsList);
         }
      }

   }
}
