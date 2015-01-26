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
 * <p>This extends the standard [document list]{@link module:alfresco/documentlibrary/AlfDocumentList} to
 * define a document list specifically for selecting containers (folders) (e.g. for copy and move targets, etc). It was
 * written to be used as part of a [picker]{@link module:alfresco/pickers/Picker}.</p>
 *
 * @module alfresco/pickers/ContainerListPicker
 * @extends module:alfresco/pickers/DocumentListPicker
 * @author Dave Draper & David Webster
 *
 * @todo Fix look and feel to match existing pickers
 * @todo Make folders tree based?
 * @todo Default not to show not to show siblings of documentlibrary and automatically show children instead (but have that configurable)
 * @todo Add a button to take the picker up a level (if parent isn't documentlibrary)
 */
define(["dojo/_base/declare",
        "alfresco/pickers/DocumentListPicker"],
   function(declare, DocumentListPicker) {

      return declare([DocumentListPicker], {

         /**
          * An array of the i18n files to use with this widget.
          *
          * @instance
          * @type {object[]}
          * @default [{i18nFile: "./i18n/ContainerListPicker.properties"}]
          */
         i18nRequirements: [{i18nFile: "./i18n/ContainerListPicker.properties"}],

         /**
          * An array of the CSS files to use with this widget.
          *
          * @instance
          * @type {object[]}
          * @default [{cssFile:"./css/ContainerListPicker.css"}]
          */
         cssRequirements: [
            {cssFile:"./css/ContainerListPicker.css"},
            {cssFile:"../core/css/Icons.css"}
         ],

         /**
          * Sets some relevant messages to display
          *
          * @instance
          */
         setDisplayMessages: function alfresco_pickers_PropertyPicker__setDisplayMessages() {
            this.noViewSelectedMessage = this.message("containerPicker.no.view.message");
            this.noDataMessage = this.message("containerPicker.no.data.message");
            this.fetchingDataMessage = this.message("containerPicker.loading.data.message");
            this.renderingViewMessage = this.message("containerPicker.rendering.data.message");
            this.fetchingMoreDataMessage = this.message("containerPicker.loading.data.message");
            this.dataFailureMessage = this.message("containerPicker.data.failure.message");
         },

         /**
          * Don't show documents
          *
          * @instance
          * @type {boolean}
          * @default false
          */
         showDocuments: false,

         /**
          * Overrides the [inherited function]{@link module:alfresco/lists/AlfList#postCreate} to create the picker
          * view for selecting documents.
          *
          * @instance
          */
         postCreate: function alfresco_pickers_ContainerListPicker__postCreate(payload) {
            var config = [{
               name: "alfresco/documentlibrary/views/AlfDocumentListView",
               config: {
                  widgetsForHeader: [
                     {
                        name: "alfresco/buttons/AlfButton",
                        id: "ContainerListPickerParentNav",
                        config: {
                           label: this.message("containerPicker.button.parentNav.label"),
                           additionalCssClasses: "ContainerListPickerParentNav",
                           publishTopic: "ALF_DOCLIST_PARENT_NAV",
                           showLabel: false,
                           iconClass: "alf-folder-up-icon",
                           disableOnInvalidControls: true
                        }
                     }
                  ],
                  widgets: [
                     {
                        name: "alfresco/documentlibrary/views/layouts/Row",
                        config: {
                           renderFilter: [
                              {
                                 property: "node.isContainer",
                                 values: [true]
                              }
                           ],
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
                                             propertyToRender: "node.properties.cm:name",
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
                                    width: "20px",
                                    widgets: [
                                       {
                                          name: "alfresco/renderers/PublishAction",
                                          config: {
                                             publishPayloadType: "CURRENT_ITEM",
                                             renderFilter: [
                                                {
                                                   property: "node.permissions.user.CreateChildren",
                                                   values: [true]
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
         }
      });
   });