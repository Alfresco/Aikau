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
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "alfresco/core/Core",
        "aikau/core/ChildProcessing",
        "dojo/text!./templates/ProcessWidgets.html",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/dom-class"], 
        function(declare, _Widget, _Templated, AlfCore, ChildProcessing, template, lang, domConstruct, domClass) {
   
   return declare([_Widget, _Templated, AlfCore, ChildProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/ProcessWidgets.css"}]
       */
      cssRequirements: [{cssFile:"./css/ProcessWidgets.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
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
       * Implements the Dojo widget lifecycle function to call [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * @instance postCreate
       */
      postCreate: function alfresco_core_ProcessWidgets__postCreate() {
         domClass.add(this.domNode, this.additionalCssClasses || "");
         if (this.widgets)
         {
            // this.processWidgets(this.widgets, this.containerNode);
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