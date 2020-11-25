using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using OSnack.API.Database;
using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp.Models;
using P8B.UK.API.Services;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OSnack.API.Controllers
{
   [Route("User")]
   public partial class UserController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }
      private UserManager<oUser> _UserManager { get; }
      private SignInManager<oUser> _SignInManager { get; }
      private EmailService EmailService { get; }
      private List<Error> ErrorsList = new List<Error>();

      public UserController(OSnackDbContext db,
          UserManager<oUser> um,
          IWebHostEnvironment webEnv,
          SignInManager<oUser> sm)
      {
         _DbContext = db;
         _UserManager = um;
         _SignInManager = sm;
         EmailService = new EmailService(AppConst.Settings.EmailSettings, webEnv, _DbContext);
      }
   }
}
