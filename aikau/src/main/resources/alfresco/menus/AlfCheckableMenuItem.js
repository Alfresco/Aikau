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
 * @module alfresco/menus/AlfCheckableMenuItem
 * @extends module:alfresco/menus/AlfMenuItem
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuItem",
        "dojo/_base/lang",
        "dojo/_base/event",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/hash",
        "dojo/io-query"],
        function(declare, AlfMenuItem, lang, event, domConstruct, domClass, domStyle, hash, ioQuery) {

   return declare([AlfMenuItem], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfCheckableMenuItem.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfCheckableMenuItem.css"}],

      /**
       * A reference to the cell that will be created by postCreate to handle toggling selection
       * @instance
       * @type {object}
       * @default null
       */
      checkCell: null,

      /**
       * Indicates whether or not the menu item is selected or not
       * @instance
       * @type {boolean}
       * @default false
       */
      checked: false,

      /**
       * The class to apply to render some checked indicator
       * @instance
       * @type {string}
       * @default "alf-selected-icon"
       */
      checkedIconClass: "alf-selected-icon",

      /**
       * If this is set then it indicates that this item is a member of a group. When in a group this cannot be unselected. Unselection
       * will only occur when another item in the group is selected. Setting this attribute to anything other than null makes this
       * item behave as though it were a member of a radio button group.
       *
       * @instance
       * @type {string}
       * @default null
       */
      group: null,

      /**
       * The payload that will be published when the item is selected
       *
       * @instance
       * @type {object}
       * @default null
       */
      publishPayload: null,

      /**
       * A handle to the publication topic. This is set initially in post create and then removed
       * just before publishing to prevent a widget handling its own generated event
       *
       * @instance
       * @type {object}
       * @default null
       */
      subscriptionHandle: null,

      /**
       * If this instance should be set according to a hash fragment value then this attribute should be
       * set to the name of the fragment parameter to use. If the hash fragment parameter exists and its
       * value matches the current value then this will automatically be checked.
       *
       * @instance
       * @type {string}
       * @default null
       */
      hashName: null,

      /**
       * @instance
       */
      postCreate: function alfresco_menus_AlfCheckableMenuItem__postCreate() {

         if (!this.publishPayload)
         {
            this.publishPayload = {};
         }

         if (this.hashName)
         {
            var currHash = ioQuery.queryToObject(hash());
            this.checked = currHash[this.hashName] && currHash[this.hashName] === this.value;
         }

         this.alfLog("log", "Create checkable cell");
         this.checkCell = domConstruct.create("td", { className: "alf-checkable-menu-item", innerHTML: "&nbsp;"}, this.focusNode, "first");
         if (this.checked)
         {
            domClass.add(this.checkCell, this.checkedIconClass);
         }

         if (this.group)
         {
            this.alfSubscribe("ALF_CHECKABLE_MENU_ITEM__" + this.group, lang.hitch(this, this.onGroupSelection));
         }

         this.inherited(arguments);

         if (this.checked)
         {
            this.publishSelection();
         }

         // If a publish topic has been provided then we also want to subscribe to that topic to ensure that
         // we can reflect changes that are made outside of this widget (e.g. if the selection is updated by
         // some other widget).
         if (this.publishTopic)
         {
            this.subscriptionHandle = this.alfSubscribe(this.publishTopic, lang.hitch(this, this.onPublishTopicEvent));
         }
      },

      /**
       * Handles the events published on the publish topic. This allows the widget to update itself based on
       * events generated by other widgets.
       *
       * @instance
       * @param {object} payload The payload published on the subscribed topic
       */
      onPublishTopicEvent: function alfresco_menus_AlfCheckableMenuItem__onPublishTopicEvent(payload) {
         if (payload &&
             payload.selected !== null &&
             payload.value === this.value)
         {
            if (this.group)
            {
               // Clear all group settings if the payload value matches the value represented by the
               // widget. We need to ensure that only one item in the group is selected...
               this.alfPublish("ALF_CHECKABLE_MENU_ITEM__" + this.group, {
                  value: this.value
               });
               this.checked = payload.selected;
            }
            else
            {
               this.checked = payload.selected;
            }
            this.render();
         }
      },

      /**
       * Overrides the default value provided by the _AlfMenuItemMixin
       * @instance
       * @type {boolean}
       * @default true
       */
      closeOnClick: true,

      /**
       * @instance
       * @param {object} evt The click event
       */
      onClick: function alfresco_menus_AlfCheckableMenuItem__onClick(evt) {
         // Emit the event to close popups in the stack...
         this.emitClosePopupEvent();
         this.toggleSelection(evt);
      },

      /**
       * @instance
       * @param {object} evt The click event that resulted in the toggle
       */
      toggleSelection: function alfresco_menus_AlfCheckableMenuItem__toggleSelection(evt) {
         this.alfLog("log", "Toggle selection");
         event.stop(evt);

         if (this.group)
         {
            // If this is the member of a group we need to handle things a bit differently...
            if (!this.checked)
            {
               // If this is currently NOT checked, then allow selection to occur but publish
               // an event to indicate that all other members of the group must be deselected
               this.alfPublish("ALF_CHECKABLE_MENU_ITEM__" + this.group, {});
               this.checked = true;
               this.render();
               this.publishSelection();
            }
         }
         else
         {
            // Perform the toggle...
            this.checked = !this.checked;
            this.render();
            this.publishSelection();
         }

         // Clicking on the check cell will result in the menu item being marked as selected
         // but we want to ensure that this is not the case so always remove the class that
         // indicates selection...
         domClass.remove(this.checkCell.parentNode, "dijitMenuItemSelected");
      },

      /**
       * Renders the menu item appropriately according to the current checked value. By default
       * this simply adds or removes the 'checkedIconClass' from the checkCell appropriately
       *
       * @instance
       */
      render: function alfresco_menus_AlfCheckableMenuItem__render() {
         if (this.checked)
         {
            domClass.add(this.checkCell, this.checkedIconClass);
         }
         else
         {
            domClass.remove(this.checkCell, this.checkedIconClass);
         }
      },

      /**
       * Handles publishing the selection event.
       *
       * @instance
       */
      publishSelection: function alfresco_menus_AlfCheckableMenuItem_publishSelection() {
         this.alfLog("log", "Publishing selection", this.publishTopic, this.value, this.checked);
         if (this.publishTopic)
         {
            // Perform publish...
            this.publishPayload.selected = this.checked;
            this.publishPayload.value = this.value;
            this.publishPayload.label = this.label;
            this.alfPublish(this.publishTopic, this.publishPayload);
         }
      },

      /**
       * This function is called when a topic is published indicating that another member of the group
       * has been selected. The payload is irrelevant, the menu item should be marked as deslected.
       * @instance
       * @param {object} payload
       */
      onGroupSelection: function alfresco_menus_AlfCheckableMenuItem__toggleSelection(payload) {
         if (payload.value !== this.value)
         {
            this.checked = false;
            this.render();
         } 
      }
   });
});