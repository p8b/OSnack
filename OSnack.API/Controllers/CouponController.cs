using Microsoft.AspNetCore.Mvc;

using OSnack.API.Database;

using P8B.Core.CSharp.Models;

using System.Collections.Generic;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   [AutoValidateAntiforgeryToken]
   public partial class CouponController : ControllerBase
   {
      private OSnackDbContext _AppDbContext { get; }
      private List<Error> ErrorsList = new List<Error>();

      public CouponController(OSnackDbContext db) => _AppDbContext = db;
   }
}