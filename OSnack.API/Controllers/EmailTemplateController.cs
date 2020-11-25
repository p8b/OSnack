using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;

using OSnack.API.Database;
using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   [AutoValidateAntiforgeryToken]
   public partial class EmailTemplateController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }
      private List<Error> ErrorsList = new List<Error>();
      private IWebHostEnvironment WebHost { get; }

      public EmailTemplateController(OSnackDbContext db, IWebHostEnvironment webEnv)
      {
         _DbContext = db;
         WebHost = webEnv;
      }
   }
}
