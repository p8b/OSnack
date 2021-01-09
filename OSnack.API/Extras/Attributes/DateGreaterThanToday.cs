using System;
using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace OSnack.API.Extras.Attributes
{
   public class DateGreaterThanToday : ValidationAttribute
   {
      protected override ValidationResult IsValid(object value, ValidationContext validationContext)
      {
         ErrorMessage = ErrorMessageString;
         var currentValue = (DateTime)value;

         if (currentValue < DateTime.UtcNow)
            return new ValidationResult(ErrorMessage.Replace("@", $"({DateTime.UtcNow.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture)})"));

         return ValidationResult.Success;
      }
   }



}
