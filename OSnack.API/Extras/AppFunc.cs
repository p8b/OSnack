using System.Linq;
using System.Security.Claims;

namespace OSnack.API.Extras
{
    public static class AppFunc
    {
        public static int GetUserId(ClaimsPrincipal userClaimsPrincipal)
        {
            int.TryParse(userClaimsPrincipal.Claims.FirstOrDefault(
                           c => c.Type == "UserId")?.Value, out int userId);
            return userId;
        }
    }
}
