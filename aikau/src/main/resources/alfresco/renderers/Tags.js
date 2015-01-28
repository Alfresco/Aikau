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
 * Extends the [inline edit property renderer]{@link module:alfresco/renderers/InlineEditProperty} to provide
 * the ability to edit and save tags.
 * 
 * @module alfresco/renderers/Tags
 * @extends module:alfresco/renderers/InlineEditProperty
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/InlineEditProperty", 
        "alfresco/core/ObjectTypeUtils",
        "dojo/_base/array",
        "dojo/_base/lang",
        "alfresco/forms/controls/ComboBox",
        "alfresco/renderers/ReadOnlyTag",
        "alfresco/renderers/EditTag",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dijit/registry",
        "dojo/on",
        "dojo/keys",
        "dojo/_base/event"], 
        function(declare, InlineEditProperty, ObjectTypeUtils, array, lang, ComboBox, ReadOnlyTag, EditTag, domConstruct, 
                 domClass, registry, on, keys, event) {

   return declare([InlineEditProperty], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Tags.css"}]
       */
      cssRequirements: [{cssFile:"./css/Tags.css"}],
      
      /**
       * Overrides the [inherited function]{@link module:alfresco/renderers/Property#getRenderedProperty} to convert the tags
       * value into visual tokens.
       * 
       * @instance
       */
      getRenderedProperty: function alfresco_renderers_Tags__getRenderedProperty(value) {
         // Reset the tags...
         var renderedValue = null;
         array.forEach(this.currentTags, lang.hitch(this, this.destroyTag));
         this.currentTags = [];
         if (!ObjectTypeUtils.isArray(value))
         {
            this.alfLog("warn", "Expected an array value for tags", this, value);
         }
         else
         {
            array.forEach(value, lang.hitch(this, this.createReadOnlyTag, "name", "nodeRef"));
            renderedValue = ""; // By setting an empty string as a rendered value the inherited postMixInProperties function knows that a value is set.
         }
         return renderedValue; // Always return the empty string
      },
  
      /**
       * By default this simply calls the destroy function of the tag widget (if it has one)
       * 
       * @instance
       * @param {object} tagWidget The tag to be destroyed.
       */
      destroyTag: function alfresco_renderers_Tags__destroyTag(tagWidget) {
         if (typeof tagWidget.destroy === "function")
         {
            tagWidget.destroy();
         }
      },
      
      /**
       * Called from [getRenderedProperty]{@link module:alfresco/renderers/Tags#getRenderedProperty} to render an individual
       * read only tag.
       * 
       * @instance
       * @param {string} nameAttribute The attribute to use from the tagData object as the tag name
       * @param {string} valueAttribute The attribute to use from the tagData object as the tag value
       * @param {object} tagData The tag data to render
       * @param {number} index The index of the tag in the overall array
       */
      createReadOnlyTag: function alfresco_renderers_Tags__createReadOnlyTag(nameAttribute, valueAttribute, tagData, index) {
         if (tagData == null || tagData[nameAttribute] == null)
         {
            this.alfLog("warn", "No '" + nameAttribute + "' attribute for tag", this, tagData);
         }
         else
         {
            // Create a ReadOnlyTag widget and place it in the rendered value section.
            var tagWidget = new ReadOnlyTag({
               tagName: tagData[nameAttribute],
               tagValue: tagData[valueAttribute]
            });
            
            // Keep track of the initial set of tags as this will be updated as new tags are added or tags
            // are removed...
            this.currentTags.push(tagWidget);
         }
      },
      
      /**
       * Extends the [inherited function]{@link module:alfresco/renderers/InlineEditProperty#postCreate} to add a custom
       * event handler for "ALF_REMOVE_TAG" events that are fired from descendant DOM nodes and to iterate over the
       * [read only tags]{@link module:alfresco/renderers/ReadOnlyTag} created by calls to the [createReadOnlyTag]{@link module:alfresco/renderers/Tags#createReadOnlyTag}
       * function and calls [placeTag]{@link module:alfresco/renderers/Tags#placeTag} on each of them to add them
       * to the widget.
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_Tags__postCreate() {
         this.inherited(arguments);

         if (this.currentTags && this.currentTags.length > 0)
         {
            domConstruct.empty(this.renderedValueNode);
            array.forEach(this.currentTags, lang.hitch(this, this.placeReadOnlyTag));
         }

         // Make a backup of the initial tags so that they can be restored on a cancel action...
         this.initialTags = lang.clone(this.currentTags);
      },
      
      /**
       * @instance
       * @param {object} tagWidget The tag widget to place.
       * @param {number} index The index of the tag
       */
      placeReadOnlyTag: function alfresco_renderers_Tags__placeReadOnlyTag(tagWidget, index) {
         tagWidget.placeAt(this.renderedValueNode);
      },
      
      /**
       * Overrides the [inherited function]{@link module:alfresco/renderers/InlineEditProperty#getPrimaryFormWidget}
       * to return a [select form control]{@link module:alfresco/forms/controls/Select}.
       *
       * @instance
       * @returns {object} The widget for editing.
       */
      getPrimaryFormWidget: function alfresco_renderers_Tags__getPrimaryFormWidget() {
         return {
            id: this.id + "_EDIT_TAGS",
            name: "alfresco/forms/controls/ComboBox", 
            config: {
               label: "",
               name: this.postParam,
               additionalCssClasses: "hiddenlabel",
               optionsConfig: {
                  queryAttribute: "name",
                  publishTopic: "ALF_RETRIEVE_CURRENT_TAGS",
                  publishPayload: {
                     resultsProperty: "response.data.items"
                  }
               }
            }
         };
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/renderers/InlineEditProperty#onEditClick} to 
       * create the edit tag instances.
       * 
       * @instance
       */
      onEditClick: function alfresco_renderers_Tags__onEditClick() {
         this.inherited(arguments);
         if (this.editTagsNode != null)
         {
            var oldEditTags = registry.findWidgets(this.editTagsNode);
            array.forEach(oldEditTags, lang.hitch(this, this.destroyTag));
            domConstruct.destroy(this.editTagsNode);
         }
         this.editTagsNode = domConstruct.create("span", {}, this.editNode, "first");
         on(this.editTagsNode, "ALF_REMOVE_TAG", lang.hitch(this, this.onRemoveEditTag));
         array.forEach(this.currentTags, lang.hitch(this, this.createEditTag, "tagName", "tagValue"));
      },
      
      /**
       * Called from [onEditClick]{@link module:alfresco/renderers/Tags#onEditClick} to render an individual
       * edit tag.
       * 
       * @instance
       * @param {string} nameAttribute The attribute to use from the tagData object as the tag name
       * @param {string} valueAttribute The attribute to use from the tagData object as the tag value
       * @param {object} tagData The read-only tag widget to create a corresponding edit tag for.
       * @param {number} index The index of the tag in the overall array
       */
      createEditTag: function alfresco_renderers_Tags__createEditTag(nameAttribute, valueAttribute, tagData, index) {
         var tagWidget = new EditTag({
            tagName: tagData[nameAttribute],
            tagValue: tagData[valueAttribute]
         });
         tagWidget.placeAt(this.editTagsNode);
         this.currentTags.push(tagWidget);
      },
      
      /**
       * Handles "ALF_REMOVE_TAG" events that are emitted from a DOM node descendant. The event target
       * should map to a previously created edit tag that can then be destroyed.
       * 
       * @instance
       */
      onRemoveEditTag: function alfresco_renderers_Tags__onRemoveEditTag(evt) {
         var tagWidget = registry.byNode(evt.target);
         if (tagWidget != null)
         {
            // Filter out the deleted tag from the list of current tags, this is done to ensure
            // that we persist the correct tags on save and redraw the correct tags on readonly mode...
            var tagName = tagWidget.tagName;
            this.currentTags = array.filter(this.currentTags, function(currTag, index) {
               return currTag.tagName !== tagName;
            });
            tagWidget.destroy();
         }
      },
      
      /**
       * This function is connected via the widget template. It occurs whenever a key is pressed whilst
       * focus is on the input field for updating the property value. All keypress events other than the
       * enter and escape key are ignored. Enter will save the data, escape will cancel editing
       * 
       * @instance
       * @param {object} e The key press event
       */
      onValueEntryKeyPress: function alfresco_renderers_Tags__onValueEntryKeyPress(e) {
         if(e.charOrCode == keys.ESCAPE)
         {
            event.stop(e);
            this.onCancel();
         }
         else if(e.charOrCode == keys.ENTER)
         {
            event.stop(e);
            var formValue = this.getFormWidget().getValue();
            var tagName = lang.getObject(this.postParam, false, formValue);
            if (tagName !== "")
            {
               var o = {};
               lang.setObject(this.postParam, "", o);
               this.getFormWidget().setValue(o);
               this.createTag(tagName, false);
            }
            else
            {
               this.onSave();
            }
         }
         // else if (e.charOrCode == keys.PAGE_DOWN ||
         //          e.charOrCode ==  keys.DOWN_ARROW ||
         //          e.charOrCode == keys.PAGE_UP ||
         //          e.charOrCode ==  keys.UP_ARROW)
         // {
         //    // Prevent up/down keys from bubbling. This is done to ensure that the 
         //    // focus doesn't shift to the previous or next item in the view.
         //    event.stop(e);
         // }
      },
      
      /**
       * Creates a tag at the remote store (the same location from which available tags are retrieved). This
       * function is called regardless of whether or not an existing tag was created. It is expected that
       * the REST API will be able to handle duplicated (e.g. not recreate a duplicate but just return the
       * details of the existing tag).
       * 
       * @instance
       * @param {string} tagName The name of the tag to create.
       * @param {boolean} saveTagsAfterCreate Indicates whether or not to save all tags on successful creation.
       * @return {object} The created tag details
       */
      createTag: function alfresco_renderers_Tags__createTag(tagName, saveTagsAfterCreate) {

         var tagUsed = array.some(this.currentTags, function(currentTag, index) {
            return currentTag.tagName === tagName;
         });

         if (tagUsed === true)
         {
            this.alfLog("log", "Tag already used, no need to add again", this, tagName);
            // TODO: Should we clear the ComboBox? Should we display a message?
         }
         else
         {
            var responseTopic = this.generateUuid();
            var payload = {
               tagName: tagName,
               alfResponseTopic: responseTopic
            };
            this._createTagHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onTagCreated), true);
            this.alfPublish("ALF_CREATE_TAG", payload, true);
         }
      },
      
      /**
       * @instance
       * @param {object} payload The payload of the successful tag creation request.
       */
      onTagCreated: function alfresco_renderers_Tags__onTagCreated(payload) {
         this.alfUnsubscribeSaveHandles([this._createTagHandle]);
         this.createEditTag("name", "nodeRef", payload.response);
         if (payload.originalRequestConfig.saveTagsAfterCreate === true)
         {
            this.onSave();
         }
      },
      
      /**
       * This extends the [inherited function]{@link module:alfresco/renderers/InlineEditProperty#onSave} to check whether
       * or not there is anything selected in the ComboBox. If so it uses the data to create the edit tag rather than
       * saving. This ensures that all of the tags are captured and saved.
       * 
       * @instance
       */
      onSave: function alfresco_renderers_Tags__onSave() {
         var formValue = this.getFormWidget().getValue();
         var tagName = lang.getObject(this.postParam, false, formValue);
         if (tagName !== "")
         {
            var o = {};
            lang.setObject(this.postParam, "", o);
            this.getFormWidget().setValue(o);
            this.createTag(tagName, true);
         }
         else
         {
            this.inherited(arguments);
         }
      },
      
      /**
       * Overrides the [inherited function]{@link module:alfresco/renderers/InlineEditProperty#updateSaveData} to 
       * set the save payload with the tag data.
       *
       * @instance
       * @param {object} payload The save payload to update.
       */
      updateSaveData: function alfresco_renderers_Tags__getSaveData(payload) {
         var editTags = registry.findWidgets(this.editTagsNode);
         var tags = "";
         for (var i=0; i<editTags.length; i++) 
         {
            tags = tags + "," + editTags[i].tagValue;
         }
         // Trim the first comma...
         if (tags.length > 0)
         {
            tags = tags.substring(1);
         }
         payload[this.postParam] = tags;
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/renderers/InlineEditProperty#onSaveSuccess} 
       * to render the newly saved tags.
       *
       * @instance
       * @param {object} payload The success payload
       */
      onSaveSuccess: function alfresco_renderers_Tags__onSaveSuccess(payload) {
         this.alfUnsubscribeSaveHandles([this._saveSuccessHandle, this._saveFailureHandle]);

         this.alfLog("log", "Property '" + this.propertyToRender + "' successfully updated for node: ", this.currentItem);

         // Remove all the old read-only tags...
         var oldReadOnlyTags = registry.findWidgets(this.renderedValueNode);
         array.forEach(oldReadOnlyTags, lang.hitch(this, this.destroyTag));
         domConstruct.empty(this.renderedValueNode);

         // Build the list of new tags from those in the edit view...
         this.currentTags = [];
         var editTags = registry.findWidgets(this.editTagsNode);
         array.forEach(editTags, lang.hitch(this, this.createReadOnlyTag, "tagName", "tagValue"));
         array.forEach(this.currentTags, lang.hitch(this, this.placeReadOnlyTag));

         // Update the initial tags to reflect the updated state...
         this.initialTags = lang.clone(this.currentTags);

         // Switch back into the "view" mode...
         domClass.remove(this.renderedValueNode, "hidden faded");
         domClass.add(this.editNode, "hidden");
         this.renderedValueNode.focus();
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/renderers/InlineEditProperty#onCancel} to clear
       * the edit tags.
       *
       * @instance
       */
      onCancel: function alfresco_renderers_Tags__onCancel() {
         this.inherited(arguments);
         this.currentTags = lang.clone(this.initialTags);
      }
   });
});