using NSwag;
using NSwag.CodeGeneration.TypeScript;

using OSnack.API.Database.Models;

using P8B.Core.CSharp;

using System;
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

      public static void MakeClientZipFile(OpenApiDocument document, string webHostRoot, bool zipIt = false)
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
         string zipFilePath = Path.Combine(@$"{webHostRoot}\StaticFiles\tsApiFiles\{document.Info.Title}.zip");
         string zipFolder = Path.Combine(@$"{webHostRoot}\StaticFiles\tsApiFiles\{document.Info.Title}");

         try { File.Delete(zipFilePath); } catch (Exception) { }
         if (!Directory.Exists(zipFolder))
         {
            Directory.CreateDirectory(zipFolder);
            Directory.CreateDirectory(@$"{zipFolder}\apiHooks");
         }
         if (document.Tags.Any(t => t.Name.Equals("IsModelOnly")))
         {
            string simpleModels = "";
            string extendedModels = "";
            string enums = "";
            foreach (var modelType in tg.GetAllDtoTypes())
            {
               if (modelType.TypeName != "ErrorDto")
               {
                  switch (modelType.Type)
                  {

                     case NJsonSchema.CodeGeneration.CodeArtifactType.Enum:
                        enums += modelType.Code + '\n';
                        break;

                     case NJsonSchema.CodeGeneration.CodeArtifactType.Class:
                        if (modelType.BaseTypeName == null)
                           simpleModels += modelType.Code + '\n';
                        else
                           extendedModels += modelType.Code + '\n';
                        break;

                     default:
                        break;
                  }
               }
            }

            using (FileStream fs1 = File.Create($"{zipFolder}\\apiModels.tsx"))
            {

               byte[] info2 = new UTF8Encoding(true).GetBytes($"{enums }{simpleModels}{extendedModels}");
               // Add some information to the file.
               fs1.Write(info2, 0, info2.Length);

            }
         }
         else
         {
            var modelsPath = "";
            if (document.Tags.Any(t => !t.Name.Equals(AppConst.AccessPolicies.Public)))
               modelsPath = "osnack-frontend-shared/src/_core/apiModels";
            foreach (var hook in tg.GetAllCodeArtifacts())
            {

               string tempScrtip = string.IsNullOrEmpty(hook.BaseTypeName) ?
                 hook.Code.Replace("import { @@Models@@ } from \"../../_core/apiModels\";", "") :
                 hook.Code;

               if (!string.IsNullOrWhiteSpace(modelsPath))
                  tempScrtip = tempScrtip.Replace("../../_core/apiModels", modelsPath);
               using FileStream fs = File.Create($"{zipFolder}\\apiHooks\\use{hook.TypeName}Hook.tsx");
               byte[] info = new UTF8Encoding(true).GetBytes(tempScrtip.Replace("@@Models@@", hook.BaseTypeName.Replace("@", "")));
               // Add some information to the file.
               fs.Write(info, 0, info.Length);

            }
         }

         document.Tags.Clear();
         if (zipIt)
         {
            ZipFile.CreateFromDirectory(zipFolder, zipFilePath);
            CoreFunc.DeleteDirectory(zipFolder);
         }
      }
   }
}
