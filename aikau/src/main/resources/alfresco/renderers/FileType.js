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
 * This renders an image that represents the type of file that the assigned node represents.
 *
 * @module alfresco/renderers/FileType
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/renderers/_JsNodeMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "alfresco/renderers/_JsNodeMixin",
        "dojo/text!./templates/FileType.html",
        "alfresco/core/Core",
        "dojo/_base/lang"],
        function(declare, _WidgetBase, _TemplatedMixin, _JsNodeMixin, template, AlfCore, lang) {

   return declare([_WidgetBase, _TemplatedMixin, _JsNodeMixin, AlfCore], {

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * The size of the image. By default this will be "large" but can be set to "small" or "medium". The default widget has 3 image
       * sizes: 16px, 32px and 48px and changing the size will change the size of image that is used.
       *
       * @instance
       * @type {string}
       * @default "large"
       */
      size: "large",

      /**
       * The alt text for the file type image.
       *
       * @instance
       * @type {string}
       * @default ""
       */
      altText: "",

      /**
       * The URL to the image.
       * Available parameters to replace are {prefix} {type} and {size}
       *
       * @instance
       * @type {string}
       * @default require.toUrl("alfresco/renderers/css/images/filetypes/{prefix}-{type}-{size}.png")
       */
      imageUrl: "alfresco/renderers/css/images/filetypes/{prefix}-{type}-{size}.png",

      /**
       * Set up the attributes to be used when rendering the template.
       *
       * @instance
       */
      postMixInProperties: function alfresco_renderers_FileType__postMixInProperties() {
         // Mix the custom type mappings into the default type mappings
         var typeMappings = this.defaultTypeMappings;
         if (this.customTypeMappings != null)
         {
            lang.mixin(typeMappings, this.customTypeMappings);
         }

         // Mix the custom extension mappings into the default extension mappings...
         var extnMappings = this.defaultExtnMappings;
         if (this.customExtnMappings != null)
         {
            lang.mixin(extnMappings, this.customExtnMappings);
         }

         var imageUrl = lang.replace(this.imageUrl, {
            prefix: this.getImagePrefix(extnMappings),
            type: this.getImageType(typeMappings),
            size: this.getImageSize()
         });
         this.img = require.toUrl(imageUrl);
         this.alfText = this.message("fileType." + this.getExtension() + ".altText");
      },

      /**
       * This returns a String that represents the type of file that an image should be generated for.
       *
       * @instance
       * @returns {string} The string representing the type.
       */
      getImageType: function alfresco_renderers_FileType__getImageType(typeMappings) {
         var type = "file";
         var itemType = lang.getObject("node.type", false, this.currentItem);
         if (itemType != null && typeMappings[itemType] != null)
         {
            type = typeMappings[itemType];
         }
         return type;
      },

      /**
       * Gets the extension for the current item. It does this by looking for the last "." in the fileName.
       *
       * @instance
       * @returns {string} The extension for the current item
       */
      getExtension: function alfresco_renderers_FileType__getExtensions() {
         var extn = "";
         if (this.currentItem != null &&
             this.currentItem.fileName != null &&
             this.currentItem.fileName.lastIndexOf(".") != -1)
         {
            extn = this.currentItem.fileName.substring(this.currentItem.fileName.lastIndexOf(".") + 1).toLowerCase();
         }
         else
         {
            this.alfLog("warn", "The current item either is not defined, has no 'fileName' attribute or the 'fileName' attribute contains no '.' characters", this);
         }
         return extn;
      },

      /**
       * This returns a String that represents the prefix for the <img> element src based on the file name of the current item. For example if a filename ends
       * in ".jpg " then this is likely to return a prefix of "image".
       *
       * @instance
       * @returns {string} A string representation of the image prefix.
       */
      getImagePrefix: function alfresco_renderers_FileTYpe__getImagePrefix(extnMappings) {
         var prefix = "generic";
         var extn = this.getExtension();
         if (extn in extnMappings)
         {
            prefix = extnMappings[extn];
         }
         return prefix;
      },

      /**
       * Returns a String that represents the size of the image. This string will be including in the "src" attribute of the
       * <img> element used to display the file type. By default "large" maps to "48", "medium" to "32" and "small" to "16".
       *
       * @instance
       * @return {string} The string that represents the correct image size to use in the "src" attribute for the image.
       */
      getImageSize: function alfresco_renderers_FileType__getImageSize() {
         var size = "48";
         if (this.size == "large")
         {
            // Leave as default, no action required.
         }
         else if (this.size == "medium")
         {
            size = "32";
         }
         else if (this.size == "small")
         {
            size = "16"
         }
         return size;
      },

      /**
       *
       * @instance
       */
      postCreate: function alfresco_renderers_FileType__postCreate() {

      },

      /**
       *
       * @instance
       * @type {object}
       * @default null
       */
      customTypeMappings: null,

      /**
       * Default mappings from objects to types.
       *
       * @instance
       * @type {object}
       */
      defaultTypeMappings: {
         "{http://www.alfresco.org/model/content/1.0}cmobject": "file",
         "cm:cmobject": "file",
         "{http://www.alfresco.org/model/content/1.0}content": "file",
         "cm:content": "file",
         "{http://www.alfresco.org/model/content/1.0}thumbnail": "file",
         "cm:thumbnail": "file",
         "{http://www.alfresco.org/model/content/1.0}folder": "folder",
         "cm:folder": "folder",
         "{http://www.alfresco.org/model/content/1.0}category": "category",
         "cm:category": "category",
         "{http://www.alfresco.org/model/content/1.0}person": "user",
         "cm:person": "user",
         "{http://www.alfresco.org/model/content/1.0}authorityContainer": "group",
         "cm:authorityContainer": "group",
         "tag": "tag",
         "{http://www.alfresco.org/model/site/1.0}sites": "site",
         "st:sites": "site",
         "{http://www.alfresco.org/model/site/1.0}site": "site",
         "st:site": "site",
         "{http://www.alfresco.org/model/transfer/1.0}transferGroup": "server-group",
         "trx:transferGroup": "server-group",
         "{http://www.alfresco.org/model/transfer/1.0}transferTarget": "server",
         "trx:transferTarget": "server"
      },

      /**
       *
       * @instance
       * @type {object}
       * @default null
       */
      customExtnMappings: null,

      /**
       * The default mappings.
       *
       * @instance
       * @type {object}
       * @default
       */
      defaultExtnMappings: {
         "aep": "aep",
         "ai": "ai",
         "aiff": "aiff",
         "asf": "video",
         "asnd": "asnd",
         "asx": "video",
         "au": "audio",
         "avi": "video",
         "avx": "video",
         "bmp": "img",
         "css": "text",
         "divx": "video",
         "doc": "doc",
         "docx": "doc",
         "docm": "doc",
         "dotx": "doc",
         "dotm": "doc",
         "eml": "eml",
         "eps": "eps",
         "fla": "fla",
         "flv": "video",
         "fxp": "fxp",
         "gif": "img",
         "htm": "html",
         "html": "html",
         "indd": "indd",
         "jpeg": "img",
         "jpg": "img",
         "key": "key",
         "mkv": "video",
         "mov": "video",
         "movie": "video",
         "mp3": "mp3",
         "mp4": "video",
         "mpeg": "video",
         "mpeg2": "video",
         "mpv2": "video",
         "msg": "eml",
         "numbers": "numbers",
         "odg": "odg",
         "odp": "odp",
         "ods": "ods",
         "odt": "odt",
         "ogg": "video",
         "ogv": "video",
         "pages": "pages",
         "pdf": "pdf",
         "png": "img",
         "ppj": "ppj",
         "ppt": "ppt",
         "pptx": "ppt",
         "pptm": "ppt",
         "pps": "ppt",
         "ppsx": "ppt",
         "ppsm": "ppt",
         "pot": "ppt",
         "potx": "ppt",
         "potm": "ppt",
         "ppam": "ppt",
         "sldx": "ppt",
         "sldm": "ppt",
         "psd": "psd",
         "qt": "video",
         "rtf": "rtf",
         "snd": "audio",
         "spx": "audio",
         "svg": "img",
         "swf": "swf",
         "tif": "img",
         "tiff": "img",
         "txt": "text",
         "wav": "audio",
         "webm": "video",
         "wmv": "video",
         "xls": "xls",
         "xlsx": "xls",
         "xltx": "xls",
         "xlsm": "xls",
         "xltm": "xls",
         "xlam": "xls",
         "xlsb": "xls",
         "xml": "xml",
         "xvid": "video",
         "zip": "zip"
      }
   });
});