using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Primitives;

using OSnack.API.Database;
using OSnack.API.Database.Context.ClassOverrides;
using OSnack.API.Database.Models;
using OSnack.API.Extras;

using P8B.Core.CSharp.Models;
using P8B.UK.API.Extras.Overrides;

using System;
using System.IO;

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
         var test = services.AddDbContext<OSnackDbContext>(options => options
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
               RequiredLength = 8,
               RequiredUniqueChars = 1,
               RequireLowercase = true,
               RequireNonAlphanumeric = true,
               RequireUppercase = true
            };
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
            options.AddPolicy(AppConst.AccessPolicies.Public, policy =>
            {
               policy.AuthenticationSchemes.Add(AuthSchemeApplication);
               policy.Requirements.Add(new EmptyRequirement());
            });
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

         services.Configure<ApiBehaviorOptions>(options =>
         {
            options.SuppressModelStateInvalidFilter = true;
         });


         //// Add MVC services to the pipeline
         services.AddMvc(options => options.EnableEndpointRouting = false)
            .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
            .WithRazorPagesRoot("/Extras/RootPage");


         services.AddControllers().AddNewtonsoftJson();

         // Register the Swagger services
         foreach (var policy in AppConst.AccessPolicies.List)
         {
            services.AddOpenApiDocument(document =>
            {
               document.DocumentName = $"OSnack {policy}";
               document.Title = $"{policy}";
               document.AuthorizationPolicyNames = new string[] { policy };
               document.IsModelOnly = false;
            });
         }

         services.AddSingleton<IAuthorizationHandler, EmptyHandler>();
         services.AddOpenApiDocument(document =>
         {
            document.DocumentName = $"OSnack Models";
            document.Title = $"Models";
            document.AuthorizationPolicyNames = new string[] { };
            document.IsModelOnly = true;
         });
      }
      public void Configure(IApplicationBuilder app,
         IWebHostEnvironment env,
         IAntiforgery antiforgery)
      {
         //  CookieOptions antiForgeryCookieOptions;
         if (env.IsDevelopment())
         {
            app.UseDeveloperExceptionPage();

            app.UseStaticFiles(new StaticFileOptions
            {
               FileProvider = new PhysicalFileProvider(
                  Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles"))
            });
            //// Register the Swagger generator and the Swagger UI middlewares
            app.UseOpenApi(config =>
            {
               config.PostProcess = (document, request) =>
                             AppFunc.MakeClientZipFile(document, Directory.GetCurrentDirectory());
               config.Path = "/swagger/{documentName}/swagger.json";
            });
            app.UseSwaggerUi3(config =>
            {
               config.ValidateSpecification = true;
            });
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
               if (env.IsDevelopment())
                  context.Request.Path = OrgPath;
               else if (context.Request.Headers.TryGetValue("Origin", out StringValues Originvalue)
                  && COR.EqualCurrentCultureIgnoreCase(Originvalue.ToString()))
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
