
using Newtonsoft.Json;

using OSnack.API.Extras.CustomTypes;

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

      [Required(ErrorMessage = "Type Is Required \n")]
      public EmailTemplateTypes? TemplateType { get; set; }

      [Required(ErrorMessage = "Subject Is Required \n")]
      [Column(TypeName = "nvarchar(100)")]
      [StringLength(100, ErrorMessage = "Subject Must be less than 100 Characters \n")]
      public string Subject { get; set; } = "";

      [NotMapped]
      public List<EmailTemplateRequiredClass> RequiredClasses { get; set; }

      [JsonIgnore]
      public string FolderName { get; set; }

      [NotMapped,
         Required(ErrorMessage = "HTML Template Is Required \n")]
      public string HTML { get; set; }

      [NotMapped,
         Required(ErrorMessage = "Design File Is Required \n")]
      public dynamic Design { get; set; }

      internal void SaveFilesToWWWRoot(string webRootPath)
      {
         FolderName = TemplateType.ToString();
         string selectedFolder = Path.Combine(webRootPath, @$"EmailTemplates\{FolderName}");
         string[] oldFiles = Directory.GetFiles(Path.Combine(webRootPath, $"EmailTemplates\\{FolderName}"));
         if (!Directory.Exists(selectedFolder))
            Directory.CreateDirectory(selectedFolder);

         RemoveHtmlComment();
         File.WriteAllText(Path.Combine(selectedFolder, $"html-{new Random().Next(0, 100)}.html"), HTML);
         File.WriteAllText(Path.Combine(selectedFolder, $"design-{new Random().Next(0, 100)}.json"), JsonConvert.SerializeObject(Design));

         foreach (var item in oldFiles)
         {
            File.Delete(item);
         }
      }

      internal void PrepareDesign(string webRootPath)
      {
         string SelectedFile = Directory
            .GetFiles(Path.Combine(webRootPath, $"EmailTemplates\\{FolderName}"), "*.json")
            .FirstOrDefault();
         if (File.Exists(SelectedFile))
            Design = JsonConvert.DeserializeObject<dynamic>(File.ReadAllText(SelectedFile));
      }

      internal void PrepareHtml(string webRootPath)
      {
         string SelectedFile = Directory
            .GetFiles(Path.Combine(webRootPath, $"EmailTemplates\\{FolderName}"), "*.html")
            .FirstOrDefault();
         if (File.Exists(SelectedFile))
            HTML = File.ReadAllText(SelectedFile);
      }

      internal void RemoveHtmlComment() =>
         HTML = new Regex(@"<!--(.*?)-->", RegexOptions.Compiled).Replace(HTML, "");

      internal void SetServerClasses()
      {
         RequiredClasses = new List<EmailTemplateRequiredClass>();
         // Get the required class types for the selected email template type enum
         CustomAttributeData CurrentRequiredClasses = typeof(EmailTemplateTypes)
            .GetMember(TemplateType.ToString())
            .FirstOrDefault()
            .CustomAttributes
            .FirstOrDefault(c => c.AttributeType.Name.Equals("EmailTemplateTypeRequiredClassesAttribute")
                              || c.AttributeType.Name.Equals("EmailTemplateTypeRequiredClasses"));

         if (CurrentRequiredClasses != null)
         {
            foreach (var itemClass in (IReadOnlyCollection<CustomAttributeTypedArgument>)CurrentRequiredClasses.ConstructorArguments.FirstOrDefault().Value)
            {
               Type selectedClass = (Type)itemClass.Value;
               // Try to get the properties set as email template variable in the selected class
               IEnumerable<PropertyInfo> properties = selectedClass.GetProperties()
                  .Where(p => p.CustomAttributes.Any(c => c.AttributeType.Name.Equals("EmailTemplateVariableAttribute")
                                                       || c.AttributeType.Name.Equals("EmailTemplateVariable")));

               if (properties.Any())
               {
                  EmailTemplateRequiredClass serverClass = new EmailTemplateRequiredClass()
                  {

                     Value = string.Join(" ", Regex.Split(selectedClass.Name, @"(?<!^)(?=[A-Z])")),
                     ClassProperties = new List<ClassProperty>()
                  };
                  foreach (PropertyInfo prop in properties)
                  {
                     IList<CustomAttributeNamedArgument> attributeArguments = prop.CustomAttributes
                        .FirstOrDefault(c => c.AttributeType.Name.Equals("EmailTemplateVariableAttribute")
                                          || c.AttributeType.Name.Equals("EmailTemplateVariable"))
                        .NamedArguments;

                     if (attributeArguments.Any(a => a.MemberName.Equals("ListNames")))
                     {
                        IReadOnlyCollection<CustomAttributeTypedArgument> values = (IReadOnlyCollection<CustomAttributeTypedArgument>)attributeArguments
                           .FirstOrDefault(a => a.MemberName.Equals("ListNames"))
                           .TypedValue.Value;

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
                  RequiredClasses.Add(serverClass);
               }
            }
         }
      }
   }

   public class EmailTemplateRequiredClass
   {
      public string Value { get; set; }

      public List<ClassProperty> ClassProperties { get; set; }
   }

   public class ClassProperty
   {
      public string Name { get; set; }
      public string TemplateName { get; set; }
      public bool IsIgnored { get; set; } = false;
   }
}
