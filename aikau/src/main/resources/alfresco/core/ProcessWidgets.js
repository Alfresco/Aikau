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
 * This is an abstract class that is calls [processWidgets]{@link module:alfresco/core/Core#processWidgets} to
 * instantiate the defined widgets. 
 * 
 * @module alfresco/core/ProcessWidgets
 * @extends module:aikau/core/BaseWidget
 * @mixes module:aikau/core/ChildProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "aikau/core/ChildProcessing",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/dom-class"], 
        function(declare, BaseWidget, ChildProcessing, lang, domConstruct, domClass) {
   
   return declare([BaseWidget, ChildProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/ProcessWidgets.css"}]
       */
      cssRequirements: [{cssFile:"./css/ProcessWidgets.css"}],

      /**
       * @instance
       * @type {Object}
       * @default
       * @deprecated Not sure that this is required anymore?
       */
      config: null,
      
      /**
       * @instance {string} configUrl
       * @default
       * @deprecated Not sure that this is required anymore?
       */
      configUrl: "",
      
      /**
       * @instance {string} baseClass
       * @default
       * @deprecated Not sure that this is required anymore?
       */
      baseClass: "widgets",
      
      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.100
       */
      createWidgetDom: function alfresco_core_ProcessWidgets__createWidgetDom() {
         this.domNode = this.containerNode = document.createElement("div");
         this.domNode.className = "alfresco-core-ProcessWidgets " + this.baseClass || "";
      },

      /**
       * Implements the Dojo widget lifecycle function to call [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * @instance postCreate
       */
      postCreate: function alfresco_core_ProcessWidgets__postCreate() {
         domClass.add(this.domNode, this.additionalCssClasses || "");
         if (this.widgets)
         {
            this.createChildren({
               widgets: this.widgets,
               targetNode: this.containerNode
            }).then(lang.hitch(this, function(widgets) {
               this.allWidgetsProcessed(widgets);
            }));
         }
      }
   });
});