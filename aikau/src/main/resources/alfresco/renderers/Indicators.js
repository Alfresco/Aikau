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
 * This creates a set of icons that indicate the status of the item. Indicators are defined in the Alfresco Share
 * XML configuration to be rendered in the Document Library. When using this renderer in the context of Alfresco Share
 * then the [legacyMode]{@link module:alfresco/renderers/Indicators#legacyMode} should be configured to be true in 
 * order to support 3rd party extensions to the Share configuration. By default the widget will attempt to map the
 * indicator "icon" attribute to an image path either in Share (with [legacyMode]{@link module:alfresco/renderers/Indicators#legacyMode})
 * enabled) or within the Aikau - however, it is also possible to configure an
 * [iconMapping]{@link module:alfresco/renderers/Indicators#iconMapping} to map indicator icons to custom image files.
 *
 * @example <caption>Standalone Aikau Client configuration (images expected to be found in "alfresco/renderers/css/images/indicators/"):</caption>
 * {
 *   name: "alfresco/renderers/Indicators",
 * }
 *
 * @example <caption>Alfresco Share configuration (images expected to be found in"components/documentlibrary/indicators/"):</caption>
 * {
 *   name: "alfresco/renderers/Indicators",
 *   config: {
 *     legacyMode: true
 *   }
 * }
 *
 * @example <caption>Custom mapping for EXIF indicator image:</caption>
 * {
 *   name: "alfresco/renderers/Indicators",
 *   config: {
 *     iconMapping: {
 *       "exif-16.png": "custom/icon/folder/my-exif-icon.png"
 *     }
 *   }
 * }
 *
 * @module alfresco/renderers/Indicators
 * @extends module:aikau/core/BaseWidget
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["dojo/_base/declare", 
        "aikau/core/BaseWidget",
        "alfresco/renderers/_PublishPayloadMixin", 
        "service/constants/Default",
        "dojo/_base/array", 
        "dojo/_base/lang", 
        "dojo/dom-construct", 
        "dojo/on"], 
        function(declare, BaseWidget, _PublishPayloadMixin, AlfConstants, array, lang, domConstruct, on) {

   return declare([BaseWidget, _PublishPayloadMixin], {

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
       * An object that can map each icon attribute to a custom source file for the indicator image. All mappings
       * will be appended to the "resource URL" (e.g. in Alfresc Share this prefix would be "share/res/") which give
       * maximum opportunity for finding images anywhere within the application.
       * 
       * @instance
       * @type {object}
       * @default
       * @since 1.0.55
       */
      iconMapping: null,

      /**
       * This is a white list of the icons available in Aikau. If any indicator is configured without
       * [iconMapping]{@link module:alfresco/renderers/Indicators#iconMapping} and is rendering a
       * [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem} that does not map
       * one of these values then [legacyMode]{@link module:alfresco/renderers/Indicators#legacyMode}
       * will automatically be enabled.
       * 
       * @instance
       * @type {string[]}
       * @since 1.0.71
       * @default
       */
      iconWhiteList: [
         "active-workflows-16.png",
         "cloud-indirect-sync-16.png",
         "cloud-indirect-sync-failed-16.png",
         "cloud-synced-16.png",
         "cloud-sync-failed-16.png",
         "editing-16.png",
         "exif-16.png",
         "geographic-16.png",
         "locked-16.png",
         "lock-owner-16.png",
         "rules-16.png",
         "simple-workflow-16.png",
         "transferred-node-16.png"
      ],

      /**
       * This indicates whether or not to use the root path of "/res/components/documentlibrary/indicators/" for icon
       * images. This would be the path expected when the widget is being used within the Alfresco Share application
       * and all icons would need to be found at this location to satify customization requirements.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.55
       */
      legacyMode: false,

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
       * Indicates whether or not the configured actions for the indicators supported. So if this is configured
       * to be false then no indicator will be clickable regardless of whether or not an action has been
       * provided for it.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.72
       */
      supportActions: true,

      /**
       * This is an auto-populated instance property that holds a cleaned-up array of indicators for the current item.
       *
       * @instance
       * @protected
       * @type {object[]}
       */
      _currentIndicators: null,

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_Indicators__createWidgetDom() {
         this.containerNode = this.domNode = document.createElement("div");
         this.domNode.classList.add("alfresco-renderers-Indicators");
      },

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
         if (this.supportActions && indicator.action) {
            classes.push("has-action");
         }

         // Attempt to map the icon to a custom image...
         var src;
         if (this.iconMapping && this.iconMapping[indicator.icon])
         {
            src = AlfConstants.URL_RESCONTEXT + this.iconMapping[indicator.icon];
         }

         if (!src)
         {
            // If mapping is unsuccessful then use either the legcacy path or the "pure" Aikau path to set the 
            // icon image source...
            if (this.legacyMode || !this.iconInWhiteList(indicator.icon))
            {
               src = AlfConstants.URL_RESCONTEXT + "components/documentlibrary/indicators/" + indicator.icon;
            }
            else
            {
               src = require.toUrl("alfresco/renderers/css/images/indicators/" + indicator.icon);
            }
         }
         
         var img = domConstruct.create("img", {
            "src": src,
            "title": label,
            "alt": indicator.id,
            "class": classes.join(" ")
         }, this.containerNode);
         if (this.supportActions && indicator.action) {
            on(img, "click", lang.hitch(this, this.onActionClick, indicator));
         }
      },

      /**
       * Checks the [whitelist]{@link module:alfresco/renderers/Indicators#iconWhiteList}
       * for the presence of the supplied icon.
       * 
       * @instance
       * @param  {string} icon The icon to check the whitelist for
       * @return {boolean} True if the icon is found and false otherwise
       * @since 1.0.71
       */
      iconInWhiteList: function alfresco_renderers_Indicators__iconInWhiteList(icon) {
         return array.some(this.iconWhiteList, function(currIcon) {
            return currIcon === icon;
         });
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