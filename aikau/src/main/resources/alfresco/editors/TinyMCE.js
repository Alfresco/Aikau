/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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

/*globals tinymce*/
/**
 * This is a prototype widget that handles requirements and instantiation of a TinyMCE editor. It is
 * not ready for production use yet as there as still outstanding issues.
 *
 * @module alfresco/editors/TinyMCE
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare", 
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin", 
        "dojo/text!./templates/TinyMCE.html", 
        "alfresco/core/Core", 
        "service/constants/Default", 
        "dojo/_base/lang"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, AlfConstants, lang) {


   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * Make sure TinyMCE is included on the page.
       *
       * @instance
       * @type {String[]}
       */
      nonAmdDependencies: ["/js/lib/tinymce/tinymce.js"],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,


      /**
       * The list of support locales for the editor. Can be overridden by only if there are the message
       * bundles available to support the additional locales.
       *
       * @instance
       * @type {string}
       * @default "en,de,es,fr,it,ja,nl,zh_CN,ru,nb,pt_BR"
       */
      supportedLocales: "en,de,es,fr,it,ja,nl,zh_CN,ru,nb,pt_BR",

      /**
       * The default configuration for the editor. These settings should not be configured (as they will apply
       * to all instances of the editor). However specific overrides can be achieved by setting the value of
       * [editorConfig]{@link module:alfresco/editors/TinyMCE#editorConfig} which will be mixed into these default
       * values.
       *
       * @instance
       * @type {object}
       */
      defaultEditorConfig: {
         height: 250,
         width: 538,
         menu: {},
         toolbar: "bold italic underline | bullist numlist | forecolor backcolor | undo redo removeformat",
         language: AlfConstants.JS_LOCALE,
         statusbar: false,
         theme_advanced_resize_horizontal: false
      },

      /**
       * Should be used to override the [defaultEditorConfig]{@link module:alfresco/editors/TinyMCE#defaultEditorConfig}
       *
       * @instance
       * @type {object}
       * @default null
       */
      editorConfig: null,

      /**
       * The content with which to intially populate the editor
       *
       * @instance
       * @type {string}
       * @default ""
       */
      intialContent: "",

      /**
       * Indicates whether or not the editor should be initialized as soon as it is created. This defaults to
       * true but should be configured to false if the editor is being created in a DOM fragment and the init
       * function should only be called once the DOM fragment has been placed into the document.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      immediateInit: true,

      /**
       *
       * @instance
       */
      postCreate: function alfresco_editors_TinyMCE__postCreate() {
         // Mix the custom editor config overrides into the default editor config...
         var config = lang.clone(this.defaultEditorConfig);
         if (this.editorConfig) {
            lang.mixin(config, this.editorConfig);
         }

         // Check that the language requested is supported...
         if (config.language) {
            var locales = this.supportedLocales.split(",");
            var locale = "en";
            for (var i = 0, j = locales.length; i < j; i++) {
               if (locales[i] === config.language) {
                  locale = config.language;
                  break;
               }
            }
            config.language = locale;
         }

         tinymce.baseURL = AlfConstants.URL_RESCONTEXT + "js/lib/tinymce";

         if (this.immediateInit === true) {
            this.init(config);
         } else {
            this._delayedInitConfig = config;
         }
      },

      /**
       *
       * @instance
       * @param {object} config The configuration to initialise the editor with
       */
      init: function alfresco_editors_TinyMCE__init(config) {
         config = config || this._delayedInitConfig;
         config.theme = "modern";
         if (!config.toolbar) {
            config.toolbar = "styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview fullscreen";
         }
         if (!config.menu) {
            config.menu = {
               // TODO: I18N
               file: {
                  title: "File",
                  items: "newdocument | print"
               },
               edit: {
                  title: "Edit",
                  items: "undo redo | cut copy paste pastetext | selectall | searchreplace"
               },
               insert: {
                  title: "Insert",
                  items: "link image | charmap hr anchor pagebreak inserttime nonbreaking"
               },
               view: {
                  title: "View",
                  items: "fullscreen preview visualblocks code"
               },
               format: {
                  title: "Format",
                  items: "bold italic underline strikethrough superscript subscript | formats | removeformat"
               },
               table: {
                  title: "Table",
                  items: "inserttable tableprops deletetable | cell row column"
               }
            };
         }
         config.plugins = [
            "advlist autolink link image lists charmap print preview hr anchor pagebreak",
            "searchreplace code fullscreen insertdatetime nonbreaking",
            "table contextmenu paste textcolor visualblocks"
         ];
         config.init_instance_callback = lang.hitch(this, this.editorInitialized);

         this.editor = new tinymce.Editor(this.editorNode, config, tinymce.EditorManager);

         // Allow back the "embed" tag as TinyMCE now removes it - this is allowed by our this.editors
         // if the HTML stripping is disabled via the "allowUnfilteredHTML" config attribute
         var extValidElements = config.extended_valid_elements;
         extValidElements = (extValidElements && extValidElements + ",") || "";
         config.extended_valid_elements = extValidElements + "embed[src|type|width|height|flashvars|wmode]";
         this.editor.render();
         this.editor.save();
         return this;
      },

      /**
       * Starts as false and gets set to true on the [editorInitialized]{@link module:alfresco/editors/TinyMCE#editorInitialized}
       * callback that is bound to the TinyMCE editors "init_instance_callback" configuration options.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      _editorInitialized: false,

      /**
       * A scope for calling the [contentChangeHandler]{@link module:alfresco/editors/TinyMCE#contentChangeHandler}
       * against.
       *
       * @instance
       * @type {object}
       * @default null
       */
      contentChangeScope: null,

      /**
       * A function that should be called whenever the content of the editor changes. The function will be bound to the
       * supplied [contentChangeScope]{@link module:alfresco/editors/TinyMCE#contentChangeScope}.
       *
       * @instance
       * @type {object}
       * @default null
       */
      contentChangeHandler: null,

      /**
       * This is bound to the TinyMCE editors "init_instance_callback" configuration option. This then sets up the
       * various events required to manage the editor.
       *
       * @instance
       * @param {object} editor The initialized editor.
       */
      editorInitialized: function alfresco_editors_TinyMCE__editorInitialized(editor) {
         this.alfLog("log", "TinyMCE Editor intialized!", editor);
         if (this.contentChangeScope && this.contentChangeHandler) {
            editor.on("change", lang.hitch(this.contentChangeScope, this.contentChangeHandler));
         }
         editor.setContent(this.initialContent);
         this._editorInitialized = true;
         this.setDisabled(this.initiallyDisabled);
      },

      /**
       * Indicates whether or not the editor should be initially disabled
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      initiallyDisabled: false,

      /**
       * This function has been added to support the use of this widget within the [TinyMCE form control]
       * {@link module:alfresco/forms/controls/TinyMCE} so that it can be disabled as necessary during
       * form state changes.
       *
       * @instance
       * @param {boolean} isDisabled Indicates whether or not to move the editor into disabled mode
       */
      setDisabled: function alfresco_editors_TinyMCE__disable(isDisabled) {
         if (this._editorInitialized) {
            this.editor.getBody()
               .setAttribute("contenteditable", !isDisabled);
         } else {
            this.initiallyDisabled = isDisabled;
         }
      },

      /**
       * This function has been added to support the use of this widget within the [TinyMCE form control]
       * {@link module:alfresco/forms/controls/TinyMCE} so that the content can be easily retrieved.
       *
       * @instance
       * @param {boolean} isDisabled Indicates whether or not to move the editor into disabled mode
       */
      getValue: function alfresco_editors_TinyMCE__getValue() {
         if (this._editorInitialized) {
            return this.editor.getContent();
         } else {
            return "";
         }
      },

      /**
       * This function has been added to support the use of this widget within the [TinyMCE form control]
       * {@link module:alfresco/forms/controls/TinyMCE} so that the content can be easily retrieved.
       *
       * @instance
       * @param {boolean} isDisabled Indicates whether or not to move the editor into disabled mode
       */
      setValue: function alfresco_editors_TinyMCE__setContent(html) {
         if (this._editorInitialized) {
            this.editor.setContent(html);
         } else {
            this.initialContent = html;
         }
      }
   });
});