/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 *
 * @module aikauTesting/widgets/DragAndDropUploadTester
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/layout/HeightMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 * @since 1.0.51
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "alfresco/core/Core",
        "alfresco/documentlibrary/AlfDocumentList",
        "dojo/text!./templates/DragAndDropUploadTester.html",
        "dojo/_base/lang"], 
        function(declare, _WidgetBase, _TemplatedMixin, AlfCore, AlfDocumentList, template, lang) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Call setHeight to set the height
       * @instance
       */
      postCreate: function aikauTesting_widgets_DragAndDropUploadTester__postCreate() {
         
         var doclist = new AlfDocumentList({
            widgets: [
               {
                  assignTo: "view",
                  name: "alfresco/documentlibrary/views/AlfSimpleView"
               }
            ]
         });
         doclist.placeAt(this.domNode);

         this.alfSubscribe("SIM_FILE_DROP", lang.hitch(this, function() {
            doclist.view.onDndUploadDrop({ 
               dataTransfer: {
                  files: ["test"]
               }
            });
         }));
      }
   });
});