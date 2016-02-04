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
 * @module alfresco/lists/utilities/FilterSummary
 * 
 * @author Dave Draper
 * @since 1.0.54
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "alfresco/core/Core",
        "alfresco/forms/controls/utilities/ChoiceMixin",
        "dojo/text!./templates/FilterSummary.html"], 
        function(declare, _WidgetBase, _TemplatedMixin, AlfCore, ChoiceMixin, template) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, ChoiceMixin], {

      /**
       * The HTML template to use for the widget.
       * 
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_lists_utilities_FilterSummary__postCreate() {
         this.inherited(arguments);
         this._addChoice("bob");
      }
   });
});