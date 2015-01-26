/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * This is a mixin that provides URL related utility functions.
 *
 * @module alfresco/core/I18nUtils
 * @extends module:alfresco/core/Core
 * @author Erik Winlöf
 */
define(["alfresco/core/Core"], function(AlfCore){

   /**
    *
    * @method msg
    * @instance
    * @param i18nScope
    * @param key
    * @returns {*}
    */
   function msg(i18nScope, key){
      var msgArgs = [];
      if (arguments.length > 1)
      {
         msgArgs = msgArgs.concat(Array.prototype.slice.call(arguments).slice(1));
      }
      return AlfCore.prototype.message.apply({ i18nScope: i18nScope }, msgArgs);
   }

   return {
      msg: msg
   };
});