using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Primitives;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

using NJsonSchema.Infrastructure;

using NSwag.CodeGeneration.TypeScript;

using OSnack.API.Database;
using OSnack.API.Database.Context.ClassOverrides;
using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp.Extentions;
using P8B.Core.CSharp.Models.Interfaces;
using P8B.UK.API.Extras.Overrides;
using P8B.UK.API.Services;

namespace OSnack.API
{
   public class Startup
   {
      internal IConfiguration Configuration { get; }
      internal const string AuthSchemeApplication = "Identity.Application";
      internal const string CoresPolicy = "CorsPolicy";
      public Startup(IConfiguration configuration) => Configuration = configuration;

      public void ConfigureServices(IServiceCollection services)
      {
         /// Enable API calls from specified origins only
         services.AddCors(options =>
         {
            options.AddPolicy(CoresPolicy,
                builder => builder
                .AllowCredentials()
                .WithOrigins(AppConst.Settings.OpenCors)
                .AllowAnyMethod()
                .WithHeaders("Accept",
                "content-type",
                "X-AF-TOKEN"
                ));
         });

         /// Add the anti-forgery service and identify the
         /// the header name of the request to identify and validate the token
         services.AddAntiforgery(options =>
         {
            options.HeaderName = "X-AF-TOKEN";
            options.Cookie.HttpOnly = true;
            options.Cookie.SameSite = SameSiteMode.Strict;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
         });

         /// Pass the SQL server connection to the db context
         /// receive the connection string from the settings.json
         services.AddDbContext<OSnackDbContext>(options => options
         .UseSqlServer(AppConst.Settings.DbConnectionString())
         .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));

         /// Add .Net Core Identity to the pipe-line with the following options
         services.AddIdentityCore<User>(options =>
         {
            options.ClaimsIdentity.UserIdClaimType = "UserId";
            options.ClaimsIdentity.SecurityStampClaimType = "SecurityStamp";
            options.ClaimsIdentity.RoleClaimType = AppConst.AccessClaims.Type;
            options.User.RequireUniqueEmail = true;
            options.Password = new PasswordOptions
            {
               RequireDigit = true,
               RequiredLength = 4,
               RequiredUniqueChars = 1,
               RequireLowercase = true,
               RequireNonAlphanumeric = true,
               RequireUppercase = true
            };
            //options.Stores.ProtectPersonalData = true;

         })
         .AddEntityFrameworkStores<OSnackDbContext>()// Add the custom db context class
         .AddSignInManager<OSnackSignInManager<User>>() // add the custom SignInManager class
         .AddDefaultTokenProviders(); // Allow the use of tokens

         services.Replace(ServiceDescriptor.Scoped<IUserValidator<User>,
           OSnackUserValidator<User>>());

         /// local static function to set the cookie authentication option
         static void CookieAuthOptions(CookieAuthenticationOptions options)
         {
            options.LoginPath = "/Login";
            options.LogoutPath = "/Logout";
            options.AccessDeniedPath = "/AccessDenied";
            options.ClaimsIssuer = "OSnack";
            options.ExpireTimeSpan = TimeSpan.FromDays(2);
            options.SlidingExpiration = true;
            options.Cookie.SameSite = SameSiteMode.Lax;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
         }
         /// Add authentication services to the pipeline
         services.AddAuthentication()
            .AddCookie(AuthSchemeApplication, CookieAuthOptions);

         /// Add Authorization policies for Admin, Manager, Staff and Customer
         services.AddAuthorization(options =>
         {
            options.AddPolicy(AppConst.AccessPolicies.Official, policy =>
            {
               policy.AuthenticationSchemes.Add(AuthSchemeApplication);
               policy.RequireAuthenticatedUser();
               policy.RequireClaim(AppConst.AccessClaims.Type
                                   , new string[] { AppConst.AccessClaims.Admin,
                                                    AppConst.AccessClaims.Manager,
                                                    AppConst.AccessClaims.Customer});
            });
            options.AddPolicy(AppConst.AccessPolicies.Secret, policy =>
            {
               policy.AuthenticationSchemes.Add(AuthSchemeApplication);
               policy.RequireAuthenticatedUser();
               policy.RequireClaim(AppConst.AccessClaims.Type
                                   , new string[] { AppConst.AccessClaims.Admin,
                                                    AppConst.AccessClaims.Manager });
            });
            options.AddPolicy(AppConst.AccessPolicies.TopSecret, policy =>
            {
               policy.AuthenticationSchemes.Add(AuthSchemeApplication);
               policy.RequireAuthenticatedUser();
               policy.RequireClaim(AppConst.AccessClaims.Type
                                   , new string[] { AppConst.AccessClaims.Admin });
            });
         });



         //// Add email service as a Transient service middle-ware so that each class implementing this
         //// middle-ware will receive a new object of oEmailService class
         services.AddTransient<IEmailService, EmailService>();

         //// Add MVC services to the pipeline
         services.AddMvc(options => options.EnableEndpointRouting = false)
            .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
            .WithRazorPagesRoot("/Extras/RootPage");


         services
             .AddControllers()
             .AddNewtonsoftJson(options => options.SerializerSettings.Converters.Add(new StringEnumConverter()));

         // Register the Swagger services
         //services.AddOpenApiDocument(document =>
         //{
         //   document.DocumentName = "OpenApi";
         //   var test = new JsonSerializerSettings();
         //   var test1 = new PropertyRenameAndIgnoreSerializerContractResolver();
         //   test1.RenameProperty(typeof(IdentityUser), "PasswordHash", "xxxxxxxx");
         //   test.ContractResolver = test1;
         //   document.SerializerSettings = test;
         //});
         services.AddSwaggerDocument(document =>
         {
            document.DocumentName = "SwaggerDoc";

            var test = new JsonSerializerSettings();
            var test1 = new PropertyRenameAndIgnoreSerializerContractResolver();
            test1.RenameProperty(typeof(IdentityUser), "PasswordHash", "xxxxxxxx");
            test.ContractResolver = test1;
            document.SerializerSettings = test;

         });
      }

      public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IAntiforgery antiforgery)
      {
         //  CookieOptions antiForgeryCookieOptions;
         if (env.IsDevelopment())
         {
            app.UseDeveloperExceptionPage();

            //// Register the Swagger generator and the Swagger UI middlewares
            ////Launch the app.Navigate to:
            ////http://localhost:<port>/swagger to view the Swagger UI.
            ////http://localhost:<port>/swagger/v1/swagger.json to view the Swagger specification
            app.UseOpenApi(config =>
            {
               config.PostProcess = (document, request) =>
               {
                  foreach (var classObject in document.Definitions)
                  {
                     if (classObject.Key == "IdentityUserOfInteger")
                     {

                        foreach (var prop in typeof(User).GetProperties())
                        {
                           if (prop.CustomAttributes.Any(i => i.AttributeType.FullName == "Newtonsoft.Json.JsonIgnoreAttribute"))
                              classObject.Value.Properties.Remove(classObject.Value.Properties.SingleOrDefault(i => i.Key == prop.Name));
                        }

                        document.Definitions.Add(new KeyValuePair<string, NJsonSchema.JsonSchema>("UserBase", classObject.Value));
                        document.Definitions.Remove(classObject.Key);
                        break;
                     }
                  }
                  TypeScriptClientGenerator tg = new TypeScriptClientGenerator(document, new TypeScriptClientGeneratorSettings());
                  foreach (var item in tg.GetAllCodeArtifacts())
                  {
                     var test = item.Category;


                  }
               };
               config.Path = "swagger/{documentName}/swagger.json";
            });
            app.UseSwaggerUi3();
         }
         else
         {
            app.UseHsts();
         }
         app.UseHttpsRedirection();

         app.UseCors(CoresPolicy);
         ///// Only the mentioned CORs are allowed.(excepts excluded paths)
         app.Use(next => context =>
         {
            foreach (var element in AppConst.Settings.ExcludedRoutesFromCORS)
            {
               if (context.Request.Path.StartsWithSegments(new PathString(element)))
                  return next(context);
            }

            string OrgPath = context.Request.Path;
            context.Request.Path = "/";
            foreach (var COR in AppConst.Settings.OpenCors)
            {
               if (context.Request.Headers.TryGetValue("Origin", out StringValues Originvalue)
                  && COR.EqualCurrentCultureIgnoreCase(Originvalue.ToString()))
                  context.Request.Path = OrgPath;

               if (env.IsDevelopment() && context.Request.Headers.TryGetValue("Postman-Token", out StringValues fetchType))
                  context.Request.Path = OrgPath;

            }
            return next(context);
         });

         /// Allow the use of static files from wwwroot folder
         app.UseStaticFiles();

         /// Enable the application to use authentication
         app.UseAuthentication();

         app.UseMvc();
      }
   }
}
