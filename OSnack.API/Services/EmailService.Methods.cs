using OSnack.API.Database.Models;
using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;

using System;
using System.Threading.Tasks;

namespace OSnack.API.Services
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
            foreach (EmailTemplateRequiredClass serverClass in Template.RequiredClasses)
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

            Token token = new Token()
            {
               Type = TokenTypes.ConfirmEmail,
               UrlDomain = DomainUrl,
            };
            token.GenerateToken(user, DateTime.UtcNow.AddYears(1), _DbContext, AppConst.Settings.EmailSettings.PathNames.ConfirmEmail);
            foreach (EmailTemplateRequiredClass serverClass in Template.RequiredClasses)
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

            Token token = new Token()
            {
               Type = TokenTypes.ChangePassword,
               UrlDomain = DomainUrl,
            };
            token.GenerateToken(user, DateTime.UtcNow.AddDays(2), _DbContext, AppConst.Settings.EmailSettings.PathNames.NewEmployee);
            foreach (EmailTemplateRequiredClass serverClass in Template.RequiredClasses)
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
            Token token = new Token()
            {
               Type = TokenTypes.ChangePassword,
               UrlDomain = DomainUrl,
            };
            token.GenerateToken(user, DateTime.UtcNow.AddHours(5), _DbContext, AppConst.Settings.EmailSettings.PathNames.PasswordReset);
            foreach (EmailTemplateRequiredClass serverClass in Template.RequiredClasses)
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
            foreach (EmailTemplateRequiredClass serverClass in Template.RequiredClasses)
            {
               SetTemplateServerPropValue(serverClass, order);
               SetTemplateServerPropValue(serverClass, order.Payment);
            }

            string email = order.Payment.Email;

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

      public async Task<bool> OrderDisputeAsync(Order order)
      {
         try
         {
            await SetUserTemplate(EmailTemplateTypes.OrderDispute).ConfigureAwait(false);
            foreach (EmailTemplateRequiredClass serverClass in Template.RequiredClasses)
            {
               SetTemplateServerPropValue(serverClass, order);
            }

            string email = order.Payment.Email;

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
      public async Task<bool> OrderCancelationAsync(Order order, Communication dispute)
      {
         try
         {
            await SetUserTemplate(EmailTemplateTypes.OrderReceipt).ConfigureAwait(false);
            foreach (EmailTemplateRequiredClass serverClass in Template.RequiredClasses)
            {
               SetTemplateServerPropValue(serverClass, order);
               SetTemplateServerPropValue(serverClass, order.Payment);
            }

            string email = order.Payment.Email;

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
