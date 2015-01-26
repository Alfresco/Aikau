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
 * This is a prototype form control that wraps a new instance of a <a href="http://codemirror.net/">Code Mirror editor</a>.
 * It is not ready for production use yet.
 * 
 * @module alfresco/forms/controls/CodeMirrorEditor
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "alfresco/core/ResizeMixin",
        "dojo/Deferred",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/_base/lang",
        "dojo/_base/array",
        "cm/lib/codemirror",
        "cm/mode/htmlmixed/htmlmixed"], 
        function(BaseFormControl, declare, ResizeMixin, Deferred, domConstruct, domClass, lang, array, cm) {
   
   return declare([BaseFormControl, ResizeMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile: "/js/lib/code-mirror/lib/codemirror.css"},
                        {cssFile: "./css/CodeMirrorEditor.css"}],

      /**
       * This is the editor mode for the embedded CodeMirror editor. By default it is "xml". This
       * will control the syntax highlighting.
       * 
       * @instance
       * @type {string}
       * @default "xml"
       */
      editMode: "xml",

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_CodeMirrorEditor__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.generateUuid(),
            name: this.name,
            value: this.value
         };
      },
      
      /**
       * Indicates that the call to [createFormControl]{@link module:alfresco/forms/controls/CodeMirrorEditor#createFormControl}
       * is going to return a "promise" rather than an actual widget because it needs to require the additional AMD resources
       * first.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      isPromisedWidget: true,

      /**
       * Instantiates a new JSON editor, places it in the template DOM and setups the change events.
       * 
       * The ACE module sneakily overwrites the "require" variable which will prevent subsequent
       * calls to the Dojo require from working, therefore it's necessary to keep a reference to
       * the original function and then undo the damage once ACE has been loaded...
       * Although we could have included these in the modules "define" statement and have them
       * preloaded into the Dojo cache would break the page as soon as the ACE module is processed :(
       * 
       * @instance
       */
      createFormControl: function alfresco_forms_controls_CodeMirrorEditor__createFormControl(config) {
         this.alfSetupResizeSubscriptions(this.onResizeEvent, this);

         // Update the DOM node to include a specific class that we can anchor styles off...
         domClass.add(this.domNode, "alfresco-forms-controls-CodeMirrorEditor");

         // Create a new element to attach the editor to...
         this.editorElement = domConstruct.create("textarea", { 
            style: "height:" + this.height + "px;width:" + this.width + "px;"
         }, this._controlNode);
         
         this.wrappedWidget = new Deferred();
         require(["cm/mode/" + this.editMode + "/" + this.editMode], lang.hitch(this, this.setupEditor));
            
         // TODO: Disable the "Tab" key binding for accessibility reasons...
         // this.wrappedWidget.commands.bindKey("Tab", null);
         return this.wrappedWidget;
      },

      /**
       * This is the callback function for resize events relating to the DOM element of this widget. It's
       * primary use is to call the CodeMirror refresh function and has been added to handle the scenario
       * where an editor is included in an [AlfDialog]{@link module:alfresco/dialogs/AlfDialog}. The AlfDialog
       * publishes a resize event when it is first opened and this can be used to ensure that the editor 
       * is rendered correctly (because otherwise it doesn't!)
       * 
       * @instance
       */
      onResizeEvent: function alfresco_forms_controls_CodeMirrorEditor__onResizeEvent() {
         this.wrappedWidget.refresh();
      },

      /**
       * The width of the editor (in pixels).
       * 
       * @instance
       * @type {number}
       * @default 600
       */
      width: 600,

      /**
       * The height of the editor  (in pixels).
       * 
       * @instance
       * @type {number}
       * @default 600
       */
      height: 300,

      /**
       * Creates and configures the CodeMirror editor.
       *
       * @instance
       */
      setupEditor: function alfresco_forms_controls_CodeMirrorEditor__setupEditor() {
         var editor = cm.fromTextArea(this.editorElement, {
            lineNumbers: true,
            mode: this.editMode
         });
         editor.setSize(this.width, this.height);
         
         // Set the initial content...
         var initialValue = this.value != null ? this.value : "";
         this.lastValue = initialValue;
         editor.setValue(initialValue);
         
         // Handle changes to the content...
         editor.on("change", lang.hitch(this, this.onEditorChange));

         this.wrappedWidget.resolve(editor);

         // TODO: Possibly need to call refresh when the widget is made visible
         //       Need to check what happens when added directly to page but there are issues when used in a dialog
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#placeWidget}
       * primarily to prevent an unnecessary warning being logged. But additionally this calls the refresh function
       * on the Code Mirror editor to ensure it is rendered correctly.
       *
       * @instance
       */
      placeWidget: function alfresco_forms_controls_CodeMirrorEditor__placeWrappedWidget() {
         this.wrappedWidget.refresh();
      },
      
      /**
       * A callback handler that is hitched to change events in the instantiation of the JSON editor.
       * 
       * @instance
       */
      onEditorChange: function alfresco_forms_controls_CodeMirrorEditor__onEditorChange(editor, changeObject) {
         var value = editor.getValue();
         this.onValueChangeEvent(this.name, this.lastValue, value);
         this.lastValue = value;
      },
      
      /**
       * Extends the [default function]{@link module:alfresco/forms/controls/BaseFormControl#processValidationRules} to 
       * see if the editor any errors. Currently the error checking is not actually implemented.
       * 
       * @instance
       * @returns {boolean} True if the editor content is valid and false otherwise.
       */
      processValidationRules: function alfresco_forms_controls_CodeMirrorEditor__processValidationRules() {
         var valid = this.inherited(arguments);
         // TODO: It would be nice if we could hook into some validation commands from CodeMirror
         return valid;
      },
      
      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#getValue} to
       * call the "getValue" function on the editor. This returns the JSON text rather than a JavaScript object.
       * 
       * @instance
       * @returns {string} The JSON value entered into the editor
       */
      getValue: function alfresco_forms_controls_CodeMirrorEditor__getValue() {
         if (this.wrappedWidget != null &&  typeof this.wrappedWidget.getValue === "function")
         {
            return this.wrappedWidget.getValue();
         }
         else
         {
            return this.value != null ? this.value : "";
         }
      }
   });
});