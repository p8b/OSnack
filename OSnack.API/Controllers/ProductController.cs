using Microsoft.AspNetCore.Hosting;
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
using P8B.Core.CSharp;
using P8B.Core.CSharp.Extentions;
using OSnack.API.Extras;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   public partial class ProductController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }
      private List<Error> ErrorsList = new List<Error>();
      private IWebHostEnvironment _WebHost { get; }

      public ProductController(OSnackDbContext db, IWebHostEnvironment webEnv)
      {
         _DbContext = db;
         _WebHost = webEnv;
      }
   }
}