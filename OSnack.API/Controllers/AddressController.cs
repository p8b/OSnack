using Microsoft.AspNetCore.Mvc;

using OSnack.API.Database;

using P8B.Core.CSharp.Models;

using System.Collections.Generic;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   [AutoValidateAntiforgeryToken]
   [ApiControllerAttribute]
   public partial class AddressController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }

      private List<Error> ErrorsList = new List<Error>();

      public AddressController(OSnackDbContext db) => _DbContext = db;
   }
}
