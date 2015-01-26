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
 * <p>This module wraps the legacy Share web-previewer PdfJs plugin. It is a plug-in for the
 * Aikau [AlfDocumentPreview]{@link module:alfresco/preview/AlfDocumentPreview} and provides
 * the ability to preview documents that have been transformed into PDF files.</p>
 * <p>This implementation relies on mixing in the PdfJs object prototype into the declared
 * class which is far from ideal but will work until such a time that the Aikau version supercedes
 * the original web-previewer plugin</p>
 *
 * @module alfresco/preview/PdfJs
 * @extends module:alfresco/preview/AlfDocumentPreviewPlugin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/preview/AlfDocumentPreviewPlugin", 
        "dojo/_base/lang"], 
        function(declare, AlfDocumentPreviewPlugin, lang) {
   
   var AikauPdfJs = declare([AlfDocumentPreviewPlugin], {

      /**
       * Declares the dependencies on PdfJs dependencies.
       * 
       * @instance
       * @type {String[]}
       * @default ["/components/preview/PdfJs.js","/components/preview/pdfjs/compatibility.js","/components/preview/pdfjs/pdf.js","/components/preview/pdfjs/pdf.worker.js","/components/preview/spin.js"]
       */
      nonAmdDependencies: ["/js/yui-common.js",
                           "/js/alfresco.js",
                           "/components/preview/web-preview.js",
                           "/components/preview/PdfJs.js",
                           "/components/preview/pdfjs/compatibility.js",
                           "/components/preview/pdfjs/pdf.js",
                           "/components/preview/pdfjs/pdf.worker.js",
                           "/components/preview/spin.js",
                           "/yui/tabview/tabview.js"],

      /**
       * The PdfJs CSS file to include.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfDocumentPreview.css"}]
       */
      cssRequirements: [{cssFile:"/components/preview/PdfJs.css"}],

      /**
       *
       * @instance
       * @param {object[]} args
       */
      constructor: function alfresco_preview_PdfJs__constructor(args) {
         lang.mixin(args);

         this.pages = [];
         this.pageText = [];
         this.widgets = {};
         this.documentConfig = {};
         this.wp = args.previewManager;
         this.attributes = Alfresco.util.deepCopy(this.attributes);
      
         this.wp.options = {};
         this.wp.options.nodeRef = this.wp.nodeRef;
         this.wp.options.name = this.wp.name;
         this.wp.options.size = this.wp.size;
         this.wp.options.mimeType = this.wp.mimeType;
         this.wp.msg = this.wp.message;

         this.onPdfLoaded = new YAHOO.util.CustomEvent("pdfLoaded", this);
         this.onResize = new YAHOO.util.CustomEvent("resize", this);
      },

      /**
       * Calls the "onComponentsLoaded" function from the Pdf.js file prototype
       *
       * @instance
       */
      display: function alfresco_preview_PdfJs__display() {
         this.onComponentsLoaded();
      }
   });

   // This is where the prototype is mixined into the declared prototype. It relies on the 
   // nonAmd dependencies being available and pre-loaded into the page.
   var pt = lang.getObject("Alfresco.WebPreview.prototype.Plugins.PdfJs.prototype");
   if (pt != null)
   {
      lang.mixin(AikauPdfJs.prototype, pt);
   }
   return AikauPdfJs;
});