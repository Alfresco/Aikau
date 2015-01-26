/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * This mixin provides the ability to add a new icon within a form control. It 
 * was originally created to add a search icon for the faceted search page in Share.
 * 
 * @module alfresco/forms/controls/utilities/IconMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/dom-style"], 
        function(declare, lang, domConstruct, domStyle) {

   return declare([], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/IconMixin.css"}]
       */
      cssRequirements: [{cssFile:"./css/IconMixin.css"}],

      /**
       * Adds an icon into the widget.
       * 
       * @instance
       * @param {object} control The form control to manipulate
       */
      addIcon: function alfresco_forms_controls_utilities_IconMixin__addIcon(control) {
         if (this.iconClass != null && lang.trim(this.iconClass) !== "")
         {
            domConstruct.create("span", {
               "class": "alf-icon " + this.iconClass
            }, control.focusNode, "before");

            var currWidth = domStyle.get(control.focusNode, "width");
            var targetWidth = currWidth - 30;
            if (targetWidth >= 0)
            {
               domStyle.set(control.focusNode, "width", currWidth - 30 + "px");
            }
         }
      }
   });
});