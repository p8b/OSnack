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
using Microsoft.AspNetCore.Hosting;

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