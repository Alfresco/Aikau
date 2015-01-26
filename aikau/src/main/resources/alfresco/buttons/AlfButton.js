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
 * This extends the default Dojo button to provide Alfresco specific styling. It also overrides
 * the [onClick]{@link module:alfresco/buttons/AlfButton#onClick} function to publish the
 * [publishPayload]{@link module:alfresco/buttons/AlfButton#publishPayload} on the
 * [publishTopic]{@link module:alfresco/buttons/AlfButton#publishTopic}
 *
 * @module alfresco/buttons/AlfButton
 * @extends module:dijit/form/Button
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/form/Button",
        "alfresco/core/Core",
        "dojo/dom-class",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/_base/event"],
        function(declare, Button, AlfCore, domClass, array, lang, event) {

   return declare([Button, AlfCore], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfButton.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfButton.css"}],

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfButton.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfButton.properties"}],

      /**
       * The topic to publish when the button is clicked
       *
       * @instance
       * @type {string}
       * @default ""
       */
      publishTopic: "",

      /**
       * The payload to publish when the button is clicked
       *
       * @instance
       * @type {object}
       * @default null
       */
      publishPayload: null,

      /**
       * Additional classes to be applied to the root DOM element.
       *
       * @instance
       * @type {string}
       * @default ""
       */
      additionalCssClasses: "",

      /**
       * The topic to listen to to determine when the button should be enabled
       *
       * @instance
       * @type {string}
       * @default "ALF_VALID_CONTROL"
       */
      validTopic: "ALF_VALID_CONTROL",

      /**
       * The topic to listen to to determine when the button should be disabled
       *
       * @instance
       * @type {string}
       * @default "ALF_INVALID_CONTROL"
       */
      invalidTopic: "ALF_INVALID_CONTROL",

      /**
       * Extends the default implementation to check that the [publishPayload]{@link module:alfresco/buttons/AlfButton#publishPayload} attribute has been set
       * to something other null and if it hasn't initialises it to a new (empty) object.
       *
       * @instance
       */
      postMixInProperties: function alfresco_buttons_AlfButton__postMixInProperties() {
         this.label = this.message(this.label);
         this.inherited(arguments);
         if (this.publishPayload == null)
         {
            this.publishPayload = {};
         }
      },

      /**
       * Extends the default Dojo button implementation to add a widget DOM node CSS class to ensure that the
       * CSS selectors are matched.
       *
       * @instance
       */
      postCreate: function alfresco_buttons_AlfButton__postCreate() {
         this.inherited(arguments);
         domClass.add(this.domNode, "alfresco-buttons-AlfButton " + (this.additionalCssClasses != null ? this.additionalCssClasses : ""));

         if (this.disableOnInvalidControls === true)
         {
            this.invalidControls = [];
            this.alfSubscribe(this.invalidTopic, lang.hitch(this, "onInvalidControl"));
            this.alfSubscribe(this.validTopic, lang.hitch(this, "onValidControl"));
         }
      },

      /**
       * Indicates whether or not the button should disable itself if any controls publish information indicating that
       * they are in an invalid state.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      disableOnInvalidControls: false,

      /**
       * This will be instantiated as an array and used to keep track of any controls that report themselves as being
       * in an invalid state. The button should only be enabled when this list is empty.
       *
       * @instance
       * @type {object[]}
       * @default null
       */
      invalidControls: null,

      /**
       * Handles the reporting of an invalid field. This will disable the button to prevent users from clicking it.
       *
       * @instance
       * @param {object} payload The published details of the invalid field.
       */
      onInvalidControl: function alfresco_buttons_AlfButton__onInvalidControl(payload) {
         var alreadyCaptured = array.some(this.invalidControls, function(item) {
            return item == payload.name;
         });
         if (!alreadyCaptured)
         {
            this.invalidControls.push(payload.name);
         }
         this.set("disabled", "true");
      },

      /**
       * Handles the reporting of a valid field. If the field was previously recorded as being
       * invalid then it is removed from the [invalidControls]{@link module:alfresco/forms/Form#invalidControls}
       * attribute and it was the field was the only field in error then the "OK" button is
       * enabled.
       *
       * @instance
       * @param {object} payload The published details of the field that has become valid
       */
      onValidControl: function alfresco_buttons_AlfButton__onValidControl(payload) {
         this.invalidControls = array.filter(this.invalidControls, function(item) {
            return item != payload.name;
         });
         this.set("disabled", this.invalidControls.length > 0);
      },

      /**
       * Handles click events to publish the [publishPayload]{@link module:alfresco/buttons/AlfButton#publishPayload}
       * on the [publishTopic]{@link module:alfresco/buttons/AlfButton#publishTopic}
       *
       * @instance
       * @param {object} evt The click event
       */
      onClick: function alfresco_buttons_AlfButton__onClick(evt) {
         if (this.publishTopic != null && this.publishTopic !== "")
         {
            this.alfPublish(this.publishTopic, this.publishPayload, (this.publishGlobal !== undefined && this.publishGlobal === true));
         }
         else
         {
            this.alfLog("warn", "A widget was clicked but did not provide any information on how to handle the event", this);
         }
         if (evt)
         {
            event.stop(evt);
         }
      }
   });
});