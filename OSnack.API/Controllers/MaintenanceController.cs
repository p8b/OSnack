using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using OSnack.API.Database;
using OSnack.API.Database.Context.ClassOverrides;
using OSnack.API.Database.Models;

using P8B.Core.CSharp.Models;
using P8B.UK.API.Services;

using System.Collections.Generic;

namespace OSnack.API.Controllers
{
   [Route("[controller]")]
   [AutoValidateAntiforgeryToken]
   [ApiControllerAttribute]
   public partial class MaintenanceController : ControllerBase
   {
      private OSnackDbContext _DbContext { get; }
      private OSnackSignInManager<User> _SignInManager { get; }
      private readonly IAuthorizationService _AuthService;
      private LoggingService _LoggingService { get; }
      private List<Error> ErrorsList = new List<Error>();

      public MaintenanceController(OSnackDbContext db
         , OSnackSignInManager<User> sm
         , IAuthorizationService authService)
      {
         _DbContext = db;
         _SignInManager = sm;
         _AuthService = authService;
         _LoggingService = new LoggingService(db);
      }
   }
}
