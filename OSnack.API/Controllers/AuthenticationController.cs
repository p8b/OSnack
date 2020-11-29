using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using OSnack.API.Database;
using OSnack.API.Database.Context.ClassOverrides;
using OSnack.API.Database.Models;

using P8B.Core.CSharp.Models;

using System.Collections.Generic;

namespace OSnack.API.Controllers
{
   [Route("Authentication")]
   [AutoValidateAntiforgeryToken]
   public partial class AuthenticationController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }
      private OSnackSignInManager<oUser> _SignInManager { get; }
      private UserManager<oUser> _UserManager { get; }
      private List<Error> ErrorsList = new List<Error>();
      private readonly IAntiforgery _Antiforgery;
      private readonly IWebHostEnvironment _WebHostingEnv;


      public AuthenticationController(OSnackDbContext db, OSnackSignInManager<oUser> sm, UserManager<oUser> um,
         IAntiforgery af, IWebHostEnvironment env)
      {
         _DbContext = db;
         _SignInManager = sm;
         _UserManager = um;
         _Antiforgery = af;
         _WebHostingEnv = env;
      }
   }
}
