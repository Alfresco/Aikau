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

/**
 * <p>This module was extracted from the PdfJs previewer plugin that was originally a Share Extras
 * (http://share-extras.github.io/) project and later integrated into Alfresco Share 5.0. It was 
 * created exclusively to support the [Aikau PdfJs module]{@link module:alfresco/preview/PdfJs/PdfJs}.</p>
 * <p>This module is responsible for retrieving and rendering an outline of the previewed PDF document.</p>
 * @module alfresco/preview/PdfJs/Outline
 * @author Dave Draper
 * @author Will Abson
 * @auther Peter Löfgren
 * @author Kevin Roast
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/on"], 
        function(declare, _WidgetBase, AlfCore, lang, domConstruct, domClass, on) {
   
   return declare([_WidgetBase, AlfCore], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Outline.css"}]
       */
      cssRequirements: [{cssFile:"./css/Outline.css"}],

      /**
       * If a [PDF Plugin]{@link module:alfresco/preview/PdfJs/PdfJs} has been provided then this
       * function will request an outline for it and call [renderOutline]
       * {@link module:alfresco/preview/PdfJs/Outline#renderOutline} when it is provided.
       * 
       * @instance
       */
      postCreate: function alfresco_preview_PdfJs_Outline__postCreate() {
         domClass.add(this.domNode, "alfresco-preview-PdfJs-Outline");
         if (this.pdfJsPlugin != null && this.pdfJsPlugin.pdfDocument != null)
         {
            var pdfDocument = this.pdfJsPlugin.pdfDocument;
            pdfDocument.getOutline().then(lang.hitch(this, this.renderOutline));
         }
         else
         {
            this.renderNoOutline();
         }
      },

      /**
       * Renders the outline of the PDF.
       *
       * @instance
       * @param {object} outline The outline to render.
       */
      renderOutline: function alfresco_preview_PdfJs_Outline__renderOutline(outline) {
         if (outline && outline.length > 0)
         {
            var queue = [{parent: this.domNode, items: outline}];
            while (queue.length > 0)
            {
               var levelData = queue.shift();
               var i, n = levelData.items.length;
               for (i = 0; i < n; i++)
               {
                  var item = levelData.items[i];
                  var div = document.createElement('div');
                  div.className = 'outlineItem';
                  var a = domConstruct.create("a", {
                     href: "#",
                     innerHTML: item.title
                  });
                  on(a, "click", lang.hitch(this, this.onOutlineClick, item.dest));
                  div.appendChild(a);

                  if (item.items.length > 0) {
                     var itemsDiv = document.createElement('div');
                     itemsDiv.className = 'outlineItems';
                     div.appendChild(itemsDiv);
                     queue.push({parent: itemsDiv, items: item.items});
                  }

                  levelData.parent.appendChild(div);
               }
            }
         }
         else
         {
            this.renderNoOutline();
         }
      },

      /**
       * Handles click events on any element within the outline.
       *
       * @instance
       * @param {object} dest The destination to navigate to within the PDF
       */
      onOutlineClick: function alfresco_preview_PdfJs_Outline__onOutlineClick(dest, evt) {
         this.pdfJsPlugin._navigateTo(dest);
      },

      /**
       * Renders a message indicating that no outline is available.
       *
       * @instance
       * @param {object} dest The destination to navigate to within the PDF
       */
      renderNoOutline: function alfresco_preview_PdfJs_Outline__renderNoOutline() {
         this.domNode.innerHTML = "<p>" + this.message("msg.noOutline") + "</p>";
      }
   });
});