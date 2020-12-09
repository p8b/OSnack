using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using OSnack.API.Database;
using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp.Models;
using P8B.UK.API.Services;

using System.Collections.Generic;

namespace OSnack.API.Controllers
{
   [Route("User")]
   [AutoValidateAntiforgeryToken]
   [ApiControllerAttribute]
   public partial class UserController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }
      private LoggingService _LoggingService { get; }
      private UserManager<User> _UserManager { get; }
      private SignInManager<User> _SignInManager { get; }
      private EmailService EmailService { get; }
      private List<Error> ErrorsList = new List<Error>();

      public UserController(OSnackDbContext db, LoggingService loggingService,
          UserManager<User> um,
          IWebHostEnvironment webEnv,
          SignInManager<User> sm)
      {
         _DbContext = db;
         _UserManager = um;
         _SignInManager = sm;
         _LoggingService = loggingService;
         EmailService = new EmailService(AppConst.Settings.EmailSettings, loggingService, webEnv, _DbContext);
      }
   }
}
