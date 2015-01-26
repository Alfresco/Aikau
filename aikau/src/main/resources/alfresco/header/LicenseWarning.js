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
 * Extends the [standard warning]{@link module:alfresco/header/Warning} to provide some
 * License specific data handling.
 *
 * @module alfresco/header/LicenseWarning
 * @extends module:alfresco/header/Warning
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/header/Warning", 
        "dojo/dom-style",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-construct"], 
        function(declare, Warning, domStyle, array, lang, domConstruct) {
   
   return declare([Warning], {
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/LicenseWarning.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/LicenseWarning.properties"}],
      
      /**
       * @instance
       * @type {string}
       */
      usage: null,
      
      /**
       * @instance
       * @type {boolean}
       */
      userIsAdmin: false,
      
      /**
       * Overrides the [inherited function]{@link module:alfresco/header/Warning#postCreate} 
       * to handle license specific data.
       *
       * @instance
       */
      postCreate: function alfresco_header_LicenseWarning__postCreate() {
         if (this.usage == null)
         {
            // If there are no usage instructions then no action is required...
         }
         else
         {
            // Always show a warning if Alfresco is in read only mode...
            if (this.usage.readOnly == true)
            {
               // Always show an error when the system is in readonly mode...
               this.addError(this.message("readonly.warning"));
               domStyle.set(this.domNode, "display", "block");
            }

            if (((this.usage.warnings && this.usage.warnings.length != 0) || 
                 (this.usage.errors && this.usage.errors.length != 0)) && 
                (this.userIsAdmin == true || this.usage.level >= 2))
            {
               // If warnings or errors are present, display them to the Admin or user
               // Admin sees messages if WARN_ADMIN, WARN_ALL, LOCKED_DOWN
               // Users see messages if WARN_ALL, LOCKED_DOWN
               if (this.usage.warnings != null)
               {
                  array.forEach(this.usage.warnings, lang.hitch(this, "addWarning"));
               }
               if (this.usage.warnings != null)
               {
                  array.forEach(this.usage.errors, lang.hitch(this, "addError"));
               }
               domStyle.set(this.domNode, "display", "block");
            }
         }
      }
   });
});