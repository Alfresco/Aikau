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
 * This widget can be used to dynamically render widget models whenever the configured 
 * [subscriptionTopic]{@link module:alfresco/layout/DynamicWidgets#subscriptionModel} is published. 
 * The payload on the topic is expected to contain a "widgets" attribute that defines the
 * model to be rendered.
 * 
 * @module alfresco/layout/DynamicWidgets
 * @extends module:alfresco/core/ProcessWidgets
 * @author Dave Draper
 * @since 1.0.36
 */
define(["alfresco/core/ProcessWidgets",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct"], 
        function(ProcessWidgets, declare, lang, array, domConstruct) {
   
   return declare([ProcessWidgets], {
      
      /**
       * The CSS class (or a space separated list of classes) to include in the DOM node.
       * 
       * @instance
       * @type {string}
       * @default
       */
      baseClass: "alfresco-layout-DynamicWidgets",

      /**
       * 
       * @instance
       * @type {string}
       * @default
       */
      subscriptionTopic: null,

      /**
       * Indicates whether the [subscriptionTopic]{@link module:alfresco/layout/DynamicWidgets#subscriptionTopic}
       * should be subscribed to globally.
       * 
       * @since 1.0.81
       * @type {boolean}
       * @default
       */
      subscribeGlobal: false,

      /**
       * This is an extension point for handling the completion of calls to [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       *
       * @instance
       * @param {Array} widgets An array of all the widgets that have been processed
       */
      allWidgetsProcessed: function alfresco_layout_DynamicWidgets__allWidgetsProcessed(widgets) {
         this._previouslyCreatedWidgets = widgets;
      },

     /**
       * 
       * @instance postCreate
       */
      postCreate: function alfresco_layout_DynamicWidgets__postCreate() {
         this.alfSubscribe(this.subscriptionTopic, lang.hitch(this, this.render), this.subscribeGlobal);
      },

      /**
       * Makes a request for the current users upload history from their preferences and then
       * with a callback to the [createUploadTargets]{@link module:alfresco/upload/UploadHistory#createUploadTargets}
       * function to render the upload history.
       * 
       * @instance
       * @param {object} payload A payload containing the widgets to dymaically create
       */
      render: function alfresco_layout_DynamicWidgets__render(payload) {
         if (payload && payload.widgets)
         {
            array.forEach(this._previouslyCreatedWidgets, function(target) {
               target.destroyRecursive();
            });
            domConstruct.empty(this.domNode);
            this.processWidgets(payload.widgets, this.domNode);
         }
      }
   });
});