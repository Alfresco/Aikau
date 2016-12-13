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
 * This renderer should be used to show an individual comment that can be switched into an edit mode that
 * shows a [TinyMCE editor]{@link module:alfresco/forms/controls/TinyMCE} for updating the comment. Note that
 * the widget does not take responsibility for which users have the ability to toggle between read and edit 
 * modes. It does not provide the controls to switch modes so the other controls for toggling mode should be
 * rendered based on the current user permissions. Examples of this approach can be found in the 
 * [CommentsList renderer]{@link module:alfresco/renderers/CommentsList}.
 *
 * @module alfresco/renderers/EditableComment
 * @extends module:aikau/core/BaseWidget
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/renderers/_PublishPayloadMixin",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/dom-class"], 
        function(declare, BaseWidget, CoreWidgetProcessing, _PublishPayloadMixin, array, lang, domConstruct, domClass) {

   return declare([BaseWidget, CoreWidgetProcessing, _PublishPayloadMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/EditableComment.css"}]
       */
      cssRequirements: [{cssFile:"./css/EditableComment.css"}],
      
      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/EditableComment.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/EditableComment.properties"}],
      
      /**
       * This will be instantiated as a map of the controls used by the widget. It has been added in order
       * to be passed as a reference for the "assignToScope" attribute of the 
       * [TinyMCE form control]{@link module:alfresco/forms/controls/TinyMCE} that is referenced
       * in the [widgetsForForm]{@link module:alfresco/renderers/EditableComment#widgetsForForm} model. This
       * attribute should not be configured or set.
       * 
       * @instance
       * @type {object}
       * @default
       * @since 1.0.68
       */
      controls: null,

      /**
       * @instance
       * @type {string}
       * @default
       */
      okButtonLabel: "comment.save",

      /**
       * The parameter to post that contains the content.
       *
       * @instance
       * @type {string}
       * @default
       */
      postParam: "content",

      /**
       * This should be set to the name of the property to render (e.g. "cm:name"). The property is expected
       * to be in the properties map for the item being rendered. 
       * 
       * @instance
       * @type {string}
       * @default
       */
      propertyToRender: null,
      
      /**
       * The topic to publish whenever the internal form is posted. By default this is expected to 
       * work with the [CrudService]{@link module:alfresco/services/CrudService} and uses its update
       * topic but this can be easily overridden.
       * 
       * @instance
       * @type {string}
       * @default
       */
      publishTopic: "ALF_CRUD_UPDATE",

      /**
       * The payload to publish whenever a comment edit is saved.
       *
       * @instance
       * @type {object}
       */
      publishPayload: {
         url: "api/comment/node/{nodeRef}",
         pubSubScope: "{parentPubSubScope}"
      },

      /**
       * Defines the publish payload type. By default this is set to "PROCESS" as it is expected that we will
       * need to process currentItem data to set a nodeRef in the "url" attribute of the default publishPayload.
       *
       * @instance
       * @type {string}
       * @default
       */
      publishPayloadType: "PROCESS",

      /**
       * The default modifiers to use when processing the configured publishPayload.
       *
       * @instance
       * @type {array}
       * @default ["processCurrentItemTokens", "convertNodeRefToUrl","processInstanceTokens"]
       */
      publishPayloadModifiers: ["processCurrentItemTokens", "convertNodeRefToUrl","processInstanceTokens"],

      /**
       * Indicates whether or not publications should be made globally. Default is true.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      publishGlobal: true,

      /**
       * Indicates whether or not the widget is in read mode or not. Default is true.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      readMode: true,

      /**
       * The topic that will be subscribed to that will toggle between edit and read modes.
       *
       * @instance
       * @type {string}
       * @default
       */
      subscriptionTopic: "ALF_EDIT_COMMENT",

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_EditableComment__createWidgetDom() {
         this.domNode = document.createElement("div");
         this.domNode.classList.add("alfresco-renderers-EditableComment");
         this.domNode.classList.add(this._mode);

         this.readNode = document.createElement("div");
         this.readNode.classList.add("read");

         this.editNode = document.createElement("div");
         this.editNode.classList.add("edit");

         this.formNode = document.createElement("div");

         this.editNode.appendChild(this.formNode);
         this.domNode.appendChild(this.readNode);
         this.domNode.appendChild(this.editNode);
      },

      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_EditableComment__postMixInProperties() {
         // Initialise the mode...
         if (this.readMode === true)
         {
            this._mode = "read";
         }
         else
         {
            this._mode = "edit";
         }

         // Get the comment value...
         this.renderedValue = lang.getObject(this.propertyToRender, false, this.currentItem);
         if (this.renderedValue === null || typeof this.renderedValue === "undefined")
         {
            this.renderedValue = "";
         }
      },
      
      /**
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_EditableComment__postCreate() {
         this._formCreated = false;

         // Clone the configured payload to avoid collisions with other instances...
         this.publishPayload = lang.clone(this.publishPayload);

         // Setup subscriptions as necessary... (TODO: Overridable function?)
         this.alfSubscribe(this.subscriptionTopic, lang.hitch(this, this.onEditRequest));
         this.alfSubscribe("ALF_CANCEL_EDIT_COMMENT", lang.hitch(this, this.onCancelEdit));
         this.alfSubscribe("ALF_EDIT_COMMENT_SAVE", lang.hitch(this, this.onEditSave));

         // Safely add the rendered value to the document
         var safeDocFrag = this._makeSafe(this.renderedValue);
         this.readNode.appendChild(safeDocFrag);

         this.controls = {};
      },

      /**
       * This function switches the widget into edit mode. It will create the required editor as necessary
       * the first time the function is called.
       *
       * @instance
       * @param {object} payload
       */
      onEditRequest: function alfresco_renderers_EditableComment__onEditRequest(/*jshint unused:false*/ payload) {
         if (this._formCreated === false)
         {
            var widgetsConfig = lang.clone(this.widgetsForForm);
            this.processObject(["processInstanceTokens","processCurrentItemTokens","convertNodeRefToUrl"], widgetsConfig);
            this.processWidgets(widgetsConfig, this.formNode);
            this._formCreated = true;
         }

         // Toggle the CSS classes to reveal the edit form...
         domClass.remove(this.domNode, "read");
         domClass.add(this.domNode, "edit");
         this._mode = "edit";
      },

      /**
       * Handles requests to cancel editing
       *
       * @instance
       * @param {object} payload The payload published on the cancellation topic
       */
      onCancelEdit: function alfresco_renderers_EditableComment__onCancelEdit(/*jshint unused:false*/ payload) {
         domClass.remove(this.domNode, "edit");
         domClass.add(this.domNode, "read");
         this._mode = "read";

         // On cancel, make sure to reset the value in the TinyMCE editor...
         this._form._editControl.setValue(this.renderedValue);
      },

      /**
       * Handles requests to save the updated comment.
       *
       * @instance
       * @param {object} payload The details of the comment update
       */
      onEditSave: function alfresco_renderers_EditableComment__onEditSave(payload) {
         this.onCancelEdit();
         var dataPayload = lang.clone(payload);

         // Build a new payload to publish based on the supplied configuration...
         var generatedPayload = this.getGeneratedPayload(true);

         // Mix the data into the configured payload and publish it!
         lang.mixin(generatedPayload, dataPayload);

         // See AKU-957 - make sure that the parent pubSubScope is used. There might be a future case
         // where we need to make this configurable, but this should work in all scopes - it was previously
         // working at global scope, but the parentPubScope makes sense in all circumstances.
         generatedPayload.responseScope = this.parentPubSubScope;
         this.alfPublish(this.publishTopic, generatedPayload, this.publishGlobal);
      },

      /**
       * Convert the supplied, potentially-unsafe HTML into a safe document fragment
       *
       * @instance
       * @param    {string} unsafeHtml The "unsafe" HTML
       * @returns  {object} The now-safe HTML as a document fragment
       */
      _makeSafe: function alfresco_renderers_EditableComment___makeSafe(unsafeHtml) {
         var safeDocFrag = document.createDocumentFragment(),
            containerDiv = safeDocFrag.appendChild(document.createElement("DIV"));
         containerDiv.innerHTML = unsafeHtml;
         while(containerDiv.hasChildNodes()) {
            safeDocFrag.appendChild(containerDiv.firstChild);
         }
         safeDocFrag.removeChild(containerDiv);
         // TODO Make this safe!
         return safeDocFrag;
      },

      /**
       *
       * @instance
       */
      widgetsForForm: [
         {
            name: "alfresco/forms/Form",
            assignTo: "_form",
            config: {
               okButtonPublishTopic: "ALF_EDIT_COMMENT_SAVE",
               okButtonLabel: "{okButtonLabel}",
               okButtonPublishPayload: {
                  url: "api/comment/node/{nodeRef}"
               },
               cancelButtonPublishTopic: "ALF_CANCEL_EDIT_COMMENT",
               widgets: [
                  {
                     name: "alfresco/forms/controls/TinyMCE",
                     assignTo: "_editControl",
                     config: {
                        name: "{postParam}",
                        value: "{renderedValue}",
                        validationConfig: [
                           {
                              validation: "textContentRequired"
                           }
                        ]
                     }
                  }
               ]
            }
         }
      ]
   });
});