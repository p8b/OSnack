using MailKit.Net.Smtp;
using MailKit.Security;

using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

using MimeKit;

using OSnack.API.Database;
using OSnack.API.Database.Models;
using OSnack.API.Extras.CustomTypes;

using P8B.Core.CSharp.Extentions;
using P8B.Core.CSharp.Models;

using System;
using System.IO;
using System.Linq;
using System.Net.Security;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace P8B.UK.API.Services
{
   public class EmailService
   {

      #region *** Properties ***
      private byte[] _Attachment { set; get; }
      private LoggingService _LoggingService { get; }
      private EmailSettings _EmailSettings { get; }
      private OSnackDbContext _DbContext { get; }
      private IWebHostEnvironment _WebEnv { get; }
      #endregion

      public EmailService() { }
      public EmailService(
          EmailSettings emailSettings,
          LoggingService loggingService,
          IWebHostEnvironment webEnv,
          OSnackDbContext dbContext)
      {
         /// Set the class attributes with the objects received from their
         /// corresponding middle-ware
         _EmailSettings = emailSettings;
         _DbContext = dbContext;
         _WebEnv = webEnv;
         _LoggingService = loggingService;
      }

      /// <summary>
      ///     This method is used to welcome message for user with external login at registration
      /// </summary>
      /// <param name="user">The user object</param>
      /// <returns>bool: true (if email is send correctly) else false</returns>
      public async Task<bool> ExternalRegistrationWelcomeAsync(User user)
      {
         string templateName = "Welcome External Registration";
         try
         {
            return await PopulateHtmlWithServerVariables(templateName, user)
               .ConfigureAwait(false);
         }
         catch (Exception ex)
         {
            _LoggingService.LogEmailFailure(ex.Message, new { ex, templateName }, user);
            return false;
         }
      }

      /// <summary>
      ///     This method is used to send token to the user after registration in order to
      ///     validate their email address.
      /// </summary>
      /// <param name="user">The user object</param>
      /// <param name="ExpiaryDate">The expiry date for token</param>
      /// <returns>bool: true (if email is send correctly) else false</returns>
      public async Task<bool> EmailConfirmationAsync(User user, string DomainUrl)
      {
         string templateName = "Email Confirmation";
         try
         {
            return await PopulateHtmlWithServerVariables(templateName, user
               , new Token
               {
                  Type = TokenTypes.ConfirmEmail,
                  UrlDomain = DomainUrl,
               }
               , DateTime.UtcNow.AddYears(1))
               .ConfigureAwait(false);
         }
         catch (Exception ex)
         {
            _LoggingService.LogEmailFailure(ex.Message, new { ex, templateName, domainUrl = DomainUrl }, user);
            return false;
         }
      }

      /// <param name="user">The user object</param>
      /// <param name="DomainUrl">Domain set for the token</param>
      /// <returns>bool: true (if email is send correctly) else false</returns>
      public async Task<bool> NewEmployeePasswordAsync(User user, string DomainUrl)
      {
         string templateName = "Welcome New Employee";
         try
         {
            return await PopulateHtmlWithServerVariables(templateName, user
               , new Token
               {
                  Type = TokenTypes.ChangePassword,
                  UrlDomain = DomainUrl,
               }
               , DateTime.UtcNow.AddDays(5))
               .ConfigureAwait(false);
         }
         catch (Exception ex)
         {
            _LoggingService.LogEmailFailure(ex.Message, new { ex, templateName, domainUrl = DomainUrl }, user);
            return false;
         }
      }

      /// <summary>
      ///     This method is used to email a token value to the user in order to rest their password
      /// </summary>
      /// <param name="user">User object</param>                            
      /// <param name="DomainUrl">Domain set for the token</param>
      /// <returns>bool: true (if email is send correctly) else false</returns>
      public async Task<bool> PasswordResetAsync(User user, string DomainUrl)
      {
         string templateName = "Welcome New Employee";
         try
         {
            return await PopulateHtmlWithServerVariables("Password Reset", user
               , new Token
               {
                  Type = TokenTypes.ChangePassword,
                  UrlDomain = DomainUrl,
               }
               , DateTime.UtcNow.AddHours(5));
         }
         catch (Exception ex)
         {
            _LoggingService.LogEmailFailure(ex.Message, new { ex, templateName, domainUrl = DomainUrl }, user);
            return false;
         }
      }

      /// <summary>
      ///     This method is used to send emails by using the email settings passed to this class
      /// </summary>
      /// <param name="name">The Receiver's Name</param>
      /// <param name="email">The Receiver's Email</param>
      /// <param name="subject">Subject of the email</param>
      /// <param name="htmlMessage">the body of the email which can include HTML tags</param>
      /// <returns>void</returns>
      public async Task SendEmailAsync(string name, string email, string subject, string htmlMessage)
      {

         /// Create a MineMessage object to setup an instance of email to be send
         MimeMessage message = new MimeMessage();

         /// Add the email settings for the sender of the email
         message.From.Add(new MailboxAddress(_EmailSettings.SenderName, _EmailSettings.Sender));

         /// Add the destination email to the message
         message.To.Add(new MailboxAddress(name, email));

         /// Add the subject of the email
         message.Subject = subject;

         /// Set the body of the email and type
         BodyBuilder bodyBuilder = new BodyBuilder()
         {
            TextBody = HtmlToPlainText(htmlMessage),
            HtmlBody = htmlMessage
         };

         /// if Email must have an attachment then add it to the multi part email
         if (_Attachment != null)
         {
            /// Open a memory stream for
            using (MemoryStream attSteam = new MemoryStream(_Attachment))
            {
               MimePart attachment = new MimePart("application", "PDF");
               attachment.Content = new MimeContent(attSteam, ContentEncoding.Default);
               attachment.ContentDisposition = new ContentDisposition(ContentDisposition.Attachment);
               attachment.ContentTransferEncoding = ContentEncoding.Base64;
               attachment.FileName = "Invoice";
               bodyBuilder.Attachments.Add(attachment);
            }
         }

         /// Set the message body to the value of multi part email
         message.Body = bodyBuilder.ToMessageBody();

         /// Create a disposable "SmtpClient" object in order to send the email
         using (SmtpClient client = new SmtpClient())
         {
            /// call back method that validates the server certificate for security purposes
            client.ServerCertificateValidationCallback = (sender, certificate, chain, errors) =>
            {
               /// if there are no errors in the certificate then validate the check
               if (errors == SslPolicyErrors.None || !_EmailSettings.SslCheck)
                  return true;
               else if (errors.Equals(SslPolicyErrors.RemoteCertificateNameMismatch) && certificate.Subject.Equals("CN=*.a2hosting.com, O=A2 Hosting, Inc., L=Ann Arbor, S=Michigan, C=US"))
                  return true;
               else if (_EmailSettings.MailServer.Equals(sender))
                  return true;

               /// which both should be denied
               return false;
            };

            /// Try connecting to the smtp server using SSL connection
            await client.ConnectAsync(
                _EmailSettings.MailServer,
                _EmailSettings.MailPort,
                SecureSocketOptions.SslOnConnect).ConfigureAwait(false);

            /// Pass the authentication information to the connected server to perform outgoing email request
            await client.AuthenticateAsync(_EmailSettings.Sender, _EmailSettings.Password).ConfigureAwait(false);

            /// use the smtp client to send the email
            await client.SendAsync(message).ConfigureAwait(false);

            /// disconnect the smpt client connection
            await client.DisconnectAsync(true).ConfigureAwait(false);
         }
      }

      private async Task<bool> PopulateHtmlWithServerVariables(string templateName, User user, Token token = null,
         DateTime expiaryDate = new DateTime())
      {
         EmailTemplate template = await _DbContext.EmailTemplates
            .Include(et => et.ServerVariables)
            .FirstOrDefaultAsync(et => et.Name.Equals(templateName)).ConfigureAwait(false);

         if (template == null)
            throw new Exception("Email Template cannot be found.");

         template.PrepareHtml(_WebEnv.WebRootPath);

         foreach (var item in template.ServerVariables)
         {
            switch (item.EnumValue)
            {
               case EmailTemplateServerVariables.UserName:
                  template.HTML = template.HTML.Replace(item.ReplacementValue, $"{user.FirstName.FirstCap()} {user.Surname.FirstCap()}");
                  break;
               case EmailTemplateServerVariables.RegistrationMethod:
                  template.HTML = template.HTML.Replace(item.ReplacementValue, $"{user.RegistrationMethod.Type}");
                  break;
               case EmailTemplateServerVariables.Role:
                  template.HTML = template.HTML.Replace(item.ReplacementValue, user.Role.Name);
                  break;
               case EmailTemplateServerVariables.ExpiaryDateTime:
                  template.HTML = template.HTML.Replace(item.ReplacementValue, $"{expiaryDate.ToLongDateString()} {expiaryDate.ToShortTimeString()}");
                  break;
               case EmailTemplateServerVariables.TokenUrl:
                  if (token == null)
                     throw new Exception("Token Is Required.");
                  token.GenerateToken(user, expiaryDate, _DbContext, template.TokenUrlPath);
                  template.HTML = template.HTML.Replace(item.ReplacementValue, token?.Url);
                  break;
               default:
                  break;
            }
         }

         int timerDelayms = 1000;
         /// local method to retry sending the message 4 times if email failed to send.
         /// delay by 1000, 2000, 4000, 16000 (ms)
         async Task sendMail()
         {
            try
            {
               await SendEmailAsync($"{user.FirstName} {user.Surname}", user.Email, template.Subject, template.HTML).ConfigureAwait(false);
            }
            catch (Exception)
            {
               System.Threading.Thread.Sleep(timerDelayms);
               if (timerDelayms > 16000)
               {
                  timerDelayms = 1000;
                  throw;
               }
               timerDelayms *= 2;
               await SendEmailAsync($"{user.FirstName} {user.Surname}", user.Email, template.Subject, template.HTML).ConfigureAwait(false);
            }
         }
         await sendMail().ConfigureAwait(false);
         return true;
      }

      private string HtmlToPlainText(string html)
      {
         Regex[] _htmlReplaces = new[] {
            new Regex(@"<script\b[^<]*(?:(?!</script>)<[^<]*)*</script>", RegexOptions.Compiled | RegexOptions.Singleline, TimeSpan.FromSeconds(1)),
            new Regex(@"<style\b[^<]*(?:(?!</style>)<[^<]*)*</style>", RegexOptions.Compiled | RegexOptions.Singleline, TimeSpan.FromSeconds(1)),
            new Regex(@"<xml\b[^<]*(?:(?!</style>)<[^<]*)*</xml>", RegexOptions.Compiled | RegexOptions.Singleline, TimeSpan.FromSeconds(1)),
            new Regex(@"<[^>]*>", RegexOptions.Compiled),
            new Regex(@" +", RegexOptions.Compiled)
          };

         foreach (var r in _htmlReplaces)
         {
            html = r.Replace(html, " ");
         }
         var lines = html
             .Split(new[] { '\r', '\n' })
             .Select(_ => System.Net.WebUtility.HtmlDecode(_.Trim()))
             .Where(_ => _.Length > 0)
             .ToArray();
         return string.Join("\n", lines);
      }
   }
}
