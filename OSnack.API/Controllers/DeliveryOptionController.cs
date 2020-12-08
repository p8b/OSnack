using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OSnack.API.Database;
using P8B.Core.CSharp.Models;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   [AutoValidateAntiforgeryToken]
   [ApiControllerAttribute]
   public partial class DeliveryOptionController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }

      private List<Error> ErrorsList = new List<Error>();

      public DeliveryOptionController(OSnackDbContext _db) => _DbContext = _db;

   }
}
