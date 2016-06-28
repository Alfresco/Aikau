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
 * This is an example widget that will generate a welcome message.
 *
 * @module acme/HelloWorld
 * @extends external:dijit/_WidgetBase
 * @mixes external:dijit/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/HelloWorld.html",
        "alfresco/core/Core"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, Core) {

   return declare([_WidgetBase, _TemplatedMixin, Core], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/HelloWorld.properties"}]
       */
      cssRequirements: [{cssFile:"./css/HelloWorld.css"}],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/HelloWorld.css"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/HelloWorld.properties"}],

      /**
       * The HTML template to use for the widget.
       * 
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Called before the template is rendered.
       *
       * @instance
       */
      postMixInProperties: function acme_HelloWorld__postMixInProperties() {
         this.greeting = this.message("greeting.label");
      },

      /**
       * Called after the template is rendered.
       *
       * @instance
       */
      postCreate: function acme_HelloWorld__postCreate() {
         // No action.
      }
   });
});