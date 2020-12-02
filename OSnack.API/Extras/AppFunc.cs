using NSwag;
using NSwag.CodeGeneration.TypeScript;
using OSnack.API.Database.Models;
using P8B.Core.CSharp;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Text;

namespace OSnack.API.Extras
{
   public static class AppFunc
   {
      public static int GetUserId(ClaimsPrincipal userClaimsPrincipal)
      {
         int.TryParse(userClaimsPrincipal.Claims.FirstOrDefault(
                        c => c.Type == "UserId")?.Value, out int userId);
         return userId;
      }

      public static void MakeClientZipFile(OpenApiDocument document)
      {
         foreach (var classObject in document.Definitions)
         {
            if (classObject.Key == "IdentityUserOfInteger")
            {

               foreach (var prop in typeof(User).GetProperties())
               {
                  if (prop.CustomAttributes.Any(i => i.AttributeType.FullName == "Newtonsoft.Json.JsonIgnoreAttribute"))
                     classObject.Value.Properties.Remove(classObject.Value.Properties.SingleOrDefault(i => i.Key.ToLower() == prop.Name.ToLower()));
               }

               document.Definitions.Add(new KeyValuePair<string, NJsonSchema.JsonSchema>("UserBase", classObject.Value));
               document.Definitions.Remove(classObject.Key);
               break;
            }
         }
         TypeScriptClientGenerator tg = new TypeScriptClientGenerator(document, new TypeScriptClientGeneratorSettings()
         {
            ClassName = "{controller}",
            GenerateDtoTypes = true,
            TypeScriptGeneratorSettings =
                     {
                           EnumStyle=NJsonSchema.CodeGeneration.TypeScript.TypeScriptEnumStyle.Enum,
                           TypeStyle=NJsonSchema.CodeGeneration.TypeScript.TypeScriptTypeStyle.Class,
                           GenerateConstructorInterface=false
                        }
         });
         string zipFilePath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + @"\Extras\api.zip";
         string zipFolder = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + @"\Extras\zip";

         File.Delete(zipFilePath);
         if (!Directory.Exists(zipFolder))
         {
            Directory.CreateDirectory(zipFolder);
            Directory.CreateDirectory(zipFolder + @"\apiHooks");
         }
         foreach (var item in tg.GetAllCodeArtifacts())
         {
            using FileStream fs = File.Create($"{zipFolder}\\apiHooks\\use{item.TypeName}Hook.tsx");
            byte[] info = new UTF8Encoding(true).GetBytes(item.Code);
            // Add some information to the file.
            fs.Write(info, 0, info.Length);
         }

         string simpleModels = "";
         string extendedModels = "";
         string enums = "";
         foreach (var item in tg.GetAllDtoTypes())
         {
            switch (item.Type)
            {

               case NJsonSchema.CodeGeneration.CodeArtifactType.Enum:
                  enums += item.Code + '\n';
                  break;

               case NJsonSchema.CodeGeneration.CodeArtifactType.Class:
                  if (item.BaseTypeName == null)
                     simpleModels += item.Code + '\n';
                  else
                     extendedModels += item.Code + '\n';
                  break;

               default:
                  break;
            }
         }

         using (FileStream fs1 = File.Create($"{zipFolder}\\apiModels.tsx"))
         {

            byte[] info2 = new UTF8Encoding(true).GetBytes($"{enums }{simpleModels}{extendedModels}");
            // Add some information to the file.
            fs1.Write(info2, 0, info2.Length);

         }
         ZipFile.CreateFromDirectory(zipFolder, zipFilePath);
         CoreFunc.DeleteDirectory(zipFolder);

      }
   }
}
