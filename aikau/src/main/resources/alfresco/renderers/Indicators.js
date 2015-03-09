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
 * This creates a set of icons that indicate the status of the item.
 *
 * @module alfresco/renderers/Indicators
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["dojo/_base/declare", 
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin", 
        "alfresco/renderers/_PublishPayloadMixin", 
        "dojo/text!./templates/Indicators.html", 
        "alfresco/core/Core", 
        "dojo/_base/array", 
        "dojo/_base/lang", 
        "dojo/dom-construct", 
        "dojo/on"], 
        function(declare, _WidgetBase, _TemplatedMixin, _PublishPayloadMixin, template, AlfCore, array, lang, domConstruct, on) {

   return declare([_WidgetBase, _TemplatedMixin, _PublishPayloadMixin, AlfCore], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Indicators.properties"}]
       */
      i18nRequirements: [{
         i18nFile: "./i18n/Indicators.properties"
      }],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Indicators.css"}]
       */
      cssRequirements: [{
         cssFile: "./css/Indicators.css"
      }],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * This should be set to the name of the property to render (e.g. "cm:name"). The property is expected
       * to be in the properties map for the item being rendered.
       *
       * @instance
       * @type {string}
       * @default null
       */
      propertyToRender: null,

      /**
       * This is an auto-populated instance property that holds a cleaned-up array of indicators for the current item.
       *
       * @instance
       * @protected
       * @type {object[]}
       */
      _currentIndicators: null,

      /**
       * Set up the attributes to be used when rendering the template.
       *
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Indicators__postMixInProperties() {
         var property = this.currentItem && this.propertyToRender && this.currentItem.node.properties[this.propertyToRender];
         this.renderedValue = (property && this.getRenderedProperty(property)) || "";
         this._currentIndicators = this.normaliseIndicators(this.currentItem);
      },

      /**
       *
       * @instance
       */
      postCreate: function alfresco_renderers_Indicators__postCreate() {
         array.forEach(this._currentIndicators, this.addIndicator, this);
      },

      /**
       * Normalise and return the indicators for the current item as an array. This means
       * things such as sorting according to index and respecting the overrides properties
       * on the indicators.
       *
       * @instance
       * @protected
       * @param {object=} currentItem The current item, on which the indicators can be found
       * @returns  {object[]} The indicators.
       */
      normaliseIndicators: function alfresco_renderers_Indicators__normaliseIndicators(currentItem) {
         /*jshint loopfunc:true*/

         // Setup variables
         var indicators = (currentItem && currentItem.indicators) || [];

         // Setup variables
         var source = {}, // Starting container
            canBeOverridden = {}, // Used to find edges
            topologicallySorted = [], // Container for sorted items
            actuallyOverridden = {}, // Used to override after the sort
            normalised = []; // The output

         // Populate the source and canBeOverridden maps
         array.forEach(indicators, function(item) {
            source[item.id] = item;
            array.forEach((item.overrides || []), function(overriddenItemId) {
               canBeOverridden[overriddenItemId] = item.id;
            });
         });

         // Find the edges
         array.forEach(Object.keys(source), function(id) {
            if (!canBeOverridden.hasOwnProperty(id)) {
               topologicallySorted.push(source[id]);
               delete source[id];
            }
         });

         // Run through the sorted array, finding overridden children
         while (Object.keys(source).length) {
            array.forEach(topologicallySorted, function(sortedItem) {
               array.forEach((sortedItem.overrides || []), function(overriddenId) {
                  if (source[overriddenId]) {
                     topologicallySorted.push(source[overriddenId]);
                     delete source[overriddenId];
                  }
               });
            });
         }

         // Now we have the toposort, override in order
         array.forEach(topologicallySorted, function(nextSortedItem) {
            if (!actuallyOverridden.hasOwnProperty(nextSortedItem.id)) {
               array.forEach((nextSortedItem.overrides || []), function(overriddenId) {
                  actuallyOverridden[overriddenId] = true;
               });
               normalised.push(nextSortedItem);
            }
         });

         // Sort by index
         normalised.sort(function(a, b) {
            return a.index - b.index;
         });

         // Pass back the new collection
         return normalised;
      },

      /**
       *
       * @instance
       * @param {object} indicator The indicator configuration to add
       * @param {integer} index The index of the indicator
       */
      addIndicator: function alfresco_renderers_Indicators__addIndicator(indicator, index) {
         /*jshint unused:false*/

         // Make an attempt to convert any label parameters that are provided with the indicator for
         // use with the supplied label. This is a meeting of the old and new document library 
         // implementations which is why it is necessary to remove the leading and trailing curly
         // brackets on dot notation properties of the current item.
         var messageArgs = {};
         if (indicator.labelParams) {
            for (var i = 0; i < indicator.labelParams.length; i++) {
               var param = indicator.labelParams[i].replace(/{/g, "").replace(/}/g, "");
               if (lang.exists(param, this.currentItem)) {
                  param = lang.getObject(param, false, this.currentItem);
               }
               messageArgs[i.toString()] = param;
            }
         }
         var label = this.message(indicator.label, messageArgs),
            classes = ["indicator"];
         if (indicator.action) {
            classes.push("has-action");
         }
         var img = domConstruct.create("img", {
            "src": require.toUrl("alfresco/renderers") + "/css/images/indicators/" + indicator.icon,
            "title": label,
            "alt": indicator.id,
            "class": classes.join(" ")
         }, this.containerNode);
         if (indicator.action) {
            on(img, "click", lang.hitch(this, this.onActionClick, indicator));
         }
      },

      /**
       *
       * @instance
       * @param {object} indicator The indicator to generate the action for
       */
      onActionClick: function alfresco_renderers_Indicators__onActionClick(indicator) {
         var publishTopic = indicator.publishTopic || "ALF_SINGLE_DOCUMENT_ACTION_REQUEST";
         var publishPayload;
         var publishGlobal = true;
         var parentScope = false;

         if (indicator.publishTopic) {
            // If a custom indicator is being provided (indicated by the definition of a custom
            // publishTopic attribute then the assumption is that the payload and scope should
            // also be provided by the indicator configuration)
            publishPayload = this.generatePayload(indicator.publishPayload,
               this.currentItem,
               null,
               indicator.publishPayloadType,
               indicator.publishPayloadItemMixin,
               indicator.publishPayloadModifiers);

            if (indicator.publishGlobal === false) {
               publishGlobal = false;
            }
            if (indicator.parentScope === true) {
               parentScope = true;
            }
         } else {
            // If a publishTopic isn't defined on the indicator then the assumption is that
            // this is a standard legacy action defined in the Alfresco Share configuration 
            // and is expected to be handled by the ActionService (or alternative service)
            publishPayload = {
               action: indicator.action,
               document: this.currentItem
            };
         }
         this.alfPublish(publishTopic, publishPayload, publishGlobal, parentScope);
      }
   });
});