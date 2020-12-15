using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using OSnack.API.Database.Models;
using OSnack.API.Extras.ClassOverrides;

namespace OSnack.API.Database
{

   public class OSnackDbContext : IdentityUserContext<User, int,
       OSnackAccessClaim<int>,
       IdentityUserLogin<int>,
       IdentityUserToken<int>>
   {

      public DbSet<Address> Addresses { get; set; }
      public DbSet<Category> Categories { get; set; }
      public DbSet<Order> Orders { get; set; }
      public DbSet<Payment> Payments { get; set; }
      public DbSet<OrderItem> OrdersItems { get; set; }
      public DbSet<Product> Products { get; set; }
      public DbSet<Token> Tokens { get; set; }
      public DbSet<Coupon> Coupons { get; set; }
      public DbSet<AppLog> AppLogs { get; set; }
      public DbSet<Comment> Comments { get; set; }
      public DbSet<Score> Scores { get; set; }
      public DbSet<RegistrationMethod> RegistrationMethods { get; set; }
      public DbSet<Newsletter> Newsletters { get; set; }
      public DbSet<Role> Roles { get; set; }
      public DbSet<EmailTemplate> EmailTemplates { get; set; }
      public DbSet<DeliveryOption> DeliveryOptions { get; set; }
      public DbSet<OSnackAccessClaim<int>> AccessClaims { get; set; }
      public DbSet<NutritionalInfo> NutritionalInfos { get; set; }


      protected override void OnModelCreating(ModelBuilder builder)
      {
         base.OnModelCreating(builder);

         #region *** Remove unnecessary Entities added by Identity User Context class ***
         builder.Ignore<IdentityUserLogin<int>>();
         builder.Ignore<IdentityUserToken<int>>();
         #endregion

         #region *** Change table names ***
         builder.Entity<OSnackAccessClaim<int>>().ToTable("AccessClaims");
         builder.Entity<User>().ToTable("Users");
         #endregion


         builder.Entity<Coupon>().Property(c => c.Code).ValueGeneratedNever();

         builder.Entity<OSnackAccessClaim<int>>().HasKey(i => i.UserId);
         builder.Entity<OSnackAccessClaim<int>>().Ignore(i => i.Id);

         builder.Entity<Category>().HasIndex(c => c.Name).IsUnique();

         //builder.Entity<oProduct>().HasIndex(p => p.Name).IsUnique();

         builder.Entity<Comment>().HasIndex(u => u.OrderItemId).IsUnique();

         builder.Entity<Score>().HasIndex(u => u.OrderItemId).IsUnique();

         builder.Entity<User>().HasIndex(u => u.Email).IsUnique();
         builder.Entity<User>().Ignore(u => u.UserName);
         builder.Entity<User>().Ignore(u => u.NormalizedUserName);
         builder.Entity<User>().Ignore(u => u.PhoneNumberConfirmed);
         builder.Entity<User>().Ignore(u => u.TwoFactorEnabled);
         builder.Entity<User>().HasOne(t => t.RegistrationMethod).WithOne(r => r.User).OnDelete(DeleteBehavior.Cascade);
         builder.Entity<Product>().HasOne(t => t.NutritionalInfo).WithOne(r => r.Product).OnDelete(DeleteBehavior.Cascade);
         builder.Entity<OrderItem>().HasOne(o => o.Product).WithMany().OnDelete(DeleteBehavior.SetNull);
         builder.Entity<AppLog>().HasOne(l => l.User).WithOne().OnDelete(DeleteBehavior.Cascade);
         builder.Entity<ServerVariables>().HasKey(s => s.Id);
         builder.Entity<EmailTemplate>().HasMany(e => e.ServerVariables).WithOne(e => e.EmailTemplate).OnDelete(DeleteBehavior.Cascade);
         builder.Entity<User>().HasMany(u => u.Orders).WithOne(o => o.User).OnDelete(DeleteBehavior.SetNull);


         builder.Entity<Token>().HasOne(t => t.User).WithMany().OnDelete(DeleteBehavior.Cascade);
      }

      public OSnackDbContext(DbContextOptions<OSnackDbContext> options)
          : base(options)
      {
      }
   }
}
