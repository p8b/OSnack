using System;

namespace OSnack.API.Extras.Attributes
{
   [AttributeUsage(AttributeTargets.Field, AllowMultiple = false)]
   public class EmailTemplateTypeServerClassesAttribute : Attribute
   {

      public Type[] ClassTypes { get; set; }

      public EmailTemplateTypeServerClassesAttribute(params Type[] classTypes)
      {
         ClassTypes = classTypes;
      }
   }
}
