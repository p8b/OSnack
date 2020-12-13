
using Newtonsoft.Json;

using OSnack.API.Extras.Paypal;

using P8B.Core.CSharp.Models;

namespace OSnack.API.Extras
{
   /// <summary>
   /// class used to have the app setting information in memory
   /// </summary>
   public class Settings
   {
      /// <summary>
      /// The array of allowed CORs (Cross-Origin Request) URL
      /// which are allowed to connect to the web API
      /// </summary>
      [JsonProperty(PropertyName = "OpenCors")]
      public string[] OpenCors { get; set; }
      /// <summary>
      /// Exclude specific routes from CORs check.
      /// Must provide the URI <br/>
      /// e.g. "/Images/test.png" specific file or "/Images" Folder or "/user/post" Route
      /// </summary>
      [JsonProperty(PropertyName = "ExcludedRoutesFromCORS")]
      public string[] ExcludedRoutesFromCORS { get; set; }

      /// <summary>
      /// Brand Name
      /// </summary>
      [JsonProperty(PropertyName = "BrandName")]
      public string BrandName { get; set; }

      /// <summary>
      /// Use for setting the domain of antiforgery token cookie
      /// </summary>
      [JsonProperty(PropertyName = "AntiforgeryCookieDomain")]
      public string AntiforgeryCookieDomain { get; set; }


      /// <summary>
      /// Email settings 
      /// </summary>
      [JsonProperty(PropertyName = "EmailSettings")]
      public EmailSettings EmailSettings { get; set; }

      /// <summary>
      /// PayPal Settings
      /// </summary>
      [JsonProperty(PropertyName = "PayPal")]
      public PayPalSettings PayPal { get; set; }

      /// <summary>
      /// The array of allowed CORs (Cross-Origin Request) URL
      /// which are allowed to connect to the web API
      /// </summary>
      [JsonProperty(PropertyName = "DbConnectionStrings")]
      private string[] _DbConnectionStrings { get; set; }

      public ExternalEmailSecret[] ExternalLoginSecrets { get; set; }

      public string DbConnectionString()
      {
         //static bool checkConnection(string connectionString)
         //{
         //   try
         //   {
         //      using (var con = new SqlConnection(connectionString))
         //      {
         //         con.Open();
         //      }
         //      return true;
         //   }
         //   catch (Exception)
         //   {
         //      return false;
         //   }
         //}

         //string SelectedConnection = "";
         //foreach (string connection in _DbConnectionStrings)
         //{
         //   if (checkConnection(connection))
         //   {
         //      SelectedConnection = connection;
         //      break;
         //   }
         //}
         //return SelectedConnection;
         return _DbConnectionStrings[0];
      }
   }
}
