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
 * @module alfresco/renderers/Selector
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/text!./templates/Selector.html",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/_base/event"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _AlfDocumentListTopicMixin, template, 
                 AlfCore, lang, domClass, Event) {

   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _AlfDocumentListTopicMixin, AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Selector.css"}]
       */
      cssRequirements: [{cssFile:"./css/Selector.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Selector__postMixInProperties() {
         this.intialClass = "unchecked";
         
         // Set up a subscription to handle file selection events, these will be along the lines of
         // select all, select none, invert, etc. Each individual selector will respond to these
         // events...
         this.alfSubscribe(this.documentSelectionTopic, lang.hitch(this, "onFileSelection"), this.publishGlobal, this.publishToParent);
      },
      
      /**
       * Handles selection request events for the following values: "selectAll", "selectNone",
       * "selectInvert", "selectFolders" & "selectDocuments". All other selection requests are
       * ignored.
       * 
       * @instance
       * @param {object} payload The details of the selection request.
       */
      onFileSelection: function alfresco_renderers_Selector__onFileSelection(payload) {
         if (payload)
         {
            if (payload.value === "selectAll")
            {
               // Select regardless of current status...
               this.select();
            }
            else if (payload.value === "selectNone")
            {
               // De-select regardless of current status...
               this.deselect();
            }
            else if (payload.value === "selectInvert")
            {
               // Invert the current status
               this.onClick();
            }
            else if (payload.value === "selectFolders" && this.currentItem && this.currentItem.jsNode)
            {
               // Select if the current item is a container
               if (this.currentItem.jsNode.isContainer)
               {
                  this.select();
               }
               else
               {
                  this.deselect();
               }
            }
            else if (payload.value === "selectDocuments" && this.currentItem && this.currentItem.jsNode)
            {
               // Select if the current item is NOT a container
               if (this.currentItem.jsNode.isContainer)
               {
                  this.deselect();
               }
               else
               {
                  this.select();
               }
            }
         }
      },
      
      /**
       * Publishes on the "documentSelectedTopic" attribute to with the details of the current item.
       * 
       * @instance
       */
      select: function alfresco_renderers_Selector__select() {
         domClass.add(this.selectorNode, "checked");
         domClass.remove(this.selectorNode, "unchecked");
         this.alfPublish(this.documentSelectedTopic, {
            value: this.currentItem
         }, this.publishGlobal, this.publishToParent);
      },
      
      /**
       * Publishes on the "documentDeselectedTopic" attribute to with the details of the current item.
       * 
       * @instance
       */
      deselect: function alfresco_renderers_Selector__deselect() {
         domClass.remove(this.selectorNode, "checked");
         domClass.add(this.selectorNode, "unchecked");
         this.alfPublish(this.documentDeselectedTopic, {
            value: this.currentItem
         }, this.publishGlobal, this.publishToParent);
      },
      
      /**
       * Toggle between the on and off states
       * 
       * @instance
       */
      onClick: function alfresco_renderers_Selector__onClick(evt) {
         evt && Event.stop(evt);
         if (domClass.contains(this.selectorNode, "checked"))
         {
            // De-select if currently selected...
            this.deselect();
         }
         else
         {
            // Select if currently not selected...
            this.select();
         }
      }
   });
});