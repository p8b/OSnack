
using Newtonsoft.Json;

using OSnack.API.Extras.CustomTypes;

using P8B.Core.CSharp;

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

namespace OSnack.API.Database.Models
{
   [Table("EmailTemplates")]
   public class EmailTemplate
   {
      [Key,
         DefaultValue(0)]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(256)")]
      public string Name { get; set; }
      [Required(ErrorMessage = "Type Is Required \n")]
      public EmailTemplateTypes TemplateType { get; set; }

      [Required(ErrorMessage = "Subject Is Required \n")]
      public string Subject { get; set; } = "";

      public string TokenUrlPath { get; set; }

      [NotMapped]
      public List<EmailTemplateServerClass> ServerClasses { get; set; }

      [JsonIgnore]
      public string HtmlPath { get; set; }

      [JsonIgnore]
      public string DesignPath { get; set; }


      [NotMapped,
         Required(ErrorMessage = "HTML Template Is Required \n")]
      public string HTML { get; set; }

      [NotMapped,
         Required(ErrorMessage = "Design File Is Required \n")]
      public dynamic Design { get; set; }

      internal void SaveFilesToWWWRoot(string webRootPath)
      {

         var SelectedFolder = Path.Combine(webRootPath, $"EmailTemplates");
         DeleteFiles(webRootPath);

         if (!Directory.Exists(Path.Combine(SelectedFolder, TemplateType.ToString())))
            Directory.CreateDirectory(Path.Combine(SelectedFolder, TemplateType.ToString()));

         HtmlPath = string.Format(@"{0}\html-{1}.html", TemplateType.ToString(), new Random().Next(0, 100));
         DesignPath = string.Format(@"{0}\design-{1}.json", TemplateType.ToString(), new Random().Next(0, 100));

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

      internal void RemoveHtmlComment() =>
         HTML = new Regex(@"<!--(.*?)-->", RegexOptions.Compiled).Replace(HTML, "");

      internal void SetServerClasses()
      {
         ServerClasses = new List<EmailTemplateServerClass>();
         var CurrentTypeCustomAttributes = typeof(EmailTemplateTypes).GetMember(TemplateType.ToString()).FirstOrDefault().CustomAttributes.FirstOrDefault(c => c.AttributeType.Name.Equals("EmailTemplateTypeServerClassesAttribute") || c.AttributeType.Name.Equals("EmailTemplateTypeServerClasses"));
         if (CurrentTypeCustomAttributes != null)
         {
            foreach (var itemClass in (IReadOnlyCollection<CustomAttributeTypedArgument>)CurrentTypeCustomAttributes.ConstructorArguments.FirstOrDefault().Value)
            {
               var selectedClass = (Type)itemClass.Value;
               var properties = selectedClass.GetProperties().Where(p => p.CustomAttributes.Any(c => c.AttributeType.Name.Equals("EmailTemplateVariableAttribute")));
               if (properties.Count() > 0)
               {
                  var serverClass = new EmailTemplateServerClass()
                  {
                     Value = Enum.Parse<EmailTemplateClassNames>(selectedClass.Name),
                     ClassProperties = new List<ClassProperty>()
                  };
                  foreach (var prop in properties)
                  {
                     var attributeArguments = prop.CustomAttributes
                        .FirstOrDefault(c => c.AttributeType.Name.Equals("EmailTemplateVariableAttribute")).NamedArguments;

                     if (attributeArguments.Any(a => a.MemberName.Equals("ListNames")))
                     {
                        var values = (IReadOnlyCollection<CustomAttributeTypedArgument>)attributeArguments.FirstOrDefault(a => a.MemberName.Equals("ListNames")).TypedValue.Value;
                        for (int i = 0; i < values.Count; i++)
                        {
                           serverClass.ClassProperties.Add(new ClassProperty()
                           {
                              Name = prop.Name,
                              TemplateName = $"@@{values.ToArray()[i].Value}@@",
                              IsIgnored = (i > 0)
                           });
                        };
                     }
                     else if (attributeArguments.Any(a => a.MemberName.Equals("Name")))
                     {
                        string TemplateName = attributeArguments.FirstOrDefault().TypedValue.Value.ToString();
                        serverClass.ClassProperties.Add(new ClassProperty()
                        {
                           Name = prop.Name,
                           TemplateName = $"@@{TemplateName}@@",
                        });
                     }
                     else
                     {
                        serverClass.ClassProperties.Add(new ClassProperty()
                        {
                           Name = prop.Name,
                           TemplateName = $"@@{prop.Name}@@",
                        });
                     }

                  }
                  ServerClasses.Add(serverClass);
               }
            }
         }

      }
   }

   public class EmailTemplateServerClass
   {
      public EmailTemplateClassNames Value { get; set; }

      public List<ClassProperty> ClassProperties { get; set; }

      public EmailTemplate EmailTemplate { get; set; }
   }

   public class ClassProperty
   {
      public string Name { get; set; }
      public string TemplateName { get; set; }
      public bool IsIgnored { get; set; } = false;
   }
}
