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
 * This module is currently in BETA. Outstanding work:
 *
 * @module alfresco/footer/AlfStickyFooter
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/ProcessWidgets",
        "dojo/text!./templates/AlfStickyFooter.html",
        "alfresco/core/Core",
        "dojo/dom-style"], 
        function(declare, ProcessWidgets, template, AlfCore, domStyle) {
   
   return declare([ProcessWidgets, AlfCore], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfStickyFooter.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfStickyFooter.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfStickyFooter.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfStickyFooter.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The height of the footer (in pixels). This will be dynamically set.
       * TODO: What happens if widget height outgrows this?
       * 
       * @instance
       * @type {string}
       * @default null
       */
      footerHeight: null,

      /**
       * @instance
       */
      postCreate: function alfresco_footer_AlfStickyFooter() {
         if (this.widgets)
         {
            this.processWidgets(this.widgets, this.contentNode);
         }

         if (this.widgetsForFooter)
         {
            this.processWidgets(this.widgetsForFooter, this.footerContentNode);
         }
      }
   });
});