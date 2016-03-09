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
 * This is a button that when clicked will reveal a drop-down display that can contain a 
 * [widget model]{@link module:alfresco/buttons/DropDownButton#widgets}. The drop-down can
 * be hidden by clicking on the button again, anywhere else on the page or through the 
 * use of the ESC key. It is also possible to configure 
 * [topics]{@link module:alfresco/buttons/DropDownButton#hideDropDownTopics} that when
 * published will also hide the drop-down. For example, if the drop-down contains a 
 * [form]{@link module:alfresco/forms/Form} it might be required to close the drop-down button
 * when the [confirmation button topic]{@link module:/alfresco/forms/Form#okButtonPublishTopic}
 * is published.
 *
 * @example <caption>Drop-down containing a form that is hidden when confirmation button is clicked</caption>
 * {
 *   name: "alfresco/buttons/DropDownButton",
 *   config: {
 *     hideDropDownTopics: ["SAVE"],
 *     label: "Show Form",
 *     widgets: [
 *        {
 *           name: "alfresco/forms/Form",
 *           config: {
 *              okButtonPublishTopic: "SAVE",
 *              okButtonPublishGlobal: true,
 *              widgets: [
 *                 {
 *                    name: "alfresco/forms/controls/TextBox",
 *                    config: {
 *                       label: "Value",
 *                       name: "value"
 *                    }
 *                 }
 *              ]
 *           }
 *        }
 *     ]
 *   }
 * }
 * 
 * @module alfresco/buttons/DropDownButton
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 * @since 1.0.52
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/DropDownButton.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/topics",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dijit/form/DropDownButton",
        "dijit/TooltipDialog"], 
        function(declare, _WidgetBase, _TemplatedMixin, template,  AlfCore, CoreWidgetProcessing, topics, array, 
                 lang, domConstruct, DropDownButton, TooltipDialog) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/DropDownButton.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * An array of topics that when published will call 
       * [hideDropDown]{@link module:alfresco/buttons/DropDownButton#hideDropDown} to 
       * hide the[drop down]{@link module:alfresco/buttons/DropDownButton#_dropDownDisplay} 
       * 
       * @instance
       * @type {string[]}
       * @default
       */
      hideDropDownTopics: null,

      /**
       * This is the label to display in the button.
       *
       * @instance
       * @type {string}
       * @default
       */
      label: "",

      /**
       * This can be used to reference the widget that references the drop-down button. By default
       * it will be a dijit/form/DropDownButton.
       * 
       * @instance
       * @type {object}
       * @default
       */
      _dropDownButton: null,

      /**
       * This can be used to reference the widget that references the drop-down display. By default
       * it will be a dijit/TooltipDialog.
       * 
       * @instance
       * @type {object}
       * @default
       */
      _dropDownDisplay: null,

      /**
       * The widgets to render in the [drop down]{@link module:alfresco/buttons/DropDownButton#_dropDownDisplay}.
       * 
       * @instance
       * @type {object}
       * @default
       */
      widgets: null,

      /**
       * This function can be used to hide the [drop down]{@link module:alfresco/buttons/DropDownButton#_dropDownDisplay}.
       * Will be called whenever any of the 
       * [hideDropDownTopics]{@link module:alfresco/buttons/DropDownButton#hideDropDownTopics} are published.
       * 
       * @instance
       */
      hideDropDown: function alfresco_buttons_DropDownButton__hideDropDown() {
         // NOTE: Tried this using dijit/popup dependency and it didn't work...
         dijit.popup.close(this._dropDownDisplay);
      },

      /**
       * This function is called whenever the [drop down]{@link module:alfresco/buttons/DropDownButton#_dropDownDisplay}
       * is displayed. It is necessary to publish a 
       * [WIDGET_PROCESSING_COMPLETE]{@link module:alfresco/core/topics#WIDGET_PROCESSING_COMPLETE} topic to ensure that
       * widgets can complete any processing required once they've been added to the DOM. This is especially important
       * for [form controls]{@link module:alfresco/forms/BaseFormControl}.
       * 
       * @instance
       * @fires module:alfresco/core/topics#WIDGET_PROCESSING_COMPLETE
       */
      onDropDownDisplayShown: function alfresco_buttons_DropDownButton__onDropDownDisplayShown() {
         this.alfPublish(topics.WIDGET_PROCESSING_COMPLETE);
      },

      /**
       * Instantiates the MenuBar (a custom declared implementation) and processes the widgets assigned to ensure
       * that the labels are localized before being sent for processing.
       * 
       * @instance
       */
      postCreate: function alfresco_buttons_DropDownButton__postCreate() {
         this._dropDownDisplay = new TooltipDialog({
            id: this.id + "_DROP_DOWN_DISPLAY",
            "class": "alfresco-buttons-DropDownButton__drop-down-display",
            onShow: lang.hitch(this, this.onDropDownDisplayShown)
         });
         
         this._dropDownButton = new DropDownButton({
            id: this.id + "_DROP_DOWN_BUTTON",
            label: this.label ? this.message(this.label) : "",
            dropDown: this._dropDownDisplay
         });

         this._dropDownButton.placeAt(this.domNode);

         // Create an element for masking the tooltip dialog to create a seemless bordered object...
         domConstruct.create("span", {
            className: "alfresco-buttons-DropDownButton__blanking"
         }, this._dropDownButton.domNode);

         if (this.widgets)
         {
            this.processWidgets(this.widgets);
         }

         array.forEach(this.hideDropDownTopics, function(topic) {
            this.alfSubscribe(topic, lang.hitch(this, this.hideDropDown));
         }, this);
      },
      
      /**
       * Implements the callback to add all of the widgets into the MenuBar.
       * 
       * @instance
       * @param widgets The widgets that have been successfully instantiated.
       */
      allWidgetsProcessed: function alfresco_buttons_DropDownButton__allWidgetsProcessed(widgets) {
         array.forEach(widgets, function(entry) {
            this._dropDownDisplay.addChild(entry);
         }, this);
      }
   });
});