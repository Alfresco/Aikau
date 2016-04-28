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

/*globals tinymce*/
/**
 * This module can be used to create a TinyMCE editor it is primarily used by the 
 * [TinyMCE form control]{@link module:alfresco/forms/controls/TinyMCE} but can be used independently
 * if required. Without any additional configuration it will instantiate an editor using the Alfresco
 * preferred configuration, however this can be overridden by providing 
 * [specific configuration]{@link module:alfresco/forms/controls/TinyMCE#editorConfig} that will
 * augment or override the [default configuration]{@link module:alfresco/forms/controls/TinyMCE#defaultEditorConfig}.
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
        "alfresco/core/ResizeMixin",
        "alfresco/core/topics",
        "service/constants/Default", 
        "dojo/_base/lang",
        "jquery",
        "jqueryui"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, ResizeMixin, topics, AlfConstants, lang, $) {


   return declare([_WidgetBase, _TemplatedMixin, AlfCore, ResizeMixin], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/TinyMCE.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/TinyMCE.properties"}],

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
       * This indicates whether the size should be adjusted on resize events.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.47
       */
      autoResize: false,

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
       * A scope for calling the [contentChangeHandler]{@link module:alfresco/editors/TinyMCE#contentChangeHandler}
       * against.
       *
       * @instance
       * @type {object}
       * @default null
       */
      contentChangeScope: null,

      /**
       * Should be used to override the [defaultEditorConfig]{@link module:alfresco/editors/TinyMCE#defaultEditorConfig}
       *
       * @instance
       * @type {object}
       * @default null
       */
      editorConfig: null,

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
       * The content with which to intially populate the editor
       *
       * @instance
       * @type {string}
       * @default ""
       */
      intialContent: "",

      /**
       * Indicates whether or not the editor should be initially disabled
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      initiallyDisabled: false,

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
       * Starts as false and gets set to true on the [editorInitialized]{@link module:alfresco/editors/TinyMCE#editorInitialized}
       * callback that is bound to the TinyMCE editors "init_instance_callback" configuration options.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      _editorInitialized: false,

      /**
       * Indicates whether or not the TinyMCE editor should be focused once it has been initialized. This will
       * be set to true by the [focus]{@link module:alfresco/editors/TinyMCE#focus} function if it is called before
       * the editor has been [initialized]{@link module:alfresco/editors/TinyMCE#editorInitialized}.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.46
       */
      _focusWhenInitialized: false,

      /**
       * Indicates whether or not the TinyMCE editor should be resized once it has been initialized. This will
       * be set to true by the [focus]{@link module:alfresco/editors/TinyMCE#onResize} function if it is called before
       * the editor has been [initialized]{@link module:alfresco/editors/TinyMCE#editorInitialized}.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.47
       */
      _resizeWhenInitialized: false,

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
       *
       * @instance
       */
      postCreate: function alfresco_editors_TinyMCE__postCreate() {
         // Mix the custom editor config overrides into the default editor config...
         var config = lang.clone(this.defaultEditorConfig);

         if (this.autoResize)
         {
            config.width = "100%";
            config.autoresize_max_height = 1024;
            config.autoresize_min_height = 250;
            config.autoresize_on_init = true;
         }

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

         if (this.autoResize)
         {
            this.alfSetupResizeSubscriptions(this.onResize, this);
         }
      },

      /**
       * When [autoResize]{@link module:alfresco/editors/TinyMCE} is configured to true this will
       * respond to resize events by finding the first ancestor with height and width dimensions
       * and then increasing the size of the TinyMCE editor to fill the available space as best
       * it can.
       * 
       * @instance
       * @since 1.0.47
       */
      onResize: function alfresco_editors_TinyMCE__onResize() {
         if (this.autoResize)
         {
            if (this._editorInitialized)
            {
               // Work our way back up through the current node ancestors to find
               // the first ancestors that have height and width set on them. Height
               // and width do not need to come from the same node, but we only want
               // to take the first values we find of each (i.e. if we find a height but
               // not a width, don't take the height from the node that we DO find a width
               // on later)...
               var height, width;
               $(this.domNode).parents().each(function() {
                  // Check the style attribute returned by the JQuery function to see if
                  // height/width is set... then get the actual height/width of that
                  // element.
                  var style = $(this).attr("style");
                  if (!height && style && style.indexOf("height:") !== -1)
                  {
                     height = $(this).height();
                  }
                  if (!width && style && style.indexOf("width:") !== -1)
                  {
                     width = $(this).width();
                  }
                  // When both height and width have been set exit the loop...
                  if (height && width)
                  {
                     return false;
                  }
               });
               
               // Update the dimensions of the main node (so that the TinyMCE editor
               // can grow into it - the auto resize plugin will automatically take
               // care of the width)...
               $(this.domNode).height(height - 10); // Deduct 10 to compensate for margin

               // We need to handle the height manually, and it needs to be set on the
               // .mce-edit-area node. We need to compensate for the toolbar when 
               var editAreaNode = $(this.domNode).find(".mce-edit-area");
               $(editAreaNode).height(height - 42); // Deduct 42 to compenstate for toolbar and margin
               $(this.domNode).width(width - 2); // Deduct 2 to compensate for border
            }
            else
            {
               this._resizeWhenInitialized = true;
            }
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
               file: {
                  title: this.message("TinyMCE.toolbar.file.title"),
                  items: "newdocument | print"
               },
               edit: {
                  title: this.message("TinyMCE.toolbar.edit.title"),
                  items: "undo redo | cut copy paste pastetext | selectall | searchreplace"
               },
               insert: {
                  title: this.message("TinyMCE.toolbar.insert.title"),
                  items: "link image | charmap hr anchor pagebreak inserttime nonbreaking"
               },
               view: {
                  title: this.message("TinyMCE.toolbar.view.title"),
                  items: "fullscreen preview visualblocks code"
               },
               format: {
                  title: this.message("TinyMCE.toolbar.format.title"),
                  items: "bold italic underline strikethrough superscript subscript | formats | removeformat"
               },
               table: {
                  title: this.message("TinyMCE.toolbar.table.title"),
                  items: "inserttable tableprops deletetable | cell row column"
               }
            };
         }
         if (!config.plugins)
         {
            config.plugins = [
               "advlist autolink link image lists charmap print preview hr anchor pagebreak",
               "searchreplace code fullscreen insertdatetime nonbreaking",
               "table contextmenu paste textcolor visualblocks autoresize"
            ];
         }
         if (config.additionalPlugins)
         {
            config.plugins = config.plugins.concat(config.additionalPlugins);
         }
         
         config.init_instance_callback = lang.hitch(this, this.editorInitialized);

         this.updateEditorConfig(config);
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
       * This is an extension point function that provides the opportunity for extending widgets to 
       * make updates to the default configuration. This allows non-configurable options to be added
       * to the configuration such as specific callback overrides for configuration plugins.
       * 
       * @instance
       * @param {object} config The configuration object to be updated
       * @since 1.0.66
       * @overridable
       */
      updateEditorConfig: function alfresco_editors_TinyMCE__createEditor(/* jshint unused:false*/ config) {
         // No action by default
      },

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

         if (this._focusWhenInitialized)
         {
            this.focus();
         }
         if (this._resizeWhenInitialized)
         {
            // See AKU-775 - adding a short timeout here allows everything to complete initialization before resizing.
            setTimeout(lang.hitch(this, this.onResize), 100);
         }
         this.setDisabled(this.initiallyDisabled);

      },

      /**
       * Give focus to the TinyMCE editor
       * 
       * @instance
       * @since 1.0.46
       * @fires module:alfresco/core/topics#TINYMCE_EDITOR_FOCUSED
       */
      focus: function alfresco_editors_TinyMCE__focus() {
         if (this._editorInitialized)
         {
            this.editor.focus();
            this.alfPublish(topics.TINYMCE_EDITOR_FOCUSED);
         }
         else
         {
            this._focusWhenInitialized = true;
         }
      },

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