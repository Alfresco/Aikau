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
 * <p>This widget displays the comments for a particular node. The comments are displayed in a 
 * [sortable paginated list]{@link alfresco/lists/AlfSortablePaginatedList} with 
 * [paging controls]{@link module:alfresco/lists/Paginator} for managing the comments displayed. The individual
 * comments are displayed using the [EditableComment]{@link module:alfresco/renderers/EditableComment} which allows
 * individual comments to be updated if the current user has the appropriate permissions to work with that comment.<p>
 *
 * <p>Please note that for this widget relies on the [CommentService]{@link module:alfresco/services/CommentService}
 * and [CrudService]{@link module:alfresco/services/CrudService} being present on the page in order to retrieve, create,
 * update and delete comments. However these services can be substituted for custom versions that subscribe and publish
 * on the same topics if required.</p>
 *
 * @module alfresco/renderers/CommentsList
 * @extends module:alfresco/core/ProcessWidgets
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/ProcessWidgets",
        "alfresco/core/ObjectProcessingMixin",
        "dojo/_base/lang"], 
        function(declare, ProcessWidgets, ObjectProcessingMixin, lang) {

   return declare([ProcessWidgets, ObjectProcessingMixin], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/CommentsList.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/CommentsList.properties"}],
      
      /**
       * Widget has been started, but not necessarily any sub-widgets.
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_CommentsList__postCreate() {
         var _widgets = lang.clone(this.widgets);
         this.processObject(["processCurrentItemTokens","convertNodeRefToUrl","processInstanceTokens"], _widgets);
         this.processWidgets(_widgets, this.domNode);
      },

      /**
       * The widgets that comprise this CommentsList.
       * 
       * @instance
       * @fires ALF_CREATE_FORM_DIALOG_REQUEST
       */
      widgets: [
         {
            name: "alfresco/lists/Paginator",
            config: {
               documentsLoadedTopic: "ALF_GET_COMMENTS_SUCCESS",
               documentsPerPage: 5,
               pageSizes: [5, 10, 20],
               widgetsBefore: [
                  {
                     name: "alfresco/menus/AlfMenuBarItem",
                     config: {
                        label: "comment.add",
                        publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
                        publishPayloadType: "PROCESS",
                        publishPayloadModifiers: ["processCurrentItemTokens","convertNodeRefToUrl"],
                        publishPayload: {
                           dialogTitle: "comment.add",
                           dialogConfirmationButtonTitle: "comment.add.confirm",
                           dialogCancellationButtonTitle: "comment.add.cancel",
                           formSubmissionTopic: "ALF_CRUD_CREATE",
                           formSubmissionPayloadMixin: {
                              url: "api/node/{node.nodeRef}/comments",
                              pubSubScope: "{pubSubScope}"
                           },
                           additionalCssClasses: "no-padding",
                           fixedWidth: true,
                           dialogWidth: "545px",
                           widgets: [
                              {
                                 name: "alfresco/forms/controls/TinyMCE",
                                 config: {
                                    name: "content"
                                 }
                              }
                           ]
                        },
                        publishGlobal: true,
                        renderFilter: [
                           {
                              target: "currentMetadata",
                              property: "parent.permissions.user.CreateChildren",
                              values: [true]
                           }
                        ]
                     }
                  }
               ],
               widgetsAfter: [
                  {
                     name: "alfresco/menus/AlfMenuBarToggle",
                     config: {
                        checked: true,
                        onConfig: {
                           iconClass: "alf-sort-ascending-icon",
                           publishTopic: "ALF_DOCLIST_SORT",
                           publishPayload: {
                              direction: "ascending"
                           }
                        },
                        offConfig: {
                           iconClass: "alf-sort-descending-icon",
                           publishTopic: "ALF_DOCLIST_SORT",
                           publishPayload: {
                              direction: "descending"
                           }
                        },
                        visibilityConfig: {
                           initialValue: true,
                           rules: [
                              {
                                 topic: "ALF_GET_COMMENTS_SUCCESS",
                                 attribute: "totalRecords",
                                 isNot: [0]
                              }
                           ]
                        }
                     }
                  }
               ]
            }
         },
         {
            name: "alfresco/lists/AlfSortablePaginatedList",
            config: {
               noDataMessage: "comments.none",
               waitForPageWidgets: false,
               loadDataPublishTopic: "ALF_GET_COMMENTS",
               loadDataPublishPayload: {
                  nodeRef: "{node.nodeRef}"
               },
               currentPageSize: 5,
               documentsLoadedTopic: "ALF_COMMENTS_LOADED",
               widgets: [
                  {
                     name: "alfresco/lists/views/AlfListView",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/lists/views/layouts/Row",
                              config: {
                                 generatePubSubScope: true,
                                 widgets: [
                                    {
                                       name: "alfresco/lists/views/layouts/Cell",
                                       config: {
                                          width: "80px",
                                          widgets: [
                                             {
                                                name: "alfresco/renderers/AvatarThumbnail",
                                                config: {
                                                   userNameProperty: "author.username",
                                                   imageTitleProperty: "author.displayName"
                                                }
                                             }
                                          ]
                                       }
                                    },
                                    {
                                       name: "alfresco/lists/views/layouts/Cell",
                                       config: {
                                          widgets: [
                                             {
                                                name: "alfresco/lists/views/layouts/Column",
                                                config: {
                                                   widgets: [
                                                      {
                                                         name: "alfresco/lists/views/layouts/Cell",
                                                         config: {
                                                            widgets: [
                                                               {
                                                                  name: "alfresco/renderers/Date",
                                                                  config: {
                                                                     modifiedDateProperty: "modifiedOnISO",
                                                                     modifiedByProperty: "author.username"
                                                                  }
                                                               }
                                                            ]
                                                         }
                                                      },
                                                      {
                                                         name: "alfresco/lists/views/layouts/Cell",
                                                         config: {
                                                            widgets: [
                                                               {
                                                                  name: "alfresco/renderers/EditableComment",
                                                                  config: {
                                                                     propertyToRender: "content"
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
                                    },
                                    {
                                       name: "alfresco/lists/views/layouts/Cell",
                                       config: {
                                          widgets: [
                                             {
                                                name: "alfresco/renderers/PublishAction",
                                                config: {
                                                   altText: "comment.edit",
                                                   iconClass: "edit-16",
                                                   publishTopic: "ALF_EDIT_COMMENT",
                                                   renderFilter: [
                                                      {
                                                         property: "permissions.edit",
                                                         values: [true]
                                                      }
                                                   ]
                                                }
                                             },
                                             {
                                                name: "alfresco/renderers/PublishAction",
                                                config: {
                                                   altText: "comment.delete",
                                                   iconClass: "delete-16",
                                                   publishTopic: "ALF_CRUD_DELETE",
                                                   publishPayloadType: "PROCESS",
                                                   publishPayload: {
                                                      url: "{url}",
                                                      confirmationTitle: "comment.delete",
                                                      confirmationPrompt: "comment.delete.prompt",
                                                      successMessage: "comment.delete.success",
                                                      requiresConfirmation: true,
                                                      pubSubScope: "{pubSubScope}"
                                                   },
                                                   publishGlobal: true,
                                                   publishPayloadModifiers: ["processCurrentItemTokens"],
                                                   renderFilter: [
                                                      {
                                                         property: "permissions.delete",
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
                  }
               ]
            }
         }
      ]
   });
});