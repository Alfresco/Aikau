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
 * A mixin class that provides utility functions for manipulating objects in the DOM.
 * 
 * @module alfresco/core/DomElementUtils
 * @author Dave Draper
 */
define(["dojo/_base/declare",
   "dojo/dom-style",
   "dojo/_base/lang",
   "dojo/_base/array",
   "dojo/dom-geometry",
   "dojo/json"],
        function(declare, domStyle, lang, array, domGeom, json) {

   var stylePropertiesCache = {};

   /**
    * This class can be mixed into other classes to provide additional DOM element utility functions.
    */
   return declare(null, {
      
      /**
       * This function was taken from the following answer found on StackOverflow: 
       * http://stackoverflow.com/questions/3053542/how-to-get-the-start-and-end-points-of-selection-in-text-area/3053640#3053640
       * 
       * The purpose of this function is to return information on selection of text in an element.
       * 
       * @instance
       * @param {element} el The element to find the text selection for.
       * @returns {Object} An object with the attributes "start" and "end" that indicate the text selection.
       */
      getInputSelection: function(el) {
         var start = 0, end = 0, normalizedValue, range,
         textInputRange, len, endRange;

         if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") 
         {
            start = el.selectionStart;
            end = el.selectionEnd;
         }
         else 
         {
            range = document.selection.createRange();
   
            if (range && range.parentElement() == el) 
            {
               len = el.value.length;
               normalizedValue = el.value.replace(/\r\n/g, "\n");
   
               // Create a working TextRange that lives only in the input
               textInputRange = el.createTextRange();
               textInputRange.moveToBookmark(range.getBookmark());
   
               // Check if the start and end of the selection are at the very end
               // of the input, since moveStart/moveEnd doesn't return what we want
               // in those cases
               endRange = el.createTextRange();
               endRange.collapse(false);
   
               if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) 
               {
                  start = end = len;
               } 
               else 
               {
                  start = -textInputRange.moveStart("character", -len);
                  start += normalizedValue.slice(0, start).split("\n").length - 1;
   
                  if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) 
                  {
                     end = len;
                  } 
                  else 
                  {
                     end = -textInputRange.moveEnd("character", -len);
                     end += normalizedValue.slice(0, end).split("\n").length - 1;
                  }
               }
            }
        }
   
        return {
            start: start,
            end: end
        };
      },
      
      /**
       * This function is based on the answer given to the following StackOverflow question:
       * http://stackoverflow.com/questions/1336585/howto-place-cursor-at-beginning-of-textarea
       * 
       * The purpose is to set the carat in the supplied element.
       * 
       * @instance
       * @param {element} el The element to set the carat position on
       * @param {number} position The index at which to set the carat
       */
      setCaretPosition: function(el, position) {
         if (el.setSelectionRange) 
         { 
             el.focus(); 
             el.setSelectionRange(position, position); 
         }
         else if (el.createTextRange) 
         { 
             var range = el.createTextRange();
             range.moveStart('character', position); 
             range.select(); 
         }
      },

      /**
       * Returns the height of the document.
       * based on jQuery function (http://code.jquery.com/jquery-2.1.0.js), MIT licensed.
       *
       * @instance
       * @returns {number}
       */
      getDocumentHeight: function() {
         var doc = document.documentElement,
               body = document.body;

         return Math.max(
               body.scrollHeight,
               body.offsetHeight,
               doc.scrollHeight,
               doc.offsetHeight,
               doc.clientHeight
         );
      },

      /**
       * Returns the result of a calculation applied to an initial value.
       *
       * Use i.e. by [IFrame]{@link module:alfresco/integration/IFrame} to be able to set a dynamic height of the
       * iframe where the value of heightConfig would get passed into this method:
       *
       * "heightConfig": {
       *    "initialValue": 0,
       *    "domCalculation": [
       *      { "operator": "+", "selector": "body",                         "function": "marginBox", "property": "h" },
       *      { "operator": "-", "selector": ".footerContent",               "function": "marginBox", "property": "h" },
       *      { "operator": "-", "selector": ".alfresco-integration-IFrame", "function": "marginBox", "property": "t" }
       *   ]
       * }
       *
       * @instance
       * @param config {object}
       * @param config.initialValue {object}
       * @param config.domCalculation {array}
       * @returns {*}
       */
      resolveDomCalculation: function(config) {
         var result = config.initialValue;
         if (config.domCalculation) {
            var c, tmp;
            for (var i = 0, il = config.domCalculation.length; i < il; i++) {
               c = config.domCalculation[i];

               // Find element
               tmp = document.querySelector(c.selector);

               // Function
               if (this.domCalculationFunctions[c["function"]]) {
                  tmp = this.domCalculationFunctions[c["function"]].call(this, tmp);
               }
               else
               {
                  throw new Error("Failed calculation due to missing function " + c["function"]);
               }

               // Property
               if (c.property) {
                  tmp = tmp[c.property];
               }

               // Operator
               if (this.domCalculationOperators[c["operator"]]) {
                  result = this.domCalculationOperators[c["operator"]].call(this, result, tmp);
               }
               else {
                  throw new Error("Failed calculation due to missing operator " + c["operator"]);
               }
            }
         }
         return result;
      },

      /**
       * The functions that can be used form a domCalculation.
       *
       * @instance
       */
      domCalculationFunctions: {
         "marginBox": function(tmp) {
            return domGeom.getMarginBox(tmp);
         }
      },

      /**
       * The operators that can be used form a domCalculation.
       *
       * @instance
       */
      domCalculationOperators: {
         "+": function(result, value) {
            return result + value;
         },
         "-": function(result, value) {
            return result - value;
         }
      },

      /**
       * Certain widgets (i.e. 3rd party svg chart elements) weants to get the colors to use specified as a javascript
       * attribute rather than using css. This helper method makes it possible to theme such colors using css by
       * creating elements and adding certain class names to the elements and then inspect the computed style
       * properties.
       *
       * I.e.
       *
       * var styles = this.resolveCssStyles("alfresco-charts-ccc-Chart--color", [1,2,3,4,5,6,7,8], {
       *   backgroundColor: ["rgba(0, 0, 0, 0)", "transparent"]
       * });
       * config.colors = styles.backgroundColor;
       *
       * Will collect all the background colors for the css class "alfresco-charts-ccc-Chart--color1",
       * "alfresco-charts-ccc-Chart--color2" and so on but exclude values matching "rgba(0, 0, 0, 0)" or "transparent".
       *
       * @instance
       * @param prefix {string} The common "base" name to prefix before each of the name in names, which will create
       *    the css selector to look for style properties in
       * @param names {array} The names that will get added to the prefix when creating the css selector to look for
       *    style properties in
       * @param styleProperties {object} An object holding the name of the style properties to look for as keys and
       *    specific values to ignore (if any) as the value
       * @param cache {boolean} Set to false if cache shouldn't be used
       * @return {Object} An object with a "byName" property that contains all values for each name but also a property
       *    for each the keys specified in styleProperties with all values for that key (except the ones matching the
       *    values to ignore).
       */
      resolveCssStyles: function(prefix, names, styleProperties, cache){
         cache = typeof cache == "boolean" ? cache : true;

         var result;
         if (cache) {
            var cacheKey = json.stringify([prefix, names, styleProperties]);
            result = stylePropertiesCache[cacheKey];
            if (result) {
               return result;
            }
         }

         result = {
            byName: []
         };
         var el = document.createElement("div");
         document.body.appendChild(el);
         var computedStyle;
         var styleProperty;
         var stylePropertiesPerName;
         for (var i = 0, il = names.length; i < il; i++) {
            el.className = (prefix || "") + names[i];
            computedStyle = domStyle.getComputedStyle(el);
            stylePropertiesPerName = {};
            for (var s in styleProperties) {
               styleProperty = computedStyle[s];

               // Make sure there is an array to store result in
               if (!result[s]) {
                  result[s] = [];
               }

               // Make sure we are not adding a valu that shall be ignored
               if (lang.isArray(styleProperties[s])) {
                  if (array.indexOf(styleProperties[s], styleProperty) == -1) {
                     result[s].push(styleProperty);
                  }
               }
               else if (styleProperty != styleProperties) {
                  result[s].push(styleProperty);
               }

               // Store style property value on a per name basis as well
               stylePropertiesPerName[s] = styleProperty;
            }
            result.byName.push({
               name: names[i],
               style: stylePropertiesPerName
            })
         }

         if (cache) {
            stylePropertiesCache[cacheKey] = result;
         }

         return result;
      }
   });
});
