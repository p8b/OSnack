using OSnack.API.Database.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OSnack.API.Extras.AppInterfaces
{
   public struct UpdateCurrentUserData
   {
      public User User { get; set; }
      public string CurrentPassword { get; set; }
   }
}
