//#region *** *** Date Extensions *** ***
interface Date {
   /**
    * Convert date object to string. e.g 14/06/2020 - 02:38:42
    */
   ToShortDateTime: () => string;
   /**
    * Convert date object to string. e.g 14/06/2020
    */
   ToShortDate: () => string;
}
Date.prototype.ToShortDateTime = function () {
   return `${('0' + this.getDate()).slice(-2)}/${('0' + (this.getMonth() + 1)).slice(-2)}/${this.getFullYear()} - 
             ${('0' + this.getHours()).slice(-2)}:${('0' + this.getMinutes()).slice(-2)}:${('0' + this.getSeconds()).slice(-2)}`;
};
Date.prototype.ToShortDate = function () {
   return `${('0' + this.getDate()).slice(-2)}/${('0' + (this.getMonth() + 1)).slice(-2)}/${this.getFullYear()}`;
};
//#endregion

//#region *** *** Math Extensions *** ***
interface Math {
   /**
   * Return a random integer between the given max and min number
   * min default => 0
   * max default => 9
   *///Return a random integer between the given max and min number
   RandomInteger: (min?: number, max?: number) => number;
}

Math.RandomInteger = function (min: number = 0, max: number = 9) {
   return this.floor(this.random() * (max - min + 1)) + min;
};
//#endregion   

//#region *** *** String Extensions *** ***
interface String {
   ReplaceAll: (search: string, replace: string) => string;
}

String.prototype.ReplaceAll = function (searchValue: string | RegExp, replaceValue: string) {
   try {
      return this.split(searchValue).join(replaceValue);
   } catch (e) {
      return this.toString();
   }
};
//#endregion

