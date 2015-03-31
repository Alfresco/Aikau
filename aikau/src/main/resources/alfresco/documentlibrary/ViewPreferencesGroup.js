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
 * 
 * 
 * @module alfresco/documentlibrary/ViewPreferencesGroup
 * @extends module:alfresco/menus/AlfMenuGroup
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuGroup",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/dom-style",
        "dojo/Deferred"], 
        function(declare, AlfMenuGroup, _AlfDocumentListTopicMixin, AlfConstants, lang, domStyle, Deferred) {
   
   return declare([AlfMenuGroup, _AlfDocumentListTopicMixin], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/ViewPreferencesGroup.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/ViewPreferencesGroup.properties"}],

      /**
       * The users preferred view.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      userPreferredView: null,

      /**
       * Indicates whether or not the current user is a site manager (only relevant when looking
       * at a Document Library within a site context). Assumed to be false unless configured otherwise.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      userIsSiteManager: false,

      /**
       * [label description]
       *
       * @instance
       * @type {string}
       * @default "documentlibrary.view.preference.group"
       */
      label: "documentlibrary.view.preference.group",

      /**
       * Extends the [inherited function]{@link module:alfresco/menus/AlfMenuGroup#postCreate} to 
       * setup subscriptions to the topics published as views and paths are changed within the 
       * [document list]{@link module:alfresco/documentlibrary/AlfDocumentList}.
       * 
       * @instance
       */
      postCreate: function alfresco_documentlibrary_ViewPreferencesGroup__postCreate() {
         this.inherited(arguments);
         this.alfSubscribe(this.metadataChangeTopic, lang.hitch(this, this.handleCurrentNodeChange));
         this.alfSubscribe(this.viewSelectionTopic, lang.hitch(this, this.onViewSelected));
      },

      /**
       *
       * @instance
       * @param {object} payload The details of the node that is now current.
       */
      handleCurrentNodeChange: function alfresco_documentlibrary_ViewPreferencesGroup__handleCurrentNodeRefChange(payload) {
         if (payload && payload.node && payload.node.parent)
         {
            this._currentNode = payload.node;
            this.updateViews();
            this.updateMenus();
         }
         else
         {
            // Hide the group if there is not parent node in the metadata.
            // This will typically occur when a filter has been used in the Document Library
            domStyle.set(this.domNode, "display", "none");
         }
      },

      /**
       * Publishes payload to update the currently selected view based on the default view of the 
       * current node and the preferred view of the user.
       *
       * @instance
       */
      updateViews: function alfresco_documentlibrary_ViewPreferencesGroup__updateViews() {
         var promise = new Deferred();
         var folderView = lang.getObject("parent.properties.app:defaultViewId", false, this._currentNode);
         if (folderView)
         {
            // Check to see if the folder view exists...
            promise.then(lang.hitch(this, this.onViewName, true));
            this.alfPublish("ALF_VIEW_NAME_REQUEST", {
               value: folderView,
               promise: promise
            });
         }
         else if (this.userPreferredView)
         {
            // Check to see if the user preferred view exists...
            promise.then(lang.hitch(this, this.onViewName, false));
            this.alfPublish("ALF_VIEW_NAME_REQUEST", {
               value: this.userPreferredView,
               promise: promise
            });
         }
      },

      /**
       * This function is called when a preferred view confirms it's existence by resolving a 
       * promimse provided. This then allows that view to be set.
       *
       * @instance
       * @param {boolean} updateMenuItem Indicates whether or not the menu item for removing the view should be updated
       * @param {object} view The view configuration
       */
      onViewName: function alfresco_documentlibrary_ViewPreferencesGroup__onViewName(updateMenuItem, view) {
         this.alfPublish(this.viewSelectionTopic, view);
         if (updateMenuItem)
         {
            // Set the name of the default view...
            this._removeDefaultMenuItem.set("label", this.message("documentlibrary.view.preference.remove", {
               0: view.label
            }));
         }
      },

      /**
       * Updates the menu items for setting and removing default views
       *
       * @instance
       */
      updateMenus: function alfresco_documentlibrary_ViewPreferencesGroup__updateMenus() {
         var folderView = lang.getObject("parent.properties.app:defaultViewId", false, this._currentNode);
         var folderCreator = lang.getObject("parent.properties.cm:creator", false, this._currentNode);
         var nodeRef = lang.getObject("parent.nodeRef", false, this._currentNode);
         if (this.userIsSiteManager || folderCreator === AlfConstants.USERNAME)
         {
            domStyle.set(this.domNode, "display", "block");

            // Update the option labels for current view...
            this._setDefaultMenuItem.set("label", this.message("documentlibrary.view.preference.add", {
               0: this.currentViewName
            }));

            // Update the payload of the set menu item so that it publishes the correct information when 
            // clicked...
            this._setDefaultMenuItem.publishPayload = {
               prop_app_defaultViewId: this.currentView,
               nodeRef: nodeRef
            }
               
            // If the user is either the site manager or the creator of the container...
            if (folderView)
            {
               // A default view has been set so the option to remove it is valid...
               if (folderView === this.currentView)
               {
                  // The current view is the default view so there is no need to show the set default view option...
                  domStyle.set(this._setDefaultMenuItem.domNode, "display", "none");
               }
               else
               {
                  // The current view is NOT the default view so we need to offer it as an option...
                  domStyle.set(this._setDefaultMenuItem.domNode, "display", "table-row");
               }

               // Allow the default view to be removed...
               domStyle.set(this._removeDefaultMenuItem.domNode, "display", "table-row");

               // Update the payload of the set menu item so that it publishes the correct information when 
               // clicked...
               this._removeDefaultMenuItem.publishPayload = {
                  prop_app_defaultViewId: "",
                  nodeRef: nodeRef
               }
            }
            else
            {
               // No default view has been set yet, so the set view as default option can be shown...
               domStyle.set(this._setDefaultMenuItem.domNode, "display", "table-row");

               // ...but the remove option can't be...
               domStyle.set(this._removeDefaultMenuItem.domNode, "display", "none");
            }
         }
         else
         {
            // If the user does not have write permissions then we want to hide both options...
            domStyle.set(this.domNode, "display", "none");
         }
      },

      /**
       * Used to keep track of the currently selected view.
       *
       * @instance
       * @param  {object} payload The payload object containing the details of the view selected
       */
      onViewSelected: function alfresco_documentlibrary_ViewPreferencesGroup__onViewSelected(payload) {
         if (payload && payload.value)
         {
            this.currentView = payload.value;
            this.currentViewName = payload.label || payload.value;
            this.updateMenus();
         }
      },

      /**
       * 
       * @instance
       * @type {array}
       */
      widgets: [
         {
            id: "SET_DEFAULT_DOCUMENT_LIST_VIEW",
            name: "alfresco/menus/AlfMenuItem",
            assignTo: "_setDefaultMenuItem",
            config: {
               label: "documentlibrary.view.preference.add",
               iconClass: "alf-enabled-on-icon",
               publishTopic: "ALF_UPDATE_CONTENT_REQUEST"
            }
         },
         {
            id: "REMOVE_DEFAULT_DOCUMENT_LIST_VIEW",
            name: "alfresco/menus/AlfMenuItem",
            assignTo: "_removeDefaultMenuItem",
            config: {
               label: "documentlibrary.view.preference.remove",
               iconClass: "alf-enabled-off-icon",
               publishTopic: "ALF_UPDATE_CONTENT_REQUEST"
            }
         }
      ]
   });
});