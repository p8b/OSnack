using OSnack.API.Database.Models;
using OSnack.API.Extras.CustomTypes;

using System;
using System.Threading.Tasks;

namespace P8B.UK.API.Services
{
   public partial class EmailService
   {
      public async Task<bool> Others()
      {
         try
         {
            await SetUserTemplate(EmailTemplateTypes.Others).ConfigureAwait(false);
            return true;
         }
         catch (Exception ex)
         {
            _LoggingService.LogEmailFailure(ex.Message, new { ex });
            return false;
         }
      }

      public async Task<bool> WelcomeExternalRegistrationAsync(User user)
      {
         try
         {
            await SetUserTemplate(EmailTemplateTypes.WelcomeExternalRegistration).ConfigureAwait(false);
            foreach (var serverClass in Template.ServerClasses)
            {
               SetTemplateServerPropValue(serverClass, user);
               SetTemplateServerPropValue(serverClass, user.RegistrationMethod);
            }

            await SendEmailAsync($"{user.FirstName} {user.Surname}", user.Email).ConfigureAwait(false);
            return true;
         }
         catch (Exception ex)
         {
            _LoggingService.LogEmailFailure(ex.Message, new { ex });
            return false;
         }
      }

      public async Task<bool> EmailConfirmationAsync(User user, string DomainUrl)
      {
         try
         {
            await SetUserTemplate(EmailTemplateTypes.EmailConfirmation).ConfigureAwait(false);

            var token = new Token()
            {
               Type = TokenTypes.ConfirmEmail,
               UrlDomain = DomainUrl,
            };
            token.GenerateToken(user, DateTime.UtcNow.AddYears(1), _DbContext, Template.TokenUrlPath);
            foreach (var serverClass in Template.ServerClasses)
            {
               SetTemplateServerPropValue(serverClass, user);
               SetTemplateServerPropValue(serverClass, token);
            }


            await SendEmailAsync($"{user.FirstName} {user.Surname}", user.Email).ConfigureAwait(false);
            return true;
         }
         catch (Exception ex)
         {
            _LoggingService.LogEmailFailure(ex.Message, new { ex });
            return false;
         }
      }

      public async Task<bool> WelcomeNewEmployeeAsync(User user, string DomainUrl)
      {
         try
         {
            await SetUserTemplate(EmailTemplateTypes.WelcomeNewEmployee).ConfigureAwait(false);

            var token = new Token()
            {
               Type = TokenTypes.ChangePassword,
               UrlDomain = DomainUrl,
            };
            token.GenerateToken(user, DateTime.UtcNow.AddDays(2), _DbContext, Template.TokenUrlPath);
            foreach (var serverClass in Template.ServerClasses)
            {
               SetTemplateServerPropValue(serverClass, user);
               SetTemplateServerPropValue(serverClass, user.Role);
               SetTemplateServerPropValue(serverClass, token);
            }


            await SendEmailAsync($"{user.FirstName} {user.Surname}", user.Email).ConfigureAwait(false);
            return true;
         }
         catch (Exception ex)
         {
            _LoggingService.LogEmailFailure(ex.Message, new { ex });
            return false;
         }
      }

      public async Task<bool> PasswordResetAsync(User user, string DomainUrl)
      {
         try
         {
            await SetUserTemplate(EmailTemplateTypes.PasswordReset).ConfigureAwait(false);
            var token = new Token()
            {
               Type = TokenTypes.ChangePassword,
               UrlDomain = DomainUrl,
            };
            token.GenerateToken(user, DateTime.UtcNow.AddHours(5), _DbContext, Template.TokenUrlPath);
            foreach (var serverClass in Template.ServerClasses)
            {
               SetTemplateServerPropValue(serverClass, user);
               SetTemplateServerPropValue(serverClass, token);
            }

            await SendEmailAsync($"{user.FirstName} {user.Surname}", user.Email).ConfigureAwait(false);
            return true;
         }
         catch (Exception ex)
         {
            _LoggingService.LogEmailFailure(ex.Message, new { ex });
            return false;
         }
      }

      public async Task<bool> OrderReceiptAsync(Order order)
      {
         try
         {
            await SetUserTemplate(EmailTemplateTypes.OrderReceipt).ConfigureAwait(false);
            foreach (var serverClass in Template.ServerClasses)
            {
               SetTemplateServerPropValue(serverClass, order);
               SetTemplateServerPropValue(serverClass, order.Payment);
            }

            var email = order.Payment.Email;

            if (order.User != null)
               email = order.User.Email;
            await SendEmailAsync($"{order.Name}", email).ConfigureAwait(false);
            return true;
         }
         catch (Exception ex)
         {
            _LoggingService.LogEmailFailure(ex.Message, new { ex });
            return false;
         }
      }

      public async Task<bool> OrderDisputeAsync(Order order, Communication dispute)
      {
         try
         {
            await SetUserTemplate(EmailTemplateTypes.OrderReceipt).ConfigureAwait(false);
            foreach (var serverClass in Template.ServerClasses)
            {
               SetTemplateServerPropValue(serverClass, order);
               SetTemplateServerPropValue(serverClass, order.Payment);
            }

            var email = order.Payment.Email;

            if (order.User != null)
               email = order.User.Email;
            await SendEmailAsync($"{order.Name}", email).ConfigureAwait(false);
            return true;
         }
         catch (Exception ex)
         {
            _LoggingService.LogEmailFailure(ex.Message, new { ex });
            return false;
         }
      }
   }
}
