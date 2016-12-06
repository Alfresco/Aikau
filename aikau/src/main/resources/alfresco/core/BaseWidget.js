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
 * Provides a base for all Aikau widgets to extend. It is not essential that a widget extends
 * this module but it can provide significant performance benefits if hundreds or thousands
 * of instances of the widget need to be rendered at a time. Any widget that does extend this
 * base must either define a [templateString]{@link module:alfresco/core/BaseWidget#templateString}
 * or override [createWidgetDom]{@link module:alfresco/core/BaseWidget#createWidgetDom}.
 * 
 * @module alfresco/core/BaseWidget
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 * @since 1.0.100
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "alfresco/core/Core"], 
        function(declare, _WidgetBase, _TemplatedMixin, Core) {
   
   return declare([_WidgetBase, _TemplatedMixin, Core], {

      /**
       * The template that defines the DOM for the widget. If configured this will 
       * result in the capabilities of dijit/_TemplatedMixin being used to construct the 
       * DOM. Ideally this should be left as the default value of null and the 
       * [createWidgetDom]{@link module:alfresco/core/BaseWidget#createWidgetDom} function
       * will be called - this function should be implemented to use the native capabilities
       * of the browser to build a DOM for the widget.
       * 
       * @instance
       * @type {string}
       * @default
       */
      templateString: null,

      /**
       * This extends the function provided by the dijit/_WidgetBase module to prevent any 
       * attributes from being applied. This changes the default widget behaviour in order
       * to gain performance improvements. Any parameters that do need to be applied can
       * be provided by overriding 
       * [getParametersToApply]{@link module:alfresco/core/BaseWidget#getParametersToApply}.
       * 
       * @instance
       */
      _applyAttributes: function alfresco_core_BaseWidget___applyAttributes() {
         var originalParams = this.params;
         this.params = this.getParametersToApply(originalParams);
         this.inherited(arguments);
         this.params = originalParams;
      },

      /**
       * This is called from [_applyAttributes]{@link module:alfresco/core/BaseWidget#_applyAttributes}
       * to get an object of the parameters that should be applied to the widget. This should only
       * be implemented as necessary. The more parameters applied the worse the performance at scale.
       * 
       * @instance
       * @overridable
       * @param {object} originalParams The original parameters provided to the widget.
       * @return {object} An object of key/value pair parameters to be applied. 
       */
      getParametersToApply: function alfresco_core_BaseWidget__getParametersToApply(/*jshint unused:false*/ originalParams) {
         var params = null;
         if (originalParams.style)
         {
            params = {
               style: originalParams.style
            };
         }
         return params;
      },

      /**
       * Extends the function inherited from dijit/_WidgetBase to only make use of the template
       * rendering capabilities provided by dijit/_TemplatedMixin when a
       * [templateString]{@link module:alfresco/core/BaseWidget#templateString} is provided. Otherwise
       * the [createWidgetDom]{@link module:alfresco/core/BaseWidget#createWidgetDom} will be called
       * to build the DOM for the widget.
       * 
       * @instance
       */
      buildRendering: function alfresco_core_BaseWidget__buildRendering() {
         if (this.templateString)
         {
            this.inherited(arguments);
         }
         else
         {
            this.createWidgetDom();
         }
      },

      /**
       * This function can be overridden to create the DOM model for the widget. Ideally this 
       * should construct the DOM using the native capabilities of the browser (i.e. 
       * making calls to document.createElement, etc). This function is called from 
       * [buildRendering]{@link module:alfresco/core/BaseWidget#buildRendering} when no
       * [templateString]{@link module:alfresco/core/BaseWidget#templateString} is defined.
       * 
       * @instance
       * @overridable
       */
      createWidgetDom: function alfresco_core_BaseWidget__createWidgetDom() {
         this.alfLog("warn", "The 'createWidgetDom' function has not been implemented", this);
      }
   });
});