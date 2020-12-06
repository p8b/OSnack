using Microsoft.AspNetCore.Authentication;

using Newtonsoft.Json;

using OSnack.API.Extras;
using OSnack.API.Extras.CustomTypes;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Models;

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Reflection;
using System.Text.RegularExpressions;

namespace OSnack.API.Database.Models
{
   [Table("EmailTemplates")]
   public class EmailTemplate
   {
      [Key]
      [DefaultValue(0)]
      public int Id { get; set; }

      [StringLength(50, ErrorMessage = "Must be less than 50 Characters \n")]
      [Required(ErrorMessage = "Name Is Required \n")]
      public string Name { get; set; }

      [Required(ErrorMessage = "Subject Is Required \n")]
      public string Subject { get; set; } = "";

      public string TokenUrlPath { get; set; }
      public List<ServerVariables> ServerVariables { get; set; }

      public bool Locked { get; set; } = true;

      public bool IsDefaultTemplate { get; set; } = false;

      [JsonIgnore]
      public string HtmlPath { get; set; }

      [JsonIgnore]
      public string DesignPath { get; set; }


      [NotMapped]
      [Required(ErrorMessage = "HTML Template Is Required \n")]
      public string HTML { get; set; }

      [NotMapped]
      [Required(ErrorMessage = "Design File Is Required \n")]
      public dynamic Design { get; set; }

      internal void SaveFilesToWWWRoot(string webRootPath)
      {

         var SelectedFolder = Path.Combine(webRootPath, $"EmailTemplates");
         DeleteFiles(webRootPath);

         if (!Directory.Exists(Path.Combine(SelectedFolder, Name)))
            Directory.CreateDirectory(Path.Combine(SelectedFolder, Name));

         HtmlPath = string.Format(@"{0}\html-{1}.html", Name, new Random().Next(0, 100));
         DesignPath = string.Format(@"{0}\design-{1}.json", Name, new Random().Next(0, 100));

         RemoveHtmlComment();
         File.WriteAllText(Path.Combine(SelectedFolder, HtmlPath), HTML);
         File.WriteAllText(Path.Combine(SelectedFolder, DesignPath), JsonConvert.SerializeObject(Design));
      }

      internal void PrepareDesign(string webRootPath)
      {
         /// Get the directory of the app settings.json file
         var SelectedFile = Path.Combine(webRootPath, $"EmailTemplates\\{DesignPath}");
         /// If above file does not exists check the android path.
         if (File.Exists(SelectedFile))
            /// Read the json file from that directory
            /// de-serialise the json string into an object of dynamic
            Design = JsonConvert.DeserializeObject<dynamic>(File.ReadAllText(SelectedFile));
      }

      internal void PrepareHtml(string webRootPath)
      {
         /// Get the directory of the app settings.json file                                              
         var SelectedFile = Path.Combine(webRootPath, $"EmailTemplates\\{HtmlPath}");
         /// If above file does not exists check the android path.
         if (File.Exists(SelectedFile))
            /// Read the html file from that directory
            HTML = File.ReadAllText(SelectedFile);
      }

      internal void DeleteFiles(string webRootPath)
      {
         if (!string.IsNullOrWhiteSpace(HtmlPath))
            CoreFunc.DeleteFromWWWRoot(HtmlPath, $"{webRootPath}\\EmailTemplates");
         if (!string.IsNullOrWhiteSpace(DesignPath))
            CoreFunc.DeleteFromWWWRoot(DesignPath, $"{webRootPath}\\EmailTemplates");

         CoreFunc.ClearEmptyEmailTemplateFolders(webRootPath);
      }

      internal bool ValidateHTMLServerVariables(ref List<Error> ErrorList)
      {
         if (ServerVariables != null)
         {

            foreach (ServerVariables item in ServerVariables)
            {
               // if tokenUrl is added to the attached email template but the value of URL path is not
               if (item.EnumValue == EmailTemplateServerVariables.TokenUrl && string.IsNullOrEmpty(TokenUrlPath))
                  ErrorList.Add(new Error("TokenUrlPath", "Token URL is Required"));


               if (!HTML.Contains(item.ReplacementValue))
                  ErrorList.Add(new Error(item.ReplacementValue, $"Server Variable {item.ReplacementValue } is Required"));

               /// Set to 0 so it would not conflict with dbContext
               item.Id = 0;
            }
         }

         if (ErrorList.Count > 0)
            return false;
         else
            return true;
      }

      internal void RemoveHtmlComment() =>
         HTML = new Regex(@"<!--(.*?)-->", RegexOptions.Compiled).Replace(HTML, "");
   }
}
