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
 * Extends the [inline editable property renderer]{@link module:alfresco/renderers/InlineEditProperty} to make
 * it possible to act as a link.
 * 
 * @module alfresco/renderers/InlineEditPropertyLink
 * @extends module:alfresco/renderers/InlineEditProperty
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/InlineEditProperty",
        "alfresco/renderers/_ItemLinkMixin",
        "dijit/a11yclick",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/_base/event"],
        function(declare, InlineEditProperty, _ItemLinkMixin, a11yclick, lang, on, event) {

   return declare([InlineEditProperty, _ItemLinkMixin], {
      
      /**
       * Whether the widget should be put into edit mode when rendered value is clicked.
       *
       * @override
       * @type  {boolean}
       */
      editOnClickRenderedValue: false,

     /**
       * Extends the [inherited function]{@link module:alfresco/renderers/Property#postCreate} to add the linking
       * capability.
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_InlineEditPropertyLink__postCreate() {
         this.inherited(arguments);
         this.own(on(this.renderedValueNode, a11yclick, lang.hitch(this, this.onLinkClick)));
      },

      /**
       * Handles the link click. The link click is is configured by the usual publication configuration attributes
       * but these are all prefixed by "link" (e.g. "publishTopic" becomes "linkPublishTopic", "publishPayload" becomes
       * "linkPublishPayload", etc.) in order to distinguish between editing publications inherited from the 
       * [InlineEditProperty]{@link module:alfresco/renderers/InlineEditProperty} and linking publications.
       *
       * @instance
       * @param {object} evt The click event.
       */
      onLinkClick: function alfresco_renderers_InlineEditPropertyLink__onLinkClick(evt) {
         evt && event.stop(evt);
         if (this.linkPublishTopic && lang.trim(this.linkPublishTopic))
         {
            var publishGlobal = this.linkPublishGlobal || false,
               publishToParent = this.linkPublishToParent || false,
               publishPayload = this.generatePayload(this.linkPublishPayload,
                                                      this.currentItem,
                                                      null, 
                                                      this.linkPublishPayloadType, 
                                                      this.linkPublishPayloadItemMixin, 
                                                      this.linkPublishPayloadModifiers);
            this.alfPublish(this.linkPublishTopic, publishPayload, publishGlobal, publishToParent);
         }
         else
         {
            // If no topic has been provided then assume this to be a standard document/folder link...
            this.linkPublishPayload = {};
            var publishTopic = this.generateFileFolderLink(this.linkPublishPayload);
            this.alfPublish(publishTopic, this.linkPublishPayload, true);
         }
      }
   });
});