/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * Extends the Property renderer ({@link module:alfresco/renderers/Property})
 * to provide an interpreted boolean display with i18n and image functionality.
 * 
 * @module alfresco/renderers/Boolean
 * @extends alfresco/renderers/Property
 * @author Richard Smith
 * @example <caption>Sample configuration within table cells</caption>
 * widgets: [
 *    {
 *       name: "alfresco/lists/views/layouts/Cell",
 *       config: {
 *          widgets: [
 *             {
 *                name: "alfresco/renderers/Boolean",
 *                config: {
 *                   propertyToRender: "myProperty"
 *                   // Default YESNO style
 *                }
 *             }
 *          ]
 *       }
 *    },
 *    {
 *       name: "alfresco/lists/views/layouts/Cell",
 *       config: {
 *          widgets: [
 *             {
 *                name: "alfresco/renderers/Boolean",
 *                config: {
 *                   propertyToRender: "myProperty",
 *                   displayType: "TRUEFALSE" // TRUEFALSE style
 *                }
 *             }
 *          ]
 *       }
 *    },
 *    {
 *       name: "alfresco/lists/views/layouts/Cell",
 *       config: {
 *          widgets: [
 *             {
 *                name: "alfresco/renderers/Boolean",
 *                config: {
 *                   propertyToRender: "myProperty",
 *                   displayType: "IMAGE" // IMAGE style
 *                }
 *             }
 *          ]
 *       }
 *    }
 * ]
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Property",
        "alfresco/core/ObjectTypeUtils",
        "dojo/_base/lang",
        "js/lib/3rd-party/Enum"], 
        function(declare, Property, ObjectTypeUtils, lang, Enum) {

   return declare(Property, {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Boolean.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Boolean.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Boolean.css"}]
       */
      cssRequirements: [{cssFile:"./css/Boolean.css"}],

      /**
       * An enum of displayType options.
       *
       * @private
       * @type {Enum}
       */
      displayTypeOptions: new Enum(["YESNO", "TRUEFALSE", "IMAGE"]),
      
      /**
       * The display type to be used.
       * 
       * @instance
       * @type {String}
       * @default "YESNO"
       */
      displayType: "YESNO",
      
      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Boolean__postMixInProperties() {

         if(typeof this.displayTypeOptions.get(this.displayType) == "undefined")
         {
            this.alfLog("log", "Unknown displayType '" + this.displayType + "'. Please select displayType from: " + this.displayTypeOptions.enums, this);
            this.renderedValue = "";
         }
         else
         {
            this.displayType = this.displayTypeOptions.get(this.displayType);
            
            if (ObjectTypeUtils.isString(this.propertyToRender) && 
                ObjectTypeUtils.isObject(this.currentItem) && 
                lang.exists(this.propertyToRender, this.currentItem))
            {

               var positivePhrase = "", negativePhrase = "", showImage = false;
               switch (this.displayType)
               {
                  case this.displayTypeOptions.YESNO:
                     positivePhrase = this.message("boolean.yes");
                     negativePhrase = this.message("boolean.no");
                     break;

                  case this.displayTypeOptions.TRUEFALSE:
                     positivePhrase = this.message("boolean.true");
                     negativePhrase = this.message("boolean.false");
                     break;

                  case this.displayTypeOptions.IMAGE:
                     showImage = true;
                     positivePhrase = this.message("boolean.yes");
                     negativePhrase = this.message("boolean.no");
                     break;
               }

               this.renderPropertyNotFound = false;
               this.renderedValue = this.getRenderedProperty(lang.getObject(this.propertyToRender, false, this.currentItem));
               if (this.renderedValue===true || this.renderedValue==="true" || 
                   this.renderedValue===1 || this.renderedValue==="1")
               {
                  this.renderedValue = positivePhrase;
                  if(showImage)
                  {
                     this.renderedValueClass = "boolean-true";
                  }
               }
               else if(this.renderedValue===false || this.renderedValue==="false" || 
                   this.renderedValue===0 || this.renderedValue==="0")
               {
                  this.renderedValue = negativePhrase;
                  if(showImage)
                  {
                     this.renderedValueClass = "boolean-false";
                  }
               }
               else
               {
                  this.renderedValue = this.message("boolean.unknown");
                  if(showImage)
                  {
                     this.renderedValueClass = "boolean-unknown";
                  }
               }
            }
            else
            {
               this.alfLog("log", "Property does not exist:", this);
               this.renderedValue = "";
            }
         }
      }

   });
});