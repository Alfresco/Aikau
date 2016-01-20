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
 *
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
        "dojo/_base/array",
        "dojo/dom-construct",
        "dijit/form/DropDownButton",
        "dijit/TooltipDialog"], 
        function(declare, _WidgetBase, _TemplatedMixin, template,  AlfCore, CoreWidgetProcessing, array, 
                 domConstruct, DropDownButton, TooltipDialog) {

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
       * This is the label to display in the button.
       *
       * @instance
       * @type {string}
       * @default
       */
      label: "",

      /**
       * Instantiates the MenuBar (a custom declared implementation) and processes the widgets assigned to ensure
       * that the labels are localized before being sent for processing.
       * 
       * @instance
       */
      postCreate: function alfresco_menus_AlfMenuBar__postCreate() {
         this._dropDownDisplay = new TooltipDialog({
            id: this.id + "_DROP_DOWN_DISPLAY",
            "class": "alfresco-buttons-DropDownButton__drop-down-display"
         });

         this._dropDownButton = new DropDownButton({
            id: this.id + "_DROP_DOWN_BUTTON",
            label: this.label ? this.message(this.label) : "",
            dropDown: this._dropDownDisplay,
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
      },
      
      /**
       * Implements the callback to add all of the widgets into the MenuBar.
       * 
       * @instance
       * @param widgets The widgets that have been successfully instantiated.
       */
      allWidgetsProcessed: function alfresco_menus_AlfMenuBar__allWidgetsProcessed(widgets) {
         array.forEach(widgets, function(entry) {
            this._dropDownDisplay.addChild(entry);
         }, this);
      }
   });
});