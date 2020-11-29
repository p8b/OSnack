using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

using OSnack.API.Database;

using P8B.Core.CSharp.Models;

using System.Collections.Generic;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   [AutoValidateAntiforgeryToken]
   public partial class CategoryController : ControllerBase
   {
      private OSnackDbContext _AppDbContext { get; }
      private IWebHostEnvironment _WebHost { get; }
      private List<Error> ErrorsList = new List<Error>();

      public CategoryController(OSnackDbContext db, IWebHostEnvironment webEnv)
      {
         _AppDbContext = db;
         _WebHost = webEnv;
      }
   }
}

