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
 * <p>This mixin provides display filtering capabilities. It can be mixed into any widget so that
 * if the widget is configured with a [filterTopic]{@link module:alfresco/menus/AlfDisplayFilterMixin#filterTopic]
 * then it will used as a subscription topic and the [filter]{@link module:alfresco/menus/AlfDisplayFilterMixin#filter]
 * function will be called each time it is published on.</p>
 * 
 * @module alfresco/menus/_AlfDisplayFilterMixin
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 * @public
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(declare, AlfCore, lang, domClass) {
   
   return declare([AlfCore], {
      
      /**
       * This is the topic to which the widget will subscribe to receive notification of filter requests.
       * When the topic is published on the [filter function]{@link module:alfresco/menus/_AlfDisplayFilterMixin#filter}
       * will be called which by default does nothing. It is up to the inheriting module to override this
       * function to determine whether or not the widget is displayed or hidden.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      filterTopic: null,
      
      /**
       * Ensures that the supplied menu item label is translated.
       * @instance
       */
      postCreate: function alfresco_menus_AlfMenuItem__postCreate() {
         if (this.filterTopic != null)
         {
            this.alfSubscribe(this.filterTopic, lang.hitch(this, "filter"));
         }
         this.inherited(arguments);
      },
      
      /**
       * This does nothing by default and should be overridden by the inheriting module
       * to determine whether or not the widget should be displayed or hidden. The 
       * [show]{@link module:alfresco/menus/_AlfDisplayFilterMixin#show} and 
       * [hide]{@link module:alfresco/menus/_AlfDisplayFilterMixin#hide} functions should
       * be called to change the widgets display state.
       * 
       * @instance
       * @param {object} payload The payload published on the filter topic 
       */
      filter: function alfresco_menus_AlfFilteringMenuItem__filter(payload) {
         this.inherited(arguments);
      },
      
      /**
       * Hides the menu item.
       * @instance
       */
      hide: function alfresco_menus_AlfFilteringMenuItem__hide() {
         domClass.add(this.domNode, "hidden");
      },
      
      /**
       * Displays the menu item.
       * @instance
       */
      show: function alfresco_menus_AlfFilteringMenuItem__show() {
         domClass.remove(this.domNode, "hidden");
      }
   });
});