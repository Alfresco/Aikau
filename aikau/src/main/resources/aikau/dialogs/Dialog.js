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
 * @module aikau/dialogs/Dialog
 * @extends module:aikau/mdl/BaseMdlWidget
 * @author Dave Draper
 * @since 1.0.96
 */
define(["dojo/_base/declare",
        "aikau/mdl/BaseMdlWidget", 
        "dojo/text!./templates/Dialog.html",
        "alfresco/core/topics",
        "dojo/_base/lang",
        "dojo/aspect",
        "dojo/dom-style",
        "dojo/sniff"], 
        function(declare, BaseMdlWidget, template, topics, lang, aspect, domStyle, has) {
   
   return declare([BaseMdlWidget], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/Dialog.css"}]
       */
      cssRequirements: [{cssFile:"./css/Dialog.css"},
                        {cssFile:"/js/lib/dialog/dialog-polyfill.css"}],
      
      /**
       * The HTML template to use for the widget.
       * 
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The dialog polyfill required for most browsers.
       * 
       * @instance
       * @type {string[]}
       */
      nonAmdDependencies: ["/js/lib/dialog/dialog-polyfill.js"],

      /**
       * Sets up the title for the dialog
       * 
       * @instance
       */
      postMixInProperties: function aikau_dialogs_Dialog__postMixInProperties() {
         this.inherited(arguments);
         this.dialogTitle = this.title;
      },

      /**
       * Creates the child widgets.
       * 
       * @instance
       */
      postCreate: function aikau_dialogs_Dialog__postCreate() {
         this._targetNode = this.widgetsContent;
         this.inherited(arguments);

         if (this.widgetsButtons)
         {
            this.createChildren({
               widgets: this.widgetsButtons,
               targetNode: this.buttonsNode
            }).then(lang.hitch(this, function(widgets) {
               this.buttons = widgets;
               this.buttons.forEach(lang.hitch(this, this.attachButtonHandler));
            }));
         }

         if (this.widgetsContent)
         {
            this.createChildren({
               widgets: this.widgetsContent,
               targetNode: this.contentNode
            }).then(lang.hitch(this, function(widgets) {
               this.content = widgets;

               this.buttons.forEach(lang.hitch(this, function(button) {
                  // TODO: This section of code would be better abstracted from AlfDialog...
                  if (!button.publishPayload)
                  {
                     button.publishPayload = {};
                  }
                  button.publishPayload.dialogContent = widgets;
                  button.publishPayload.dialogRef = this;
               }));
            }));
         }

         if (this.dialogWidth)
         {
            domStyle.set(this.domNode, {
               width: this.dialogWidth,
               margin: "auto"
            });
         }

         if (this.contentHeight)
         {
            domStyle.set(this.contentNode, "height", this.contentHeight);
         }
         if (this.contentWidth)
         {
            domStyle.set(this.contentNode, "width", this.contentWidth);

            var ieRegex = /(Trident\/)|(Edge\/)/;
            var isIE = has("IE") || ieRegex.test(navigator.userAgent);
            if (isIE)
            {
               var pureWidth = Number(this.contentWidth.replace(/[^\d\.\-]/g, ""));
               pureWidth += 40;
               domStyle.set(this.domNode, "width", pureWidth + "px");
            }
         }

         /* global dialogPolyfill */
         dialogPolyfill.registerDialog(this.domNode);

         // It is necessary to append the dialog to the document body in order
         // for the showModal function to work...
         document.body.appendChild(this.domNode);
      },

      /**
       * Returns an array of all the buttons in the dialog.
       * 
       * @instance
       */
      getButtons: function aikau_dialogs_Dialog__getButtons() {
         return this.buttons;
      },

      /**
       * This function is called to display the dialog.
       * 
       * @instance
       */
      show: function aikau_dialogs_Dialog__show() {
         this.domNode.showModal();
         this.alfServicePublish(topics.WIDGET_PROCESSING_COMPLETE);
      },

      /**
       * This function is called to hide the dialog.
       * 
       * @instance
       */
      hide: function aikau_dialogs_Dialog__hide() {
         this.domNode.open && this.domNode.close();
      },

      /**
       * Hide the dialog when any button is clicked.
       *
       * TODO: Needs feature parity with original dialog (see matching function).
       *
       * @instance
       */
      attachButtonHandler: function aikau_dialogs_Dialog__attachButtonHandler(button) {
         aspect.before(button, "onClick", lang.hitch(this, this.hide));
      }
   });
});