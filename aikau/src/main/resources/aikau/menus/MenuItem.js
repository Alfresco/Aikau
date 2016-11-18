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
 * <p><b>This widget is in the "aikau" package and does not adhere to the backwards compatibility standards
 * of the "alfresco" package. The code in this package is intended to form the basis of the next major release
 * of Aikau and will remain in an unstable state until ready for release. Please evaluate and feedback on this
 * module but do not rely on it in production!</b></p>
 *
 * @module aikau/menus/MenuItem
 * @extends module:aikau/mdl/BaseMdlWidget
 * @author Dave Draper
 * @since 1.0.96
 */
define(["dojo/_base/declare",
        "aikau/mdl/BaseMdlWidget", 
        "dojo/text!./templates/MenuItem.html",
        "dijit/_OnDijitClickMixin",
        "alfresco/renderers/_PublishPayloadMixin"], 
        function(declare, BaseMdlWidget, template, _OnDijitClickMixin, _PublishPayloadMixin) {
   
   return declare([BaseMdlWidget, _OnDijitClickMixin, _PublishPayloadMixin], {

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * 
       * @instance
       * @type {string}
       * @default
       */
      title: "Menu Item",

      /**
       * Handle button clicks
       *
       * @instance
       * @param  {object} evt The click event
       */
      onClick: function mdl_MenuItem__onClick(evt) {
         this.publishPayload = this.getGeneratedPayload();
         this.alfPublish(this.publishTopic, this.publishPayload, !!this.publishGlobal, !!this.publishToParent);
         evt.stopPropagation();
      }
   });
});