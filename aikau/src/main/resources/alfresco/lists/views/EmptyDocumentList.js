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
 * This widget serves to display information and functionality relevant for displaying in an empty document list.
 *
 * @module alfresco/lists/views/EmptyDocumentList
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Martin Doyle
 * @since 1.0.67
 */
define(["alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetBase",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/text!./templates/EmptyDocumentList.html"],
        function(AlfCore, CoreWidgetProcessing, _TemplatedMixin, _WidgetBase, declare, lang, template) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {Object[]}
       * @default [{i18nFile: "./i18n/EmptyDocumentList.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/EmptyDocumentList.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance cssRequirements {Array}
       * @type {Object[]}
       * @default [{cssFile:"./css/EmptyDocumentList.css"}]
       */
      cssRequirements: [{cssFile:"./css/EmptyDocumentList.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The root class for this widget.
       *
       * @instance
       * @type {String}
       * @default
       */
      baseClass: "alfresco-lists-views-EmptyDocumentList",

      /**
       * Whether the current user can upload
       *
       * @instance
       * @type {Boolean}
       * @default
       */
      canUpload: false,

      /**
       * The message to display underneath the upload icon.
       *
       * @instance
       * @type {String}
       * @default
       */
      dropToUploadMessage: "drop-to-upload.message",

      /**
       * The message to display when there is no content, but user cannot upload
       *
       * @instance
       * @type {String}
       * @default
       */
      noContentMessage: "no-content.message",

      /**
       * Define the widget that will display the SVG no-content image.
       *
       * @instance
       * @type {Object[]}
       */
      widgetsForNoContentIcon: [
         {
            name: "alfresco/html/SVGImage",
            config: {
               source: "alfresco/html/svg/forbidden.svg",
               symbolId: "forbidden",
               height: 100,
               width: 100,
               useClass: "no-content-icon"
            }
         }
      ],

      /**
       * Define the widget that will display the SVG upload image.
       *
       * @instance
       * @type {Object[]}
       */
      widgetsForUploadIcon: [
         {
            name: "alfresco/html/SVGImage",
            config: {
               source: "alfresco/html/svg/upload.svg",
               symbolId: "upload",
               height: 100,
               width: 100,
               useClass: "upload-icon"
            }
         }
      ],

      /**
       * Run after widget has been created.
       *
       * @instance
       * @override
       */
      postCreate: function alfresco_lists_views_EmptyDocumentList__postCreate() {

         // Call parent
         this.inherited(arguments);

         // Update the text
         this.messageNode.textContent = this.message(this.canUpload ? this.dropToUploadMessage : this.noContentMessage);

         // Process and add the icon widget
         var iconWidgets = lang.clone(this.canUpload ? this.widgetsForUploadIcon : this.widgetsForNoContentIcon);
         this.processWidgets(iconWidgets, this.svgNode);
      }
   });
});