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
 * This mixin provides display filtering capabilities. It can be mixed into any widget so that
 * if the widget is configured with a [filterTopic]{@link modulealfresco/menus/AlfDisplayFilterMixin#filterTopic]
 * then it will used as a subscription topic and the [filter]{@link modulealfresco/menus/AlfDisplayFilterMixin#filter]
 * function will be called each time it is published on.
 * 
 * @module alfresco/documentlibrary/views/_AlfAdditionalViewControlMixin
 * @extends module:alfresco/menus/AlfDisplayFilterMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/_AlfDisplayFilterMixin",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(declare, AlfDisplayFilterMixin, _AlfDocumentListTopicMixin, lang, domClass) {
   
   return declare([AlfDisplayFilterMixin, _AlfDocumentListTopicMixin], {
      
      /**
       * This should be set to the name of the [view]{@link module:alfresco/documentlibrary/views/AlfDocumentListView} that
       * the control is associated with. This is used as a comparison in the [filter]{@link module:alfresco/documentlibrary/views/_AlfAdditionalViewControlMixin#filter}
       * function.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      relatedViewName: null,
      
      /**
       * Sets the [filterTopic]{@link module:alfresco/menus/AlfDisplayFilterMixin#filterTopic} attribute to be
       * the [viewSelectionTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#viewSelectionTopic}
       * so that when a view is changed the [filter]{@link module:alfresco/documentlibrary/views/_AlfAdditionalViewControlMixin#filter}
       * function is called.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_documentlibrary_views__AlfAdditionalViewControlMixin__postMixInProperties() {
         this.filterTopic = this.viewSelectionTopic;
         this.inherited(arguments);
      },
      
      /**
       * Overrides the [superclass implmentation]{@link module:alfresco/menus/AlfDisplayFilterMixin#filter} to check
       * the published view against the configured view to determine whether or not to display the control.
       * 
       * @instance
       * @param {object} payload The payload published on the filter topic 
       */
      filter: function alfresco_documentlibrary_views__AlfAdditionalViewControlMixin__filter(payload) {
         if (this.relatedViewName == null)
         {
            this.alfLog("warn", "Unable to filter additional view control due to the 'relatedViewName' not being configured", this);
         }
         else if (lang.exists("value", payload))
         {
            if (lang.getObject("value", false, payload) == this.relatedViewName)
            {
               this.show();
               this.onControlDisplayed();
            }
            else
            {
               this.hide();
            }
         }
         else
         {
            this.alfLog("warn", "Unable to filter additional view control due to missing 'value' attribute", this, payload);
         }
      },
      
      /**
       * This is called each time the [view]{@link module:alfresco/documentlibrary/views/AlfDocumentListView} that the 
       * control is assigned to is selected. By default it does nothing and needs to be overridden as necessary by the
       * widget that mixes this class in.
       *  
       * @instance 
       */
      onControlDisplayed: function alfresco_documentlibrary_views__AlfAdditionalViewControlMixin__onControlDisplayed() {
         this.inherited(arguments);
      }
   });
});