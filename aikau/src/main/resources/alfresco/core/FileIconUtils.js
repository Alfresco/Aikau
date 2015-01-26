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
 * This module provides utility functions that can be used to construct file names for icons
 * based on file names, type or parent types. The code was ported from:
 * https://svn.alfresco.com/repos/alfresco-open-mirror/alfresco/HEAD/root/projects/web-framework-commons/source/web/js/alfresco.js
 * 
 * 
 * @module alfresco/core/FileIconUtils
 * @author Dave Draper
 */
define(["dojo/_base/lang",
        "alfresco/core/ObjectTypeUtils"], 
        function(lang, ObjectTypeUtils) {
   
   return {

      /**
       * Given a filename, returns either a filetype icon or generic icon file stem
       *
       * @instance
       * @param {string} p_fileName File to find icon for
       * @param {string} p_fileType Optional: Filetype to offer further hinting
       * @param {int} p_iconSize Icon size: 32
       * @return {string} The icon name, e.g. doc-file-32.png
       */
      getFileIcon: function alfresco_core_FileIconUtils(p_fileName, p_fileType, p_iconSize, p_fileParentType) {
         // Mapping from extn to icon name for cm:content
         var extns =
         {
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
         };

         var prefix = "generic",
               fileType = typeof p_fileType === "string" ? p_fileType : "cm:content",
               fileParentType = typeof p_fileParentType === "string" ? p_fileParentType : null,
               iconSize = typeof p_iconSize === "number" ? p_iconSize : 32;

         // If type = cm:content, then use extn look-up
         var type = this.fileIconTypes[fileType];
         if (type === "file")
         {
            var extn = p_fileName.substring(p_fileName.lastIndexOf(".") + 1).toLowerCase();
            if (extn in extns)
            {
               prefix = extns[extn];
            }
         }
         else if (typeof type == "undefined")
         {
            if (fileParentType !== null)
            {
               type = this.fileIconTypes[fileParentType];
               if (typeof type == "undefined")
               {
                  type = "file";
               }
            }
            else
            {
               type = "file";
            }
         }
         return prefix + "-" + type + "-" + iconSize + ".png";
      },

      /**
       * Retrieves an icon file name based on the supplied MIME type.
       *
       * @instance
       * @param {string} mimetype The MIME type to match to an extension
       * @param {number} p_iconSize The size of the icon required (in pixels)
       */
      getFileIconByMimetype: function alfresco_core_FileIconUtils(mimetype, p_iconSize) {
         var extns = 
         {
            "text/css": "css",
            "application/vnd.ms-excel": "xls",
            "image/tiff": "tiff",
            "audio/x-aiff": "aiff",
            "application/vnd.ms-powerpoint": "ppt",
            "application/illustrator": "ai",
            "image/gif": "gif",
            "audio/mpeg": "mp3",
            "message/rfc822": "eml",
            "application/vnd.oasis.opendocument.graphics": "odg",
            "application/x-indesign": "indd",
            "application/rtf": "rtf",
            "audio/x-wav": "wav",
            "application/x-fla": "fla",
            "video/x-ms-wmv": "wmv",
            "application/msword": "doc",
            "video/x-msvideo": "avi",
            "video/mpeg2": "mpeg2",
            "video/x-flv": "flv",
            "application/x-shockwave-flash": "swf",
            "audio/vnd.adobe.soundbooth": "asnd",
            "image/svg+xml": "svg",
            "application/vnd.apple.pages": "pages",
            "text/plain": "txt",
            "video/quicktime": "mov",
            "image/bmp": "bmp",
            "video/x-m4v": "m4v",
            "application/pdf": "pdf",
            "application/vnd.adobe.aftereffects.project": "aep",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
            "text/xml": "xml",
            "application/zip": "zip",
            "video/webm": "webm",
            "image/png": "png",
            "text/html": "html",
            "image/vnd.adobe.photoshop": "psd",
            "video/ogg": "ogv",
            "image/jpeg": "jpg",
            "application/x-zip": "fxp",
            "video/mp4": "mp4",
            "image/x-xbitmap": "xbm",
            "video/x-rad-screenplay": "avx",
            "video/x-sgi-movie": "movie",
            "audio/x-ms-wma": "wma",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
            "application/vnd.oasis.opendocument.presentation": "odp",
            "video/x-ms-asf": "asf",
            "application/vnd.oasis.opendocument.spreadsheet": "ods",
            "application/vnd.oasis.opendocument.text": "odt",
            "application/vnd.apple.keynote": "key",
            "image/vnd.adobe.premiere": "ppj",
            "application/vnd.apple.numbers": "numbers",
            "application/eps": "eps",
            "audio/basic": "au"
         };

         var prefix = "generic",
         iconSize = typeof p_iconSize === "number" ? p_iconSize : 32;
         if (mimetype in extns)
         {
            prefix = extns[mimetype];
         }
         
         return prefix + "-file-" + iconSize + ".png";
      },

      /**
       * A map of model type to icon type
       * 
       * @instance
       * @type {object}
       */
      fileIconTypes: {
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
       * Returns the extension from file url or path
       *
       * @instance
       * @param {string} filePath File path from which to extract file extension
       * @return {string} File extension or null
       */
      getFileExtension: function alfresco_core_FileIconUtils(filePath) {
         if (filePath != null)
         {
            var match = filePath.match(/^.*\.([^\.]*)$/);
            if (ObjectTypeUtils.isArray(match) && ObjectTypeUtils.isString(match[1]))
            {
               return match[1];
            }
         }
         return null;
      }
   };
});