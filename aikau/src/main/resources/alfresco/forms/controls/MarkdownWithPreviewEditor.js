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
 * This form control provide an [editor]{@link module:alfresco/forms/controls/CodeMirrorEditor} configured
 * to show content in markdown format with an associated [preview]{@link module:alfresco/html/Markdown} widget
 * showing what the content is like.
 * 
 * @module alfresco/forms/controls/MarkdownWithPreviewEditor
 * @extends module:alfresco/forms/controls/CodeMirrorEditor
 * @author Dave Draper
 * @since 1.0.89
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/CodeMirrorEditor",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-style",
        // No callbacks from here
        "alfresco/html/Markdown"],
        function(declare, CodeMirrorEditor, CoreWidgetProcessing, domClass, domConstruct, domStyle) {

   return declare([CodeMirrorEditor, CoreWidgetProcessing], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/MarkdownWithPreviewEditor.css"}],

      /**
       * Overrides the [default configuration]{@link module:alfresco/forms/controls/CodeMirrorEditor#editMode}
       * to configure the [CodeMirrorEditor]{@link module:alfresco/forms/controls/CodeMirrorEditor} to use
       * markdown format.
       * 
       * @instance
       * @type {string}
       * @default
       */
      editMode: "markdown",

      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/CodeMirrorEditor#createFormControl}
       * to create a [Markdown]{@link module:alfresco/html/Markdown} widget to use to preview the markdown content.
       * 
       * @instance
       * @param {object} config The configuration to create the form control with
       * @param {element} domNode The element to create the form control in.
       */
      createFormControl: function alfresco_forms_controls_MarkdownWithPreviewEditor__createFormControl(config, /*jshint unused:false*/ domNode) {
         var widget = this.inherited(arguments);

         // Update the DOM node to include a specific class that we can anchor styles off...
         domClass.add(this.domNode, "alfresco-forms-controls-MarkdownWithPreviewEditor");

         this.generatePreviewTopic = this.generateUuid();

         this.previewNode = domConstruct.create("div", { 
            style: "height:" + this.height + "px;width:" + this.width + "px;",
            className: "alfresco-forms-controls-MarkdownWithPreviewEditor__previewNode"
         }, this._controlNode);

         var preview = this.createWidget({
            name: "alfresco/html/Markdown",
            config: {
               markdown: this.initialValue,
               subscriptionTopics: [this.generatePreviewTopic]
            }
         });
         preview.placeAt(this.previewNode);

         domStyle.set(this._controlNode, "height", this.height + "px");

         // NOTE: We need to make a one time call here to ensure label and description will be added...
         this.onWidgetAddedToDocument();
         return widget;
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/CodeMirrorEditor#onEditorChange}
       * to publish the edit changes to the [Markdown]{@link module:alfresco/html/Markdown} widget to update the preview
       * 
       * @instance
       * @param  {object} editor The editor being updated
       * @param  {object} changeObject An object with the details of the changes
       */
      onEditorChange: function alfresco_forms_controls_MarkdownWithPreviewEditor__onEditorChange(editor, changeObject) {
         /*jshint unused:false*/
         this.inherited(arguments);

         this.alfPublish(this.generatePreviewTopic, {
            markdown: this.lastValue
         });
      }
   });
});
