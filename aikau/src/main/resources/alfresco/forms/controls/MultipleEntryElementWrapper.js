/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * This widget is used to wrap individual [multiple entry elements]{@link module:alfresco/forms/controls/MultipleEntryElement}
 * to allow them to be deleted and to switch them between edit and read mode. Read mode is designed to given a condensed human
 * readable description of the what each element represents and the edit mode allows the user to configure the behaviour.
 * 
 * @module alfresco/forms/controls/MultipleEntryElementWrapper
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes external:dojo/_FocusMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "dijit/_FocusMixin",
        "dojo/text!./templates/MultipleEntryElementWrapper.html",
        "alfresco/core/Core",
        "dojo/_base/array",
        "dojo/dom-class",
        "dijit/focus"], 
        function(declare, _Widget, _Templated, _OnDijitClickMixin, _FocusMixin, template, AlfCore, array, domClass, focusUtil) {
   
   return declare([_Widget, _Templated, _OnDijitClickMixin, _FocusMixin, AlfCore], {
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * This keeps track of the MultipleEntryCreator that created this wrapper. It is required so that the
       * MultipleEntryCreator can be updated with delete requests.
       * 
       * @instance
       * @default null
       */
      creator: null,
      
      /**
       * Indicates whether or not this wrapper represents an element that has previously been created
       * or whether this is being used to potentially create a new element. This is important so that
       * it can be determined whether or not to delete the wrapper when cancelling editing or to 
       * simple return the wrapper to it's previous state.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      previouslyExisted: false,

      /**
       * This is the altText that is used for the add entry button.
       * 
       * @instance
       * @type {string}
       * @default "multiple-entry.save"
       */
      saveEntryAltText: "multiple-entry.save",

      /**
       * This is the source of the image used for the save entry button
       *
       * @instance
       * @type {string}
       * @default null
       */
      saveEntryImageSrc: null,

      /**
       * This is the default image used for the save entry button. It will be used if a
       * [saveEntryImageSrc]{@link module:alfresco/forms/controls/MultipleEntryElementWrapper#saveEntryImageSrc}
       * has not been provided.
       *
       * @instance
       * @type {string}
       * @default "done-16.png"
       */
      saveEntryImage: "done-16.png",

      /**
       * This is the altText that is used for the cancel edit button.
       * 
       * @instance
       * @type {string}
       * @default "multiple-entry.cancel"
       */
      cancelEditAltText: "multiple-entry.cancel",

      /**
       * This is the source of the image used for the save entry button
       *
       * @instance
       * @type {string}
       * @default null
       */
      cancelEditImageSrc: null,

      /**
       * This is the default image used for the cancel editing button. It will be used if a
       * [cancelEditImageSrc]{@link module:alfresco/forms/controls/MultipleEntryElementWrapper#cancelEditImageSrc}
       * has not been provided.
       *
       * @instance
       * @type {string}
       * @default "delete-16.png"
       */
      cancelEditImage: "delete-16.png",

      /**
       * This is the altText that is used for the delete entry button.
       * 
       * @instance
       * @type {string}
       * @default "multiple-entry.delete"
       */
      deleteEntryAltText: "multiple-entry.delete",

      /**
       * This is the source of the image used for the delete entry button
       *
       * @instance
       * @type {string}
       * @default null
       */
      deleteEntryImageSrc: null,

      /**
       * This is the default image used for the delete entry button. It will be used if a
       * [deleteEntryImageSrc]{@link module:alfresco/forms/controls/MultipleEntryElementWrapper#deleteEntryImageSrc}
       * has not been provided.
       *
       * @instance
       * @type {string}
       * @default "delete-16.png"
       */
      deleteEntryImage: "delete-16.png",

       /**
       * This is the altText that is used for the edit entry button.
       * 
       * @instance
       * @type {string}
       * @default "multiple-entry.delete"
       */
      editEntryAltText: "multiple-entry.edit",

      /**
       * This is the source of the image used for the edit entry button
       *
       * @instance
       * @type {string}
       * @default null
       */
      editEntryImageSrc: null,

      /**
       * This is the default image used for the edit entry button. It will be used if a
       * [editEntryImageSrc]{@link module:alfresco/forms/controls/MultipleEntryElementWrapper#editEntryImageSrc}
       * has not been provided.
       *
       * @instance
       * @type {string}
       * @default "delete-16.png"
       */
      editEntryImage: "edit-16.png",

      /**
       * @instance
       */
      constructor: function alfresco_forms_controls_MultipleEntryElementWrapper__constructor(args) {
         declare.safeMixin(this, args);
      },

      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_forms_controls_MultipleEntryElementWrapper__postMixInProperties() {
         if (this.saveEntryImageSrc == null || this.saveEntryImageSrc == "")
         {
            this.saveEntryImageSrc = require.toUrl("alfresco/forms/controls") + "/css/images/" + this.saveEntryImage;
         }
         this.saveEntryAltText = this.message(this.saveEntryAltText);
         if (this.cancelEditImageSrc == null || this.cancelEditImageSrc == "")
         {
            this.cancelEditImageSrc = require.toUrl("alfresco/forms/controls") + "/css/images/" + this.cancelEditImage;
         }
         this.cancelEditAltText = this.message(this.cancelEditAltText);
         if (this.deleteEntryImageSrc == null || this.deleteEntryImageSrc == "")
         {
            this.deleteEntryImageSrc = require.toUrl("alfresco/forms/controls") + "/css/images/" + this.deleteEntryImage;
         }
         this.deleteEntryAltText = this.message(this.deleteEntryAltText);
         if (this.editEntryImageSrc == null || this.editEntryImageSrc == "")
         {
            this.editEntryImageSrc = require.toUrl("alfresco/forms/controls") + "/css/images/" + this.editEntryImage;
         }
         this.editEntryAltText = this.message(this.editEntryAltText);
      },
      
      /**
       * The widget should be passed as a constructor configuration argument.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      widget: null,
      
      /**
       * @instance
       */
      postCreate: function alfresco_forms_controls_MultipleEntryElementWrapper__postCreate() {
         
         // Check that a widget has been provided and then add it into the correct node...
         if (this.widget != null)
         {
            this.widget.wrapper = this;
            this.widget.placeAt(this.containerNode);
         }
      },
      
      /**
       * Handles the completion of editing an item
       * 
       * @instance
       */
      doneEditingElement: function alfresco_forms_controls_MultipleEntryElementWrapper__doneEditingElement() {
         this.alfLog("log", "Done editing button clicked", this);

         // Ensure that the element is now marked has "existing". This will prevent it from being deleted
         // when editing is cancelled (as is the behaviour for elements that didn't previously exist)...
         this.previouslyExisted = true;

         // When finished editing it is necessary to call the creators validationRequired function so outer
         // forms can be notified of updates to values...
         this.creator.validationRequired();
         this.blurWrapper(true);
      },

      /**
       * Handles cancelling editing an item. If the item previously existed (e.g. edit mode wasn't entered
       * in order to create a new item) then the previous state of the item will be returned. If the item
       * has not yet been created then this wrapper (and the item it contains) will be deleted by calling
       * [deleteEntry]{@link module:alfresco/forms/controls/MultipleEntryCreator#deleteEntry}.
       * 
       * @instance
       */
      cancelEditingElement: function alfresco_forms_controls_MultipleEntryElementWrapper__cancelEditingElement() {
         this.alfLog("log", "Cancelled editing", this);
         if (this.previouslyExisted)
         {
            // The element previously existed, so return to it's previous state...
            this.blurWrapper(false);
         }
         else
         {
            // The element has never been created so this wrapper can just be deleted...
            this.creator.deleteEntry(this);
         }
      },
      
      /**
       * This called when the edit button is clicked. It switches the element from read to edit mode.
       * 
       * @instance
       */
      editElement: function alfresco_forms_controls_MultipleEntryElementWrapper__editElement() {
         this.alfLog("log", "Edit element clicked", {});
         
         // Switch the widget into edit mode...
         if (this.widget && typeof this.widget.editMode == "function")
         {
            this.widget.editMode(true);
            
            // Hide the edit and delete buttons...
            if (this.doneEditingButton)
            {
               domClass.remove(this.doneEditingButton, "clear-hide");
            }
            if (this.cancelEditingButton)
            {
               domClass.remove(this.cancelEditingButton, "clear-hide");
            }
            if (this.deleteButton)
            {
               domClass.add(this.deleteButton, "clear-hide");
            }
            if (this.editButton)
            {
               domClass.add(this.editButton, "clear-hide");
            }
         }
      },
      
      /**
       * @instance
       */
      deleteElement: function alfresco_forms_controls_MultipleEntryElementWrapper__deleteElement(e) {
         this.alfLog("log", "Delete element clicked", {});
         
         // When the delete button is clicked the wrapper should be removed and it's data should also be removed from
         // the overall value of the widget.
         this.creator.deleteEntry(this);
      },
      
      /**
       * Handles blurring of the wrapper
       * 
       * @instance
       * @param {boolean} saveChanges Indicates whether or not state changes should be saved.
       */
      blurWrapper: function alfresco_forms_controls_MultipleEntryElementWrapper__blurWrapper(saveChanges) {
         if (this.widget && typeof this.widget.editMode === "function")
         {
            this.widget.editMode(false, saveChanges);
            
            // Show the edit and delete buttons (check for the nodes existences in case an 
            // extension has overridden the template to remove them)...
            if (this.doneEditingButton)
            {
               domClass.add(this.doneEditingButton, "clear-hide");
            }
            if (this.cancelEditingButton)
            {
               domClass.add(this.cancelEditingButton, "clear-hide");
            }
            if (this.deleteButton)
            {
               domClass.remove(this.deleteButton, "clear-hide");
            }
            if (this.editButton)
            {
               domClass.remove(this.editButton, "clear-hide");
            }
         }
      }
   });
});