/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
 * @module alfresco/forms/creation/FormRulesConfigCreatorElement
 * @extends module:alfresco/forms/controls/MultipleEntryElement
 * @author Dave Draper
 */
define(["alfresco/forms/controls/MultipleEntryElement",
        "dojo/_base/declare",
        "alfresco/forms/PublishForm",
        "alfresco/core/ObjectTypeUtils",
        "dojo/_base/lang",
        "dojo/_base/array"], 
        function(MultipleEntryElement, declare, PublishForm, ObjectTypeUtils, lang, array) {
   
   return declare([MultipleEntryElement], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/FormCreation.properties"}],
      
      /**
       * @instance
       */
      determineKeyAndValue: function alfresco_forms_creation_FormRulesConfigCreatorElement__determineKeyAndValue() {
         this.inherited(arguments);
         if (this.elementValue.targetId === undefined)
         {
            this.elementValue.targetId = "";
         }
         if (this.elementValue.is === undefined)
         {
            this.elementValue.is = [];
         }
         if (this.elementValue.isNot === undefined)
         {
            this.elementValue.isNot = [];
         }
      },
      
      /**
       * Attempts to create a human readable description of the current rule definition.
       * 
       * @instance
       */
      createReadDisplay: function alfresco_forms_creation_FormRulesConfigCreatorElement__createReadDisplay() {
         var value = this.getValue();
         if (value.is && value.isNot && value.targetId)
         {
            var msgType = "";
            if (value.is.length === 0 && value.isNot.length === 0)
            {
               msgType = "rule.display.any";
            }
            else if (value.is.length > 0 && value.isNot.length === 0)
            {
               msgType = "rule.display.mustBe";
            }
            else if (value.isNot.length > 0 && value.is.length === 0)
            {
               msgType = "rule.display.mustNotBe";
            }
            else
            {
               msgType = "rule.display.mustAndmustNotBe";
            }

            this.readDisplay.innerHTML = this.message(msgType, {"field": value.targetId, 
               "mustBe" : this.generateReadValues(value.is),
               "mustNotBe" : this.generateReadValues(value.isNot)});
         }
         else
         {
            this.readDisplay.innerHTML = "";
         }
      },
      
      /**
       * Creates a comma separated string from an array of objects where each element has a "value" attribute.
       * 
       * @instance
       * @param {object[]} valueArray
       * @returns {string} A comma separated list of the values in the array.
       */
      generateReadValues: function alfresco_forms_creation_FormRulesConfigCreatorElement__generateReadValues(valueArray) {
         var values = "";
         array.forEach(valueArray, function(value, index) {
            values = values + "'" + value.value + "'" + ((index < valueArray.length-1) ? ", " : "");
         });
         return values;
      }
   });
});