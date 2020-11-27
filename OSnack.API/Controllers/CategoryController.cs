using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database;
using OSnack.API.Database.Models;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Extentions;
using P8B.Core.CSharp.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   [AutoValidateAntiforgeryToken]
   public partial class CategoryController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }
      private IWebHostEnvironment _WebHost { get; }
      private List<Error> ErrorsList = new List<Error>();

      public CategoryController(OSnackDbContext db, IWebHostEnvironment webEnv)
      {
         _DbContext = db;
         _WebHost = webEnv;
      }
   }
}

