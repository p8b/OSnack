
using OSnack.API.Database;
using OSnack.API.Database.Models;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Models.Interfaces;

using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace P8B.UK.API.Services
{
   public class LoggingService : ILoggingService
   {
      private OSnackDbContext _DbContext { get; }

      public LoggingService(OSnackDbContext dbContext)
      {
         _DbContext = dbContext;
      }

      internal AppLog Log(string message, AppLogType type, dynamic obj = null, int userId = 0)
      {
         User user = null;
         if (userId > 0)
            user = _DbContext.Users.SingleOrDefault(u => u.Id == userId);
         AppLog log = new AppLog(message, type, obj, user);
         _DbContext.AppLogs.Add(log);
         Task.Run(() => _DbContext.SaveChangesAsync());
         return log;
      }
      internal string LogException(string message, dynamic obj = null, ClaimsPrincipal userClaimsPrincipal = null, AppLogType type = AppLogType.Exception)
      {
         User user = null;
         if (userClaimsPrincipal != null)
            user = _DbContext.Users.SingleOrDefault(u => u.Id == AppFunc.GetUserId(userClaimsPrincipal));
         AppLog log = new AppLog(message, type, obj, user);
         _DbContext.AppLogs.Add(log);
         Task.Run(() => _DbContext.SaveChangesAsync());
         return CoreConst.CommonErrors.ServerError(log.Id);
      }
      internal string LogEmailFailure(string message, dynamic obj = null, User user = null, AppLogType type = AppLogType.EmailFailure)
      {
         AppLog log = new AppLog(message, type, obj, user);
         _DbContext.AppLogs.Add(log);
         Task.Run(() => _DbContext.SaveChangesAsync());
         return CoreConst.CommonErrors.ServerError(log.Id);
      }

   }
}
