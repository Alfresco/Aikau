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
       * 
       * 
       * @instance
       * @type {string}
       * @default
       */
      editMode: "markdown",

      

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_FileSelect__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.generateUuid(),
            name: this.name,
            filterMimeType: this.filterMimeType
         };
      },

      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_FileSelect__createFormControl(config, /*jshint unused:false*/ domNode) {
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
               subscriptionTopics: [this.generatePreviewTopic]
            }
         });
         preview.placeAt(this.previewNode);

         domStyle.set(this._controlNode, "height", this.height + "px");

         return widget;
      },

      onEditorChange: function alfresco_forms_controls_CodeMirrorEditor__onEditorChange(editor, changeObject) {
         /*jshint unused:false*/
         this.inherited(arguments);

         this.alfPublish(this.generatePreviewTopic, {
            markdown: this.lastValue
         });
      }

      
   });
});
