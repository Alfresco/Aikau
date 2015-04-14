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
 * This is a BETA quality widget and not guaranteed for production use. 
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
       * 
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_CommentsList__postCreate() {
         var _widgets = lang.clone(this.widgets);
         this.processObject(["processCurrentItemTokens","convertNodeRefToUrl","processInstanceTokens"], _widgets);
         this.processWidgets(_widgets, this.domNode);
      },

      /**
       * 
       * 
       * @instance
       *
       * @fires ALF_CREATE_FORM_DIALOG_REQUEST
       */
      widgets: [
         {
            name: "alfresco/buttons/AlfButton",
            config: {
               label: "Add Comment",
               publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
               publishPayloadType: "PROCESS",
               publishPayloadModifiers: ["processCurrentItemTokens","convertNodeRefToUrl"],
               publishPayload: {
                  dialogTitle: "Add Comment",
                  dialogConfirmationButtonTitle: "Add",
                  dialogCancellationButtonTitle: "Cancel",
                  formSubmissionTopic: "ALF_CRUD_CREATE",
                  formSubmissionPayloadMixin: {
                     url: "api/node/{node.nodeRef}/comments",
                     pubSubScope: "{pubSubScope}"
                  },
                  additionalCssClasses: "no-padding",
                  fixedWidth: true,
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
         },
         {
            name: "alfresco/lists/AlfList",
            config: {
               waitForPageWidgets: false,
               loadDataPublishTopic: "ALF_CRUD_GET_ALL",
               loadDataPublishPayload: {
                  url: "api/node/{node.nodeRef}/comments?reverse=true&startIndex=0&pageSize=10",
                  urlType: "PROXY"
               },
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
                                                   iconClass: "delete-16",
                                                   publishTopic: "ALF_CRUD_DELETE",
                                                   publishPayloadType: "PROCESS",
                                                   publishPayload: {
                                                      url: "{url}",
                                                      confirmationTitle: "Delete Comment",
                                                      confirmationPrompt: "Are you sure you want to delete the comment'?",
                                                      successMessage: "Successfully deleted",
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