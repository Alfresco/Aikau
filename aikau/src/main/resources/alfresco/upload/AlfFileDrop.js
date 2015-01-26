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
 * This module is provided for test purposes. It creates a simple drag-and-drop file upload target.
 * PLEASE NOTE: The target node is hard-coded and will need to be updated for each development environment.
 *
 * @module alfresco/upload/AlfFileDrop
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfFileDrop.html",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/on"], 
        function(declare, _Widget, _Templated, template, Core, lang, on) {
   
   return declare([_Widget, _Templated, Core], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Logo.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfFileDrop.css"}],
         
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * This controls whether or not the image is rendered with the img element or the div in the template.
       * The default it to use the div because it is controlled via CSS which allows for finer control over the
       * dimensions of the displayed logo. When using the img element the dimensions will be those of the supplied
       * image. 
       * 
       * @instance
       */
      postCreate: function alfresco_upload_AlfFileDrop__postCreate() {
         on(this.domNode, "dragenter", lang.hitch(this, "onDndDragEnter"));
         on(this.domNode, "dragover", lang.hitch(this, "onDndDragOver"));
         on(this.domNode, "drop", lang.hitch(this, "onDndDrop"));
      },

      /**
       * @instance
       */
      onDndDragEnter: function alfresco_upload_AlfFileDrop__onDndDragEnter(evt) {
        
      },

      /**
       * @instance
       */
      onDndDragOver: function alfresco_upload_AlfFileDrop__onDndDragOver(evt) {
         evt.stopPropagation();
         evt.preventDefault();
      },

      /**
       * The nodeRef to upload to.
       *
       * @instance
       * @type {string}
       * @default null
       */
      destinationNodeRef: null,

      /**
       * @instance
       */
      onDndDrop: function alfresco_upload_AlfFileDrop__onDndDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        this.alfPublish("ALF_UPLOAD_REQUEST", {
           files: evt.dataTransfer.files,
           targetData: {
              destination: this.destinationNodeRef,
              siteId: null,
              containerId: null,
              uploadDirectory: null,
              updateNodeRef: null,
              description: "",
              overwrite: false,
              thumbnails: "doclib",
              username: null
           }
        });
      }
   });
});