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
 * @module aikau/buttons/Button
 * @extends module:aikau/mdl/BaseMdlWidget
 * @author Dave Draper
 * @since 1.0.96
 */
define(["dojo/_base/declare",
        "aikau/mdl/BaseMdlWidget", 
        "dojo/text!./templates/Button.html",
        "dijit/_OnDijitClickMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "dojo/dom-construct"], 
        function(declare, BaseMdlWidget, template, _OnDijitClickMixin, _PublishPayloadMixin, domConstruct) {
   
   return declare([BaseMdlWidget, _OnDijitClickMixin, _PublishPayloadMixin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/Button.css"}]
       */
      cssRequirements: [{cssFile:"./css/Button.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The Material Design Lite CSS classes to apply to the button. This will change the way that the
       * button appears and behaves
       *
       * @instance
       * @type {string}
       */
      buttonClasses: "",

      /**
       * An optional icon to display before the button text
       *
       * @instance
       * @type {string}
       * @default
       */
      leadingIcon: null,

      /**
       * An optional icon to display after the button text
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      trailingIcon: null,

      /**
       * 
       * @instance
       */
      postMixInProperties: function aikau_buttons_Button__postMixInProperties() {
         this.inherited(arguments);
         this.label = this.label ? this.message(this.label) : "";
      },

      /**
       * 
       * @instance
       */
      postCreate: function aikau_buttons_Button__postCreate() {
         this.inherited(arguments);

         if (this.leadingIcon)
         {
            domConstruct.create("i", {
               className: "material-icons",
               innerHTML: this.leadingIcon
            }, this.buttonNode, "first");
         }
         if (this.trailingIcon)
         {
            domConstruct.create("i", {
               className: "material-icons",
               innerHTML: this.trailingIcon
            }, this.buttonNode, "last");
         }
         
      },

      /**
       * Handle button clicks
       *
       * @instance
       * @param  {object} evt The click event
       */
      onClick: function aikau_buttons_Button__onClick(evt) {
         this.publishPayload = this.getGeneratedPayload();
         this.alfPublish(this.publishTopic, this.publishPayload, !!this.publishGlobal, !!this.publishToParent);
         evt.stopPropagation();
      }
   });
});