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
 * This creates a set of icons that indicate the status of the item.
 * 
 * @module alfresco/renderers/Indicators
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Indicators.html",
        "alfresco/core/Core",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "service/constants/Default"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, array, lang, domConstruct, AlfConstants) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Indicators.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Indicators.properties"}],
      
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
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Indicators__postMixInProperties() {
         this.renderedValue = "";
         if (this.currentItem != null &&
             this.propertyToRender != null &&
             this.currentItem.node.properties[this.propertyToRender] != null)
         {
            this.renderedValue = this.getRenderedProperty(this.currentItem.node.properties[this.propertyToRender]);
         }
      },
      
      /**
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_Indicators__postCreate() {
         if (this.currentItem && this.currentItem.indicators && this.currentItem.indicators.length > 0)
         {
            array.forEach(this.currentItem.indicators, lang.hitch(this, "addIndicator"));
         }
      },
      
      /**
       * 
       * @instance
       * @param {object} indicator The indicator configuration to add
       * @param {integer} index The index of the indicator
       */
      addIndicator: function alfresco_renderers_Indicators__addIndicator(indicator, index) {

         var outer = domConstruct.create("div", {
            "class": "status"
         }, this.containerNode);
         
         if (indicator.action)
         {
            domConstruct.create("a", {
               "class": "indicator-action",
               "data-action": indicator.action
            }, outer);
         }

         /* Make an attempt to convert any label parameters that are provided with the
          * indicator for use with the supplied label. This is a meeting of the old and
          * new document library implementations which is why it is necessary to remove
          * the leading and trailing curly brackets on dot notation properties of the 
          * current item.
          */
         var messageArgs = {};
         if (indicator.labelParams != null)
         {
            for (var i=0; i<indicator.labelParams.length; i++)
            {
               var param = indicator.labelParams[i].replace(/{/g, "").replace(/}/g, "");
               if (lang.exists(param, this.currentItem))
               {
                  param = lang.getObject(param, false, this.currentItem);
               }
               messageArgs[i.toString()] = param;
            }
         }
         var label = this.message(indicator.label, messageArgs);
         
         domConstruct.create("img", {
            "src": AlfConstants.URL_RESCONTEXT + 'components/documentlibrary/indicators/' + indicator.icon,
            "title": label,
            "alt": indicator.id
         }, outer);
      }
   });
});