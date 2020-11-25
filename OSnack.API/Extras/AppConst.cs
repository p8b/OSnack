using System;
using System.IO;
using System.Reflection;

using Newtonsoft.Json;

namespace OSnack.API.Extras
{
   public class AppConst
   {
      /// <summary>
      /// Three Levels of access claims within the system.<br />
      /// * Admin<br/>
      /// * Manager<br/>
      /// * Customer
      /// </summary>
      public struct AccessClaims
      {
         public const string Type = "Role";
         public const string Admin = nameof(Admin);
         public const string Manager = nameof(Manager);
         public const string Customer = nameof(Customer);
         public static readonly string[] List =
         { Type, Admin, Manager, Customer  };
      }

      /// <summary>
      /// Four Levels of access policies within the system.<br />
      /// </summary>
      public struct AccessPolicies
      {
         /// <summary>
         /// TopSecret Policy includes the following Roles <br/>
         /// * Admin <br/>
         /// </summary>
         public const string TopSecret = nameof(TopSecret);

         /// <summary>
         /// Secret Policy includes the following Roles <br/>
         /// * Admin <br/>
         /// * Manager <br/>
         /// </summary>
         public const string Secret = nameof(Secret);

         /// <summary>
         /// Official Policy includes the following Roles <br/>
         /// * Admin <br/>
         /// * Manager <br/>
         /// * Customer <br/>
         /// </summary>
         public const string Official = nameof(Official);
      }

      public enum RegistrationTypes
      {
         Application = 0,
         Google = 1,
         Facebook = 2,
         Github = 3
      }

      //public static oDeliveryOption[] DeliveryOptions = {
      //   new oDeliveryOption{
      //      Id=0,
      //      Name ="Free",
      //      Price = (decimal)0.00
      //   },
      //   new oDeliveryOption{
      //      Id=1,
      //      Name ="Standard",
      //      Price = (decimal)5.00
      //   },
      //   new oDeliveryOption{
      //      Id=2,
      //      Name ="First Class",
      //      Price = (decimal)8.00
      //   },
      //};

      /// <summary>
      /// Get the information from the appSettings json file
      /// </summary>
      public static Settings Settings
      {
         get
         {
            /// Get the directory of the app settings.json file
            var jsonFilePath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + @"\Extras\Settings.json";
            /// If above file does not exists check the android path.
            if (!File.Exists(jsonFilePath))
               jsonFilePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Extras\Settings.json");
            /// Read the json file from that directory
            /// de-serialise the json string into an object of AppSettings and return it
            return JsonConvert.DeserializeObject<Settings>(File.ReadAllText(jsonFilePath));
         }
      }

   }
}
