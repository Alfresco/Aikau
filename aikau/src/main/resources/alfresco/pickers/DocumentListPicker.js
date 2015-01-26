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
 * <p>This extends the standard [document list]{@link module:alfresco/documentlibrary/AlfDocumentList} to
 * define a document list specifically for selecting documents (e.g. for starting workflows, etc). It was
 * written to be used as part of a [picker]{@link module:alfresco/pickers/Picker} and specifically one that
 * is used as a form control.</p>
 *
 * @module alfresco/pickers/DocumentListPicker
 * @extends module:alfresco/documentlibrary/AlfDocumentList
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/documentlibrary/AlfDocumentList",
        "dojo/_base/lang",
        "alfresco/core/ArrayUtils"],
        function(declare, AlfDocumentList, lang, arrayUtils) {

   return declare([AlfDocumentList], {

      /**
       * Overrides the [inherited value]{@link module:alfresco/lists/AlfList#waitForPageWidgets} to ensure that pickers
       * don't wait for the page to be loaded (as typically the page will be loaded long before the picker is opened).
       * This can still be overridden again in configuration when creating a new picker.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      waitForPageWidgets: false,

      /**
       * Overrides the [inherited value]{@link module:alfresco/lists/AlfHashList#useHash} to indicate that the location
       * should not be driven by changes to the browser URL hash
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      useHash: false,

      /**
       * This nodeRefRef is used to limit navigation up the directory, to constrain the picker to the a certain path.
       * It can be passed in on config, but if not, it will be set the first time loadData is called.
       *
       * @instance
       * @type {String}
       * @default null
       */
      rootNodeRef: null,

      /**
       * Enable site mode.
       * In site mode the peer folders of the documentlibrary container are hidden and we skip straight to documentlibrary's children
       *
       * @instance
       * @type {Boolean}
       * @default false
       */
      siteMode: false,

      /**
       * This topic that is published when a document is picked. By default it is the topic that indicates
       * that the document has been selected.
       *
       * @instance
       * @type {string}
       * @default "ALF_ITEM_SELECTED"
       */
      publishTopic: "ALF_ITEM_SELECTED",

      /**
       * This is the type of payload published when a document is picked. By default it is the current
       * item type.
       *
       * @instance
       * @type {string}
       * @default "CURRENT_ITEM"
       */
      publishPayloadType: "CURRENT_ITEM",

      /**
       * This is the configured payload published when a document is picked. By default it is null
       *
       * @instance
       * @type {object}
       * @default null
       */
      publishPayload: null,

      /**
       * This indicates whether the current item should be mixed into the published payload. By
       * default this is false (because the default type is to just publish the current item)
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      publishPayloadItemMixin: false,

      /**
       * The modifiers to apply to the publish payload. This should only be set if the
       * [publishPayloadType]{@link module:alfresco/pickers/DocumentListPicker#publishPayloadType}
       * is set to "PROCESS".
       *
       * @instance
       * @type {array}
       * @default null
       */
      publishPayloadModifiers: null,

      /**
       * Overrides the [inherited function]{@link module:alfresco/lists/AlfList#postCreate} to create the picker
       * view for selecting documents.
       *
       * @instance
       */
      postCreate: function alfresco_pickers_DocumentListPicker__postCreate(payload) {
         var config = [{
            name: "alfresco/documentlibrary/views/AlfDocumentListView",
            config: {
               widgets: [
                  {
                     name: "alfresco/documentlibrary/views/layouts/Row",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/documentlibrary/views/layouts/Cell",
                              config: {
                                 width: "20px",
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/FileType",
                                       config: {
                                          size: "small",
                                          renderAsLink: true,
                                          publishTopic: "ALF_DOCLIST_NAV"
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              name: "alfresco/documentlibrary/views/layouts/Cell",
                              config: {
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/PropertyLink",
                                       config: {
                                          propertyToRender: "node.properties.cm:title",
                                          renderAsLink: true,
                                          publishTopic: "ALF_DOCLIST_NAV",
                                          renderFilter: [
                                             {
                                                property: "node.type",
                                                values: ["st:site"]
                                             }
                                          ]
                                       }
                                    },
                                    {
                                       name: "alfresco/renderers/PropertyLink",
                                       config: {
                                          propertyToRender: "node.properties.cm:name",
                                          renderAsLink: true,
                                          publishTopic: "ALF_DOCLIST_NAV",
                                          renderFilter: [
                                             {
                                                property: "node.type",
                                                values: ["st:site"],
                                                negate: true
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              name: "alfresco/documentlibrary/views/layouts/Cell",
                              config: {
                                 width: "20px",
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/PublishAction",
                                       config: {
                                          publishTopic: this.publishTopic,
                                          publishPayloadType: this.publishPayloadType,
                                          publishPayload: this.publishPayload,
                                          publishPayloadItemMixin: this.publishPayloadItemMixin,
                                          publishPayloadModifiers: this.publishPayloadModifiers,
                                          renderFilter: [
                                             {
                                                property: "node.isContainer",
                                                values: [false]
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              }
                           }
                        ]
                     }
                  }
               ]
            }
         }];
         this.processWidgets(config, this.itemsNode);
      },

      /**
       * Override the default implementation to call [loadData]{@link module:alfresco/documentlibrary/AlfDocumentList#loadData}
       * with the currently selected folder node.
       *
       * @instance
       * @param {object} payload
       * @todo Refactor this code to accept the same payload format as {@link module:alfresco/documentlibrary/AlfDocumentList#onItemClick}
       */
      onFolderClick: function alfresco_pickers_DocumentListPicker__onFolderClick(payload) {
         var targetNode = lang.getObject("item.nodeRef", false, payload) || lang.getObject("node.nodeRef", false, payload) || payload.nodeRef;
         if (targetNode != null)
         {
            this.nodeRef = targetNode;

            // Make sure we go back to page one when the new list is requested.
            this.resetPaginationData();

            this.loadData();
         }
         else
         {
            this.alfLog("warn", "A 'nodeRef' attribute was expected to be provided for a folder click", payload, this);
         }
      },

      /**
       * Overrides inherited function to do a no-op. The pick action should be handled by a
       * [PublishAction widget]{@link module:alfresco/renderers/PublishAction}.
       *
       * @instance
       * @param {object} payload
       */
      onDocumentClick: function alfresco_pickers_DocumentListPicker__onDocumentClick(payload) {
         // No action.
      },

      /**
       * Extends [loadData]{@link module:alfresco/documentlibrary/AlfSearchList#loadData} to store the rootNodeRef.
       * @instance
       */
      loadData: function alfresco_pickers_DocumentListPicker__loadData() {
         if (!this.rootNodeRef) {
            this.rootNodeRef = this.nodeRef;
         }

         // Enable or disable the parent navigation
         if (this.nodeRef === this.rootNodeRef)
         {
            this.alfPublish("ALF_INVALID_CONTROL", {});
         }
         else
         {
            this.alfPublish("ALF_VALID_CONTROL", {});
         }

         this.inherited(arguments);
      },

      /**
       * Overrides [onDataLoadSuccess]{@link module:alfresco/documentlibrary/AlfList#onDataLoadSuccess} to skip children.
       *
       * @param payload
       */
      onDataLoadSuccess: function alfresco_pickers_DocumentListPicker__onDataLoadSuccess(payload) {
         var parentType = lang.getObject("response.metadata.parent.type", false, payload);

         // Allow parent nav functionality to work when node information passed in was a well known node.
         if (this.rootNodeRef.indexOf("alfresco://") !== -1)
         {
            // If an alfresco:// prefixed path was passed in, we need to update it to the nodeRef now we have it
            var parentNodeRef = lang.getObject("response.metadata.parent.nodeRef", false, payload);
            if (parentNodeRef)
            {
               this.rootNodeRef = parentNodeRef;
            }
            else
            {
               this.alfLog("warn", "Couldn't retrieve parentNodeRef, this means the back parent nav button will appear when it shouldn't");
            }
         }

         // If we're in site mode and the returned items are direct children of a site node, skip to the documentlibrary
         if (this.siteMode && parentType === "st:site")
         {
            // Find the "documentLibrary" node in the response items
            var items = lang.getObject("response.items", false, payload),
               doclibNode = arrayUtils.findInArray(items, "documentLibrary", "fileName"),
               doclibNodeRef = lang.getObject("node.nodeRef", false, doclibNode);
            if (doclibNodeRef)
            {
               // once we have the node ref, load it using the same mechanism as before.
               this.rootNodeRef = doclibNodeRef;
               this.onFolderClick({nodeRef: doclibNodeRef});
            }
            else
            {
               this.alfLog("error", "Unable to retrieve nodeRef for documentLibrary folder.");
            }
         }
         else
         {
            this.inherited(arguments);
         }
      },

      /**
       * The default widgets for the picker. This can be overridden at instantiation based on what is required to be
       * displayed in the picker.
       *
       * @instance
       * @type {object}
       */
      widgets: [

      ]
   });
});