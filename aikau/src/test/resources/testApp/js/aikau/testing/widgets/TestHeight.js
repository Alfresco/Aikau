/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 *
 * @module aikauTesting/widgets/TestHeight
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/layout/HeightMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 * @since 1.0.34
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/TestHeight.html",
        "alfresco/layout/HeightMixin",
        "alfresco/core/Core"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, HeightMixin, AlfCore) {
   
   return declare([_WidgetBase, _TemplatedMixin, HeightMixin, AlfCore], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/TestHeight.css"}]
       */
      cssRequirements: [{cssFile:"./css/TestHeight.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Call setHeight to set the height
       * @instance
       */
      postMixInProperties: function aikauTesting_widgets_TestHeight__postMixInProperties() {
         this.label = this.label || "";
      },

      /**
       * Call setHeight to set the height
       * @instance
       */
      postCreate: function aikauTesting_widgets_TestHeight__postCreate() {
         this.setHeight(this.domNode);
      }
   });
});