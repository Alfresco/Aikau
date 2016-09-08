/* global remote */

function getDataListServices() {
   return [
      {
         id: "CRUD_SERVICE",
         name: "alfresco/services/CrudService"
      },
      {
         id: "DATALIST_SERVICE",
         name: "alfresco/services/DataListService"
      },
      {
         id: "DIALOG_SERVICE",
         name: "alfresco/services/DialogService"
      },
      {
         id: "DOCUMENT_SERVICE",
         name: "alfresco/services/DocumentService"
      },
      {
         id: "FORMS_RUNTIME_SERVICE",
         name: "alfresco/services/FormsRuntimeService"
      },
      {
         id: "NODE_PREVIEW_SERVICE",
         name: "alfresco/services/NodePreviewService"
      },
      {
         id: "NOTIFICATION_SERVICE",
         name: "alfresco/services/NotificationService"
      },
      {
         id: "SEARCH_SERVICE",
         name: "alfresco/services/SearchService"
      },
      {
         id: "SITE_SERVICE",
         name: "alfresco/services/SiteService"
      },
      {
         id: "USER_SERVICE",
         name: "alfresco/services/UserService"
      }
   ];
}

function getDataListsList(config) {
   return {
      name: "alfresco/lists/AlfList",
      align: "sidebar",
      config: {
         loadDataPublishTopic: "ALF_GET_DATA_LISTS",
         loadDataPublishPayload: {
            siteId: config.siteId
         },
         itemsProperty: "datalists",
         widgets: [
            {
               name: "alfresco/lists/views/AlfListView",
               config: {
                  widgets: [
                     {
                        name: "alfresco/lists/views/layouts/Row",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/lists/views/layouts/Cell",
                                 config: {
                                    additionalCssClasses: "mediumpad",
                                    widgets: [
                                       {
                                          name: "alfresco/renderers/PropertyLink",
                                          config: {
                                             propertyToRender: "title",
                                             useCurrentItemAsPayload: false,
                                             publishTopic: "ALF_GET_DATA_LIST_WIDGETS",
                                             publishPayloadType: "PROCESS",
                                             publishPayloadModifiers: ["processCurrentItemTokens"],
                                             publishPayload: {
                                                alfResponseTopic: "SHOW_DATA_LIST"
                                             },
                                             publishPayloadItemMixin: true,
                                             publishGlobal: true
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
                                             propertyToRender: "title",
                                             altText: "Click to edit {0}",
                                             onlyShowOnHover: true,
                                             publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
                                             publishPayloadType: "PROCESS",
                                             publishPayloadModifiers: ["processCurrentItemTokens"],
                                             publishPayload: {
                                                dialogId: "ALF_DATA_LIST_EDIT_DIALOG",
                                                dialogTitle: "Edit {title}",
                                                formSubmissionTopic: "ALF_UPDATE_DATA_LIST",
                                                formSubmissionGlobal: true,
                                                formSubmissionPayloadMixin: {
                                                   nodeRef: "{nodeRef}",
                                                   siteId: config.siteId
                                                },
                                                widgets: [
                                                   {
                                                      name: "alfresco/forms/controls/TextBox",
                                                      config: {
                                                         label: "Title",
                                                         value: "{title}",
                                                         name: "title",
                                                         requirementConfig: {
                                                            initialValue: true
                                                         }
                                                      }
                                                   },
                                                   {
                                                      name: "alfresco/forms/controls/TextArea",
                                                      config: {
                                                         label: "Description",
                                                         value: "{description}",
                                                         name: "description"
                                                      }
                                                   }
                                                ]
                                             },
                                             publishGlobal: true
                                          }
                                       },
                                       {
                                          name: "alfresco/renderers/PublishAction",
                                          config: {
                                             iconClass: "delete-16",
                                             propertyToRender: "title",
                                             altText: "Click to delete {0}",
                                             onlyShowOnHover: true,
                                             publishTopic: "ALF_DELETE_DATA_LIST_REQUEST",
                                             publishPayloadType: "CURRENT_ITEM",
                                             publishGlobal: true
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
   };
}

function getDataListDisplay() {
   return {
      name: "alfresco/layout/DynamicWidgets",
      config: {
         subscriptionTopic: "SHOW_DATA_LIST",
         subscribeGlobal: true
      }
   };
}

function getContainer() {
   var container = null;
   var result = remote.call("/slingshot/datalists/lists/site/swsdp/dataLists");
   if (result.status == 200) // jshint ignore:line
   {
      var response = JSON.parse(result);
      container = response.container;
   }
   return container;
}

function getListTypes() {
   var types = [];
   var result = remote.call("/api/classes/dl_dataListItem/subclasses");
   
   if (result.status == 200) // jshint ignore:line
   {
      var classes = JSON.parse(result);
      var subclass;
      
      for (var i = 0, ii = classes.length; i < ii; i++)
      {
         subclass = classes[i];
         if (subclass.name === "dl:dataListItem")
         {
            // Ignore abstract parent type
            continue;
         }

         types.push(
         {
            value: subclass.name,
            label: subclass.title
         });
      }
   }

   return types;
}


function getNewDataListButton() {
   return {
      name: "alfresco/buttons/AlfButton",
      align: "sidebar",
      config: {
         style: {
            marginTop: "10px"
         },
         additionalCssClasses: "call-to-action",
         label: "New List",
         publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
         publishPayload: {
            dialogId: "NEW_DATA_LIST_DIALOG",
            dialogTitle: "New List",
            formSubmissionTopic: "ALF_CRUD_CREATE",
            formSubmissionGlobal: false,
            formSubmissionPayloadMixin: {
               alf_destination: getContainer(),
               url: "api/type/dl%3AdataList/formprocessor"
            },
            widgets: [
               {
                  name: "alfresco/forms/controls/Select",
                  config: {
                     name: "prop_dl_dataListItemType",
                     label: "Select the type of list you want to create",
                     optionsConfig: {
                        fixed: getListTypes()
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     name: "prop_cm_title",
                     label: "Title"
                  }
               },
               {
                  name: "alfresco/forms/controls/TextArea",
                  config: {
                     name: "prop_cm_description",
                     label: "Description"
                  }
               }
            ]
         },
         publishGlobal: true
      }
   };
}


function getDataListWidgets(config) {
   return {
      name: "alfresco/layout/AlfSideBarContainer",
      config: {
         widgets: [
            getNewDataListButton(),
            getDataListsList(config),
            getDataListDisplay()
         ]
      }
   };
}