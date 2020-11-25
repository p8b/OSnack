using MimeKit;
using MailKit.Net.Smtp;
using P8B.Core.CSharp.Models;
using P8B.Core.CSharp.Models.Interfaces;

using System.Threading.Tasks;
using System.Net.Security;
using MailKit.Security;
using OSnack.API.Database;
using Microsoft.AspNetCore.Http;
using OSnack.API.Database.Models;
using System;
using OSnack.API.Extras.CustomTypes;
using P8B.Core.CSharp.Extentions;
using Newtonsoft.Json;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using P8B.Core.CSharp;
using OSnack.API.Extras;
using Microsoft.EntityFrameworkCore;

namespace P8B.UK.API.Services
{
   public class EmailService : IEmailService
   {

      #region *** Properties ***
      private byte[] _Attachment { set; get; }
      private EmailSettings _EmailSettings { get; }
      private OSnackDbContext _DbContext { get; }
      private IWebHostEnvironment _WebEnv { get; }
      #endregion

      public EmailService() { }
      public EmailService(
          EmailSettings emailSettings,
          IWebHostEnvironment webEnv,
          OSnackDbContext dbContext)
      {
         /// Set the class attributes with the objects received from their
         /// corresponding middle-ware
         _EmailSettings = emailSettings;
         _DbContext = dbContext;
         _WebEnv = webEnv;
      }

      /// <summary>
      ///     This method is used to welcome message for user with external login at registration
      /// </summary>
      /// <param name="user">The user object</param>
      /// <returns>bool: true (if email is send correctly) else false</returns>
      public async Task<bool> ExternalRegistrationWelcomeAsync(oUser user)
      {
         try
         {

            return await PopulateHtmlWithServerVariables("Welcome External Registration", user)
               .ConfigureAwait(false);
         }
         catch (Exception err)
         {
            /// if there are any exceptions, Log the exception error
            /// on the database and return false to the caller
            await _DbContext.AppLogs.AddAsync(new oAppLog
            {
               Massage = err.Message,
               JsonObject = JsonConvert.SerializeObject(err),
               User = user
            }).ConfigureAwait(false);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
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
      public async Task<bool> EmailConfirmationAsync(oUser user, string DomainUrl)
      {
         try
         {
            return await PopulateHtmlWithServerVariables("Email Confirmation", user
               , new oToken
               {
                  Type = TokenTypes.ConfirmEmail,
                  UrlDomain = DomainUrl,
               }
               , DateTime.UtcNow.AddYears(1))
               .ConfigureAwait(false);
         }
         catch (Exception err)
         {
            /// if there are any exceptions, Log the exception error
            /// on the database and return false to the caller
            await _DbContext.AppLogs.AddAsync(new oAppLog
            {
               Massage = err.Message,
               JsonObject = JsonConvert.SerializeObject(err),
               User = user
            }).ConfigureAwait(false);
            await _DbContext.SaveChangesAsync();
            return false;
         }
      }

      /// <param name="user">The user object</param>
      /// <param name="DomainUrl">Domain set for the token</param>
      /// <returns>bool: true (if email is send correctly) else false</returns>
      public async Task<bool> NewEmployeePasswordAsync(oUser user, string DomainUrl)
      {
         try
         {
            return await PopulateHtmlWithServerVariables("Welcome New Employee", user
               , new oToken
               {
                  Type = TokenTypes.ChangePassword,
                  UrlDomain = DomainUrl,
               }
               , DateTime.UtcNow.AddDays(5))
               .ConfigureAwait(false);
         }
         catch (Exception err)
         {
            /// if there are any exceptions, Log the exception error
            /// on the database and return false to the caller
            await _DbContext.AppLogs.AddAsync(new oAppLog
            {
               Massage = err.Message,
               JsonObject = JsonConvert.SerializeObject(err),
               User = user
            }).ConfigureAwait(false);
            await _DbContext.SaveChangesAsync().ConfigureAwait(false);
            return false;
         }
      }

      /// <summary>
      ///     This method is used to email a token value to the user in order to rest their password
      /// </summary>
      /// <param name="user">User object</param>                            
      /// <param name="DomainUrl">Domain set for the token</param>
      /// <returns>bool: true (if email is send correctly) else false</returns>
      public async Task<bool> PasswordResetAsync(oUser user, string DomainUrl)
      {
         try
         {
            return await PopulateHtmlWithServerVariables("Password Reset", user
               , new oToken
               {
                  Type = TokenTypes.ChangePassword,
                  UrlDomain = DomainUrl,
               }
               , DateTime.UtcNow.AddHours(5));
         }
         catch (Exception)
         {

            ///// if there are any exceptions, Log the exception error
            ///// on the database and return false to the caller
            //await _DbContext.AppLogs.AddAsync(new oAppLog
            //{
            //   Massage = err.Message,
            //   JsonObject = JsonConvert.SerializeObject(err),
            //   User = user
            //});
            //await _DbContext.SaveChangesAsync().ConfigureAwait(false);
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
         TextPart bodyHtml = new TextPart("html")
         {
            Text = htmlMessage
         };


         /// Create a multi part email body in order to enable attachment
         Multipart multiPartEmail = new Multipart("Mail");
         /// Add the body to the multi part email
         multiPartEmail.Add(bodyHtml);

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
               multiPartEmail.Add(attachment);
            }
         }

         /// Set the message body to the value of multi part email
         message.Body = multiPartEmail;

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

      private async Task<bool> PopulateHtmlWithServerVariables(string templateName, oUser user, oToken token = null,
         DateTime expiaryDate = new DateTime())
      {
         oEmailTemplate template = await _DbContext.EmailTemplates
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

   }
}
