/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 * Renders the value of a property found in the configured [currentItem]{@link module:alfresco/renderers/Property#currentItem}
 * attribute. The property that will be rendered is determined by the [propertyToRender]{@link module:alfresco/renderers/Property#propertyToRender}
 * attribute which should be defined in "dot-notation" format (e.g. "node.properties.cm:title"). This widget accepts a number
 * of different configuration options that control how the property is ultimately displayed.
 *
 * @module alfresco/renderers/Property
 * @extends module:aikau/core/BaseWidget
 * @mixes module:alfresco/renderers/_JsNodeMixin
 * @mixes module:alfresco/renderers/_ItemLinkMixin
 * @mixes module:alfresco/core/ValueDisplayMapMixin
 * @mixes module:alfresco/core/UrlUtilsMixin
 * @mixes module:alfresco/core/TemporalUtils
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "alfresco/renderers/_JsNodeMixin", 
        "alfresco/core/ValueDisplayMapMixin", 
        "alfresco/core/ObjectTypeUtils", 
        "alfresco/core/UrlUtilsMixin", 
        "alfresco/core/TemporalUtils", 
        "dojo/_base/lang", 
        "dojo/dom-class", 
        "dojo/dom-style", 
        "dijit/Tooltip", 
        "dojo/on"], 
        function(declare, BaseWidget, _JsNodeMixin, ValueDisplayMapMixin, ObjectTypeUtils, UrlUtilsMixin, 
                 TemporalUtils, lang, domClass, domStyle, Tooltip, on) {

   return declare([BaseWidget, _JsNodeMixin, ValueDisplayMapMixin, TemporalUtils, UrlUtilsMixin], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Property.properties"}]
       */
      i18nRequirements: [{
         i18nFile: "./i18n/Property.properties"
      }],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Property.css"}]
       */
      cssRequirements: [{
         cssFile: "./css/Property.css"
      }],

      /**
       * This is the object that the property to be rendered will be retrieved from.
       *
       * @instance
       * @type {object}
       * @default
       */
      currentItem: null,

      /**
       * Indicates whether or not the property should be de-emphasized. This will result in a lighter colour
       * being used.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      deemphasized: false,

      /**
       * This is the property within the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#highlightProperty}
       * that should be used to identify the content with in the 
       * [renderedValue]{@link module:alfresco/renderers/Property#renderedValue} to highlight.
       * 
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.87
       */
      highlightProperty: null,

      /**
       * The prefix string that indicates the start of text to highlight.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.92
       */
      highlightPrefix: null,

      /**
       * The postfix string that indicates the start of text to highlight.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.92
       */
      highlightPostfix: null,
      
      /**
       * This is a specific value to highlight. It will be not be used if
       * [highlightProperty]{@link module:alfresco/renderers/Property#highlightProperty} is configured.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.87
       */
      highlightValue: null,

      /**
       * The label for the property. Won't be shown if left as null.
       *
       * @instance
       * @type {string}
       * @default
       */
      label: null,

      /**
       * Specifies a maximum width for the content of the renderer, and will overflow with an ellipsis if necessary
       *
       * @instance
       * @type {string}
       * @default
       */
      maxWidth: null,

      /**
       * Indicates that this should only be displayed when the item (note: NOT the renderer) is
       * hovered over.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      onlyShowOnHover: false,

      /**
       * This should be set to the name of the property to render (e.g. "cm:name"). The property is expected
       * to be in the properties map for the item being rendered.
       *
       * @instance
       * @type {string}
       * @default
       */
      propertyToRender: null,

      /**
       * This will be set with the rendered value.
       *
       * @instance
       * @type {string}
       * @default
       */
      renderedValue: null,

      /**
       * This can be set to apply a CSS class to the rendered property value
       *
       * @instance
       * @type {string}
       * @default
       */
      renderedValueClass: "alfresco-renderers-Property",

      /**
       * A label to go before the rendered value
       * 
       * @instance
       * @type {string}
       * @default
       */
      renderedValuePrefix: "",

      /**
       * A label to go after the rendered value
       * 
       * @instance
       * @type {string}
       * @default
       */
      renderedValueSuffix: "",

      /**
       * Indicates whether or not the property will be rendered on a new line.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      renderOnNewLine: false,

      /**
       * This indicates whether or not the requestes property can be found for the current item
       *
       * @instance
       * @type {boolean}
       * @default
       */
      renderPropertyNotFound: true,

      /**
       * This can be either small, medium or large.
       * 
       * @instance
       * @type {string}
       * @default
       */
      renderSize: "medium",

      /**
       * A title attribute to apply to the property to set an HTML title attribute on the outer
       * element of the widget. The value will be displayed in a tooltip when hovered over.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.102
       */
      title: null,

      /**
       * Indicates whether or not string values should be trimmed.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.99
       */
      trimValue: false,

      /**
       * Indicates whether or not a message should be displayed in place of the 
       * [propertyToRender]{@link module:alfresco/renderers/Property#propertyToRender} when it is not available.
       * This defaults to false but if configured to be true then the 
       * [warnIfNotAvailableMessage]{@link module:alfresco/renderers/Property#warnIfNotAvailableMessage}
       * will be displayed.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      warnIfNotAvailable: false,

      /**
       * This is the message that will be displayed in place of the property value if that value does not
       * exist. The message will only be displayed if 
       * [warnIfNotAvailable]{@link module:alfresco/renderers/Property#warnIfNotAvailable} is not configured
       * to be true. If this is left as the default value then an attempt will be made to set an appropriate
       * message but will ultimately fallback to referencing the configured 
       * [propertyToRender]{@link module:alfresco/renderers/Property#propertyToRender} value.
       *
       * @instance
       * @type {string}
       * @default
       */
      warnIfNotAvailableMessage: null,

      /**
       * Indicates whether or not a warning should (or is) being displayed. This is for internal use only
       * and should not be configured or programmatically set.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.35
       */
      warningDisplayed: false,

      /**
       * The positions where a tooltip can appear over a truncated value
       *
       * @static
       * @instance
       * @protected
       * @type {string[]}
       */
      _tooltipPositions: ["below-centered", "above-centered"],

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.100
       */
      createWidgetDom: function alfresco_renderers_Property__createWidgetDom() {
         this.renderedValueNode = this.domNode = document.createElement("span");
         this.renderedValueClassArray.forEach(function(className) {
            this.domNode.classList.add(className);
         }, this);
         this.domNode.setAttribute("tabindex", "0");

         this.innerSpan = document.createElement("span");
         this.innerSpan.classList.add("inner");

         var labelSpan = document.createElement("span");
         labelSpan.classList.add("label");
         labelSpan.textContent = this.label;

         var valueSpan = document.createElement("span");
         valueSpan.classList.add("value");
         valueSpan.innerHTML = this.renderedValue;

         this.innerSpan.appendChild(labelSpan);
         this.innerSpan.appendChild(valueSpan);
         this.domNode.appendChild(this.innerSpan);

         // See AKU-1166
         if (this.title)
         {
            this.domNode.setAttribute("title", this.title);
         }
      },

      /**
       * Updates CSS classes based on the current state of the renderer. Currently this only
       * addressed warning message states.
       * 
       * @instance
       * @since 1.0.35
       */
      updateCssClasses: function alfresco_renderers_Property__updateCssClasses() {
         if (this.renderedValueNode)
         {
            if(this.warningDisplayed)
            {
               domClass.add(this.renderedValueNode, "faded");
            }
            else
            {
               domClass.remove(this.renderedValueNode, "faded");
            }
         }
      },

      /**
       * Generates the rendering of the property value. This will include any 
       * [prefix]{@link module:alfresco/renderers/Property#renderedValuePrefix} and/or 
       * [suffix]{@link module:alfresco/renderers/Property#renderedValueSuffix} as well
       * as any configured
       * [warning]{@link module:alfresco/renderers/Property#warnIfNotAvailableMessage}
       * to be displayed when the property does not exist.
       * 
       * @instance
       * @param {string} value The value to be rendered
       * @return {string} Returns the rendered value
       * @since 1.0.35
       */
      generateRendering: function alfresco_renderers_Property__generateRendering(value) {
         var valueRendering;

         // If the renderedValue is not set then display a warning message if requested...
         if (!ObjectTypeUtils.isValueSet(value, false)) 
         {
            if (this.warnIfNotAvailable)
            {
               var warningMessage = this.getNotAvailableMessage();
               valueRendering = this.renderedValuePrefix + warningMessage + this.renderedValueSuffix;
               this.warningDisplayed = true;
            }
            else
            {
               valueRendering = value;
            }
         }
         else
         {
            valueRendering = this.renderedValuePrefix + value + this.renderedValueSuffix;
            this.warningDisplayed = false;
         }

         return valueRendering;
      },

      /**
       * Get the message to display if the property isn't available. Note that
       * this does not check the [warnIfNotAvailable property]{@link module:alfresco/renderers/Property#warnIfNotAvailable} because it could then not be easily used by subclasses.
       *
       * @instance
       * @returns {string} The warning message
       * @since 1.0.57
       */
      getNotAvailableMessage: function alfresco_renderers_Property__getNotAvailableMessage() {
         // Get appropriate message
         // Check message based on propertyToRender otherwise default to sensible alternative
         var warningKey = this.warnIfNotAvailableMessage;
         var warningMessage = "";
         if (!warningKey) {
            warningKey = "no." + this.propertyToRender + ".message";
            warningMessage = this.message(warningKey);
            if (warningMessage === warningKey) {
               warningMessage = this.message("no.property.message", {
                  0: this.propertyToRender
               });
            }
         } else {
            warningMessage = this.message(warningKey);
         }
         return warningMessage;
      },

      /**
       * Set up the attributes to be used when rendering the template.
       *
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Property__postMixInProperties() {
         if (this.label) 
         {
            this.label = this.message(this.label) + ": ";
         } 
         else 
         {
            this.label = "";
         }

         var highlight = this.highlightValue;
         if (this.highlightProperty)
         {
            highlight = lang.getObject(this.highlightProperty, false, this.currentItem);
         }

         if (ObjectTypeUtils.isString(this.propertyToRender) &&
             ObjectTypeUtils.isObject(this.currentItem) &&
             lang.exists(this.propertyToRender, this.currentItem)) 
         {
            this.renderPropertyNotFound = false;
            this.originalRenderedValue = this.getRenderedProperty(lang.getObject(this.propertyToRender, false, this.currentItem),
                                                                  highlight);
            this.renderedValue = this.mapValueToDisplayValue(this.originalRenderedValue);
         } 
         else 
         {
            this.alfLog("log", "Property does not exist:", this);
         }

         this.renderedValue = this.generateRendering(this.renderedValue);
         this.updateRenderedValueClass();
      },

      /**
       * Updates the [renderedValueClass]{@link module:alfresco/renderers/Property#renderedValueClass}
       * attribute based on the current configuration. This is abstracted to a function so that it can
       * be easily called by extending renderers.
       *
       * @instance
       */
      updateRenderedValueClass: function alfresco_renderers_Property__updateRenderedValueClass() {
         // Need to set both renderedValueClassArray (for widgets without a template) and
         // renderedValueClass (for those that do)...
         var renderedValueClass = this.renderedValueClass || "";
         
         // See AKU-1152 - handle spaces in arrays...
         this.renderedValueClassArray = renderedValueClass.replace(/\s+/g, " ").trim().split(" ");
         this.renderedValueClassArray = this.renderedValueClassArray.concat(["alfresco-renderers-Property", this.renderSize]);
         this.renderedValueClass = this.renderedValueClass + " " + this.renderSize;
         if (this.renderOnNewLine === true) 
         {
            this.renderedValueClass = this.renderedValueClass + " block";
            this.renderedValueClassArray.push("block");
         }
         if (this.deemphasized === true) 
         {
            this.renderedValueClass = this.renderedValueClass + " deemphasized";
            this.renderedValueClassArray.push("deemphasize");
         }
      },

      /**
       * Determines whether or not the property should only be displayed when the item is hovered over.
       *
       * @instance
       */
      postCreate: function alfresco_renderers_Property__postCreate() {
         this.updateCssClasses();
         if (this.maxWidth) 
         {
            domClass.add(this.domNode, "has-max-width");
            domStyle.set(this.domNode, {
               maxWidth: this.maxWidth
            });
         }
         if (this.onlyShowOnHover === true) 
         {
            domClass.add(this.domNode, "hover-only");
         }
      },

      /**
       * Called on widget startup
       *
       * @instance
       */
      startup: function alfresco_renderers_Property__startup() {
         this.inherited(arguments);
         if (this.maxWidth && this.domNode.scrollWidth > this.domNode.clientWidth) {
            var target = this.domNode,
               tooltipPositions = this._tooltipPositions;
            this.own(on(target, "focus,mouseover", function() {
               var content = lang.trim(target.textContent || target.innerText || "");
               Tooltip.show(content, target, tooltipPositions);
            }));
            this.own(on(target, "blur,mouseout", function() {
               Tooltip.hide(target);
            }));
         }
      },

      /**
       * Renders a date property.
       *
       * @instance
       */
      renderDate: function alfresco_renderers_Property__renderDate(date, format) {
         return this.formatDate(this.fromISO8601(date), format);
      },

      /**
       * Updates the supplied value to include HTML mark elements around all instances of the
       * supplied highlight value.
       * 
       * @instance
       * @param {string} value The value to update with highlight marks
       * @param {string} highlight The text to highlight
       * @return {string} The highlighted value
       * @since 1.0.87
       */
      addHighlightMarks: function alfresco_renderers_Property__addHighlightMarks(value, highlight) {
         var re = new RegExp(highlight, "gi");
         return value.replace(re, "<mark>$&</mark>");
      },

      /**
       * @instance
       * @param {string} property The name of the property to render
       */
      getRenderedProperty: function alfresco_renderers_Property__getRenderedProperty(property, highlight) {
         /*jshint maxcomplexity:false*/
         var value = "";
         if (property === null || typeof property === "undefined") 
         {
            // No action required if a property isn't supplied
         } 
         else if (ObjectTypeUtils.isString(property)) 
         {
            value = this.encodeHTML(property);
         } 
         else if (ObjectTypeUtils.isArray(property)) 
         {
            value = property.length;
         } 
         else if (ObjectTypeUtils.isBoolean(property)) 
         {
            value = property;
         } 
         else if (ObjectTypeUtils.isNumber(property)) 
         {
            value = property;
         } 
         else if (ObjectTypeUtils.isObject(property)) 
         {
            // TODO: This should probably be moved out into a Node specific sub-class
            if (property.hasOwnProperty("iso8601")) 
            {
               value = this.renderDate(property.iso8601);
            } 
            else if (property.hasOwnProperty("userName") && property.hasOwnProperty("displayName")) 
            {
               value = this.userProfileLink(property.userName, property.displayName);
            } 
            else if (property.hasOwnProperty("displayName")) 
            {
               value = this.encodeHTML(property.displayName || "");
            } 
            else if (property.hasOwnProperty("title")) 
            {
               value = this.encodeHTML(property.title || "");
            } 
            else if (property.hasOwnProperty("name")) 
            {
               value = this.encodeHTML(property.name || "");
            }
         }

         if (value && highlight)
         {
            value = this.addHighlightMarks(value, highlight);
         }
         else if (value && this.highlightPrefix && this.highlightPostfix)
         {
            value = value.replace(new RegExp(this.highlightPrefix, "g"), "<mark>").replace(new RegExp(this.highlightPostfix, "g"), "</mark>");
         }

         if (value && this.trimValue && typeof value.trim === "function")
         {
            value = value.replace(/&nbsp;/g, " ").trim();
         }

         return value;
      }
   });
});