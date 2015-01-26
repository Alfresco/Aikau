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
 * This is used as the standard search result template used to control the layout of search results.
 * It is more efficient to use a single widget to control the layout than to build a complex model
 * control the layout than to build a complex model out of smaller widgets,
 * out of smaller widgets, however this widget can still be easily replaced by other widgets to
 * provide a completely custom rendering.
 *
 * @module alfresco/search/AlfSearchResult
 * @extends "alfresco/documentlibrary/views/layouts/Row"
 * @author Dave Draper & David Webster
 */
define(["dojo/_base/declare",
        "alfresco/documentlibrary/views/layouts/Row",
        "dojo/text!./templates/AlfSearchResult.html",
        "alfresco/renderers/SearchThumbnail",
        "alfresco/renderers/SearchResultPropertyLink",
        "alfresco/renderers/PropertyLink",
        "alfresco/renderers/Property",
        "alfresco/renderers/DateLink",
        "alfresco/renderers/XhrActions",
        "dojo/_base/lang",
        "dojo/dom-class",
        "alfresco/renderers/XhrContextActions",
        "alfresco/renderers/Size",
        "alfresco/renderers/MoreInfo"],
        function(declare, Row, template, SearchThumbnail, SearchResultPropertyLink, PropertyLink, Property,
                 DateLink, XhrActions, lang, domClass, XhrContextActions, Size, MoreInfo) {

   return declare([Row], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfSearchResult.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfSearchResult.css"}],

      /**
       * The HTML template to use for the widget.
       *
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Indicates whether or not to enable the context menu to show the actions with a right-click.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      enableContextMenu: false,

      /**
       * Creates the renderers to display for a search result and adds them into the template. Renderers
       * will only be created if there is data for them. This is done to further improve the performance
       * of the search rendering.
       *
       * @instance postCreate
       */
      postCreate: function alfresco_search_AlfSearchResult__postCreate() {

         // Define the filter for document and folder actions, this filter is initially
         // based on what actions are currently supported by the Aikau action service
         // rather than the actions that the user has permission to carry out on the node.
         var documentAndFolderActions = [
            "document-download",
            "document-view-content",
            "document-view-details",
            "folder-view-details",
            "document-edit-metadata",
            "document-inline-edit",
            "document-manage-granular-permissions",
            "document-manage-repo-permissions",
            "document-view-original",
            "document-view-working-copy",
            "folder-manage-rules",
            "document-view-googlemaps",
            "document-view-in-source-repository",
            "document-view-in-cloud",
            "document-delete",
            "document-edit-offline",
            "folder-download",
            "document-copy-to",
            "document-move-to",
            "document-locate",
            "document-assign-workflow",
            "document-cancel-editing"

//            TODO: Needs to use forms runtime or equiv.
//            "document-edit-properties",
//
//            TODO: Not implemented yet.
//            "document-upload-new-version",
//            "folder-view-details"
//            "document-approve"
//            "document-reject"
//            "document-manage-aspects"
//            "document-cloud-sync"
//            "document-cloud-unsync"
//            "document-view-in-cloud"
//            "document-request-sync"
//            "document-edit-online"
//            "document-checkout-to-googledocs"
//            "document-checkin-from-googledocs"
//            "document-assign-workflow"
//            "document-cancel-editing-unlock"

         ];

         // For actions other than folders and documents we want to further restrict what are displayed
         // at the moment this is restricted purely to deletion.
         var otherNodeActions = [
            "document-delete"
         ];

         new SearchThumbnail({
            currentItem: this.currentItem,
            pubSubScope: this.pubSubScope,
            showDocumentPreview: true,
            publishTopic: "ALF_NAVIGATE_TO_PAGE"
         }, this.thumbnailNode);

         new SearchResultPropertyLink({
            currentItem: this.currentItem,
            pubSubScope: this.pubSubScope,
            propertyToRender: "displayName",
            renderSize: "large"
         }, this.nameNode);

         if (this.currentItem.title == null || this.currentItem.title === "")
         {
            domClass.add(this.titleNode, "hidden");
         }
         else
         {
            new Property({
               currentItem: this.currentItem,
               pubSubScope: this.pubSubScope,
               propertyToRender: "title",
               renderSize: "small",
               renderedValuePrefix: "(",
               renderedValueSuffix: ")"
            }, this.titleNode);
         }

         var moreInfoConfig = {
            currentItem: this.currentItem,
            pubSubScope: this.pubSubScope,
            xhrRequired: true,
            filterActions: true,
            darkIcon: true
         };
         if (this.currentItem.type === "document" || this.currentItem.type === "folder")
         {
            // Leave default actions...
         }
         else
         {
            // Replace with just the delete action...
            moreInfoConfig.allowedActionsString = "[\"document-delete\"]";
         }
         new MoreInfo(moreInfoConfig, this.moreInfoNode);

         new DateLink({
            renderedValueClass: "alfresco-renderers-Property pointer",
            renderSize: "small",
            deemphasized: true,
            pubSubScope: this.pubSubScope,
            currentItem: this.currentItem,
            modifiedDateProperty: "modifiedOn",
            modifiedByProperty: "modifiedBy",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            useCurrentItemAsPayload: false,
            publishPayloadType: "PROCESS",
            publishPayloadModifiers: ["processCurrentItemTokens"],
            publishPayload: {
               url: "user/{modifiedByUser}/profile",
               type: "SHARE_PAGE_RELATIVE"
            }
         }, this.dateNode);

         if (this.currentItem.description === null || this.currentItem.description === "")
         {
            domClass.add(this.descriptionRow, "hidden");
         }
         else
         {
            new Property({
               currentItem: this.currentItem,
               pubSubScope: this.pubSubScope,
               propertyToRender: "description",
               renderSize: "small"
            }, this.descriptionNode);
         }

         var site = lang.getObject("site.title", false, this.currentItem),
             repo = true;

         if (site == null || site === "")
         {
            domClass.add(this.siteRow, "hidden");
         }
         else
         {
            repo = false;
            new PropertyLink({
               renderedValueClass: "alfresco-renderers-Property pointer",
               renderSize: "small",
               pubSubScope: this.pubSubScope,
               currentItem: this.currentItem,
               propertyToRender: "site.title",
               label: this.message("faceted-search.doc-lib.value-prefix.site"),
               publishTopic: "ALF_NAVIGATE_TO_PAGE",
               useCurrentItemAsPayload: false,
               publishPayloadType: "PROCESS",
               publishPayloadModifiers: ["processCurrentItemTokens"],
               publishPayload: {
                  url: "site/{site.shortName}/dashboard",
                  type: "SHARE_PAGE_RELATIVE"
               }
            }, this.siteNode);
         }

         if (this.currentItem.path == null || this.currentItem.path === "")
         {
            domClass.add(this.pathRow, "hidden");
         }
         else
         {
            // Create processed path as pathLink on this.currentItem
            this.currentItem.pathLink = repo ?
               encodeURIComponent('/' + this.currentItem.path.split('/').slice(2).join('/')) :
               encodeURIComponent('/' + this.currentItem.path);

            new PropertyLink({
               renderedValueClass: "alfresco-renderers-Property pointer",
               pubSubScope : this.pubSubScope,
               currentItem : this.currentItem,
               propertyToRender : "path",
               renderSize: "small",
               label : this.message("faceted-search.doc-lib.value-prefix.path"),
               publishTopic: "ALF_NAVIGATE_TO_PAGE",
               useCurrentItemAsPayload: false,
               publishPayloadType: "PROCESS",
               publishPayloadModifiers: ["processCurrentItemTokens"],
               publishPayload: {
                  url: repo ? "repository?path={pathLink}" : "site/{site.shortName}/documentlibrary?path={pathLink}",
                  type: "SHARE_PAGE_RELATIVE"
               }
            }, this.pathNode);
         }

         // We only show the size if it's not empty and at least one byte
         if (this.currentItem.size == null || this.currentItem.size === "" || this.currentItem.size < 1)
         {
            domClass.add(this.sizeRow, "hidden");
         }
         else
         {
            new Size({
               currentItem : this.currentItem,
               pubSubScope : this.pubSubScope,
               label : this.message("faceted-search.doc-lib.value-prefix.size"),
               renderSize: "small",
               sizeProperty : "size"
            }, this.sizeNode);
         }

         new XhrActions({
            onlyShowOnHover: true,
            currentItem: this.currentItem,
            pubSubScope: this.pubSubScope,
            filterActions: true,
            allowedActions: (this.currentItem.type === "document" || this.currentItem.type === "folder") ? documentAndFolderActions : otherNodeActions
         }, this.actionsNode);

         if (this.enableContextMenu)
         {
            try
            {
               new XhrContextActions({
                  targetNodeIds: [this.domNode],
                  currentItem: this.currentItem,
                  pubSubScope: this.pubSubScope,
                  filterActions: true,
                  allowedActions: (this.currentItem.type === "document" || this.currentItem.type === "folder") ? documentAndFolderActions : otherNodeActions
               });
            }
            catch (e)
            {
               this.alfLog("error", "An error occurred creating context menu", e);
            }
         }
      }
   });
});