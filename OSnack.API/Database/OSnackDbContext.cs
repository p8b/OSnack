using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras;
using OSnack.API.Extras.ClassOverrides;

namespace OSnack.API.Database
{

   public class OSnackDbContext : IdentityUserContext<oUser, int,
       OSnackAccessClaim<int>,
       IdentityUserLogin<int>,
       IdentityUserToken<int>>
   {

      public DbSet<oAddress> Addresses { get; set; }
      public DbSet<oCategory> Categories { get; set; }
      public DbSet<oOrder> Orders { get; set; }
      public DbSet<oPayment> Payments { get; set; }
      public DbSet<oOrderItem> OrdersItems { get; set; }
      public DbSet<oProduct> Products { get; set; }
      public DbSet<oToken> Tokens { get; set; }
      public DbSet<oCoupon> Coupons { get; set; }
      public DbSet<oAppLog> AppLogs { get; set; }
      public DbSet<oComment> Comments { get; set; }
      public DbSet<oScore> Scores { get; set; }
      public DbSet<oRegistrationMethod> RegistrationMethods { get; set; }
      public DbSet<oNewsletter> Newsletters { get; set; }
      public DbSet<oRole> Roles { get; set; }
      public DbSet<oEmailTemplate> EmailTemplates { get; set; }
      public DbSet<oDeliveryOption> DeliveryOptions { get; set; }
      public DbSet<OSnackAccessClaim<int>> AccessClaims { get; set; }
      public DbSet<oNutritionalInfo> NutritionalInfos { get; set; }


      protected override void OnModelCreating(ModelBuilder builder)
      {
         base.OnModelCreating(builder);

         #region *** Remove unnecessary Entities added by Identity User Context class ***
         builder.Ignore<IdentityUserLogin<int>>();
         builder.Ignore<IdentityUserToken<int>>();
         #endregion

         #region *** Change table names ***
         builder.Entity<OSnackAccessClaim<int>>().ToTable("AccessClaims");
         builder.Entity<oUser>().ToTable("Users");
         #endregion


         builder.Entity<oCoupon>().Property(c => c.Code).ValueGeneratedNever();

         builder.Entity<OSnackAccessClaim<int>>().HasKey(i => i.UserId);
         builder.Entity<OSnackAccessClaim<int>>().Ignore(i => i.Id);

         builder.Entity<oCategory>().HasIndex(c => c.Name).IsUnique();

         //builder.Entity<oProduct>().HasIndex(p => p.Name).IsUnique();

         builder.Entity<oComment>().HasIndex(u => u.OrderItemId).IsUnique();

         builder.Entity<oScore>().HasIndex(u => u.OrderItemId).IsUnique();

         builder.Entity<oUser>().HasIndex(u => u.Email).IsUnique();
         builder.Entity<oUser>().Ignore(u => u.UserName);
         builder.Entity<oUser>().Ignore(u => u.NormalizedUserName);
         builder.Entity<oUser>().Ignore(u => u.PhoneNumberConfirmed);
         builder.Entity<oUser>().Ignore(u => u.TwoFactorEnabled);
         builder.Entity<oUser>().HasOne(t => t.RegistrationMethod).WithOne(r => r.User).OnDelete(DeleteBehavior.Cascade);
         builder.Entity<oProduct>().HasOne(t => t.NutritionalInfo).WithOne(r => r.Product).OnDelete(DeleteBehavior.Cascade);
         builder.Entity<oAppLog>().HasOne(l => l.User).WithOne().OnDelete(DeleteBehavior.Cascade);
         builder.Entity<oServerVariables>().HasKey(s => s.Id);
         builder.Entity<oEmailTemplate>().HasMany(e => e.ServerVariables).WithOne().OnDelete(DeleteBehavior.Cascade);


         builder.Entity<oToken>().HasOne(t => t.User).WithMany().OnDelete(DeleteBehavior.Cascade);
      }

      public OSnackDbContext(DbContextOptions<OSnackDbContext> options)
          : base(options)
      {
      }
   }
}
