<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/{aikauVersion}/libs/doclib/doclib.lib.js">

var pageServices = [
   {
      name: "alfresco/services/LoggingService",
      config: {
         loggingPreferences: {
            enabled: true,
            all: true
         }
      }
   },
   "alfresco/services/NavigationService",
   "alfresco/services/LogoutService"];

var docLibServices = getDocumentLibraryServices();
var services = pageServices.concat(docLibServices);

for (var i=0; i<services.length; i++)
{
   if (services[i].id === "DIALOG_SERVICE")
   {
      services[i].name = "aikau/services/MdlDialogService";
   }
}

var docLib = getDocLibList({
   siteId: null, 
   containerId: null, 
   rootNode: "alfresco://company/home", 
   rootLabel: "Documents",
   getUserPreferences: false
});

docLib.config.widgets = [
   {
      name: "aikau/lists/views/ListView",
      config: {
         widgetsForHeader: [
            {
               name: "aikau/lists/views/layouts/HeaderCell",
               config: {
                  label: "Name",
                  sortable: true,
                  sortValue: "cm:name",
                  useHash: "{useHash}"
               }
            },
            {
               name: "aikau/lists/views/layouts/HeaderCell",
               config: {
                  label: "Modified on",
                  sortable: true,
                  sortValue: "cm:modified",
                  useHash: "{useHash}"
               }
            },
            {
               name: "aikau/lists/views/layouts/HeaderCell",
               config: {
                  label: "by",
                  sortable: true,
                  sortValue: "cm:modifier",
                  useHash: "{useHash}"
               }
            }
         ],
         widgets: [
            {
               name: "alfresco/lists/views/layouts/Row",
               config: {
                  widgets: [
                     {
                        name: "aikau/lists/views/layouts/Cell",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/renderers/InlineEditPropertyLink",
                                 config: {
                                    propertyToRender: "node.properties.cm:name",
                                    permissionProperty: "node.permissions.user.Write",
                                    postParam: "prop_cm_name",
                                    renderAsLink: true
                                 }
                              }
                           ]
                        }
                     },
                     {
                        name: "aikau/lists/views/layouts/Cell",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/renderers/Date"
                              }
                           ]
                        }
                     },
                     {
                        name: "aikau/lists/views/layouts/Cell",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "node.properties.cm:modifier",
                                    postParam: "prop_cm_modifier",
                                    publishTopic: "ALF_NAVIGATE_TO_PAGE",
                                    publishPayloadType: "PROCESS",
                                    publishPayloadModifiers: ["processCurrentItemTokens"],
                                    useCurrentItemAsPayload: false,
                                    publishPayload: {
                                       url: "user/{node.properties.cm:creator.userName}/profile",
                                       type: "PAGE_RELATIVE",
                                       target: "CURRENT"
                                    }
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
];

model.jsonModel = {
   services: services,
   widgets: [
      {
         name: "aikau/layout/Alfresco",
         config: {
            widgetsForHeaderLeft: [
               {
                  name: "alfresco/logo/Logo"
               },
               {
                  name: "aikau/layout/Title",
                  config: {
                     title: "Material Designed Aikau"
                  }
               }
            ],
            widgetsForHeaderRight: [
               {
                  name: "aikau/layout/Title",
                  config: {
                     title: "Miya Hwang"
                  }
               },
               {
                  name: "aikau/buttons/Button",
                  config: {
                     buttonClasses: "mdl-button--icon",
                     leadingIcon: "notifications"
                  }
               },
               {
                  name: "aikau/buttons/Button",
                  config: {
                     buttonClasses: "mdl-button--icon",
                     leadingIcon: "apps"
                  }
               },
               {
                  name: "aikau/buttons/Button",
                  config: {
                     buttonClasses: "mdl-button--icon",
                     leadingIcon: "settings"
                  }
               },
               {
                  name: "aikau/buttons/Button",
                  config: {
                     buttonClasses: "mdl-button--icon",
                     leadingIcon: "input"
                  }
               }
            ],
            widgetsForDrawer: [
               {
                  name: "aikau/menus/Menu",
                  config: {
                     label: "New",
                     buttonClasses: "mdl-button--raised mdl-button--colored mdl-button--accent",
                     trailingIcon: "expand_more",
                     widgets: [
                        {
                           name: "aikau/menus/MenuItem",
                           config: {
                              title: "Text file",
                              publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
                              publishPayload: {
                                 dialogTitle: "Create text file",
                                 dialogWidth: "500px",
                                 formSubmissionTopic: "CREATE",
                                 widgets: [
                                    {
                                       name: "aikau/forms/controls/MdlTextBox",
                                       config: {
                                          label: "Name",
                                          description: "This is the name of the file that you wish to create",
                                          name: "name",
                                          placeHolder: "File name..."
                                       }
                                    }
                                 ],
                                 widgetsButtons: [
                                    {
                                       name: "aikau/buttons/Button",
                                       config: {
                                          label: "OK",
                                          buttonClasses: "mdl-button"
                                       }
                                    }
                                 ]
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  name: "aikau/navigation/Links",
                  config: {
                     widgets: [
                        {
                           name: "aikau/navigation/Link",
                           config: {
                              label: "Shared",
                              icon: "people"
                           }
                        },
                        {
                           name: "aikau/navigation/Link",
                           config: {
                              label: "Recents",
                              icon: "access_time"
                           }
                        },
                        {
                           name: "aikau/navigation/Link",
                           config: {
                              label: "Favourites",
                              icon: "star"
                           }
                        },
                        {
                           name: "aikau/navigation/Link",
                           config: {
                              label: "Bin",
                              icon: "delete"
                           }
                        }
                     ]
                  }
               }
               
            ],
            widgetsForToolbarLeft: [
               getDocLibBreadcrumbTrail({
                  siteId: null, 
                  containerId: null, 
                  rootNode: "alfresco://company/home", 
                  rootLabel: "Documents",
                  getUserPreferences: false
               })
            ],
            widgetsForToolbarRight: [
               {
                  name: "aikau/buttons/Button",
                  config: {
                     buttonClasses: "mdl-button--icon",
                     leadingIcon: "info_outline"
                  }
               },
               {
                  name: "aikau/buttons/Button",
                  config: {
                     buttonClasses: "mdl-button--icon",
                     leadingIcon: "view_module"
                  }
               },
               {
                  name: "aikau/buttons/Button",
                  config: {
                     buttonClasses: "mdl-button--icon",
                     leadingIcon: "live_help"
                  }
               }
            ],
            widgetsForContent: [
               docLib,
               {
                  name: "alfresco/testing/NodesMockXhr",
                  config: {
                     totalItems: 40,
                     folderRatio: [50]
                  }
               }
            ],
            widgetsForFixedSearch: [
               {
                  name: "aikau/buttons/Button",
                  config: {
                     buttonClasses: "mdl-button--fab mdl-button--colored",
                     leadingIcon: "search"
                  }
               }
            ]
         }
      }

      // {
      //    name: "aikau/layout/Layout",
      //    config: {
      //       widgets: [
      //          {
      //             name: "aikau/layout/Header",
      //             config: {
      //                widgets: [
      //                   {
      //                      name: "aikau/layout/HeaderRow",
      //                      config: {
      //                         widgets: [
      //                            {
      //                               name: "alfresco/logo/Logo",
      //                               config: {
      //                                  title: "Material Designed Aikau"
      //                               }
      //                            },
      //                            {
      //                               name: "aikau/layout/Title",
      //                               config: {
      //                                  title: "Material Designed Aikau"
      //                               }
      //                            },
      //                            {
      //                               name: "aikau/layout/Spacer"
      //                            },
      //                            {
      //                               name: "aikau/layout/Title",
      //                               config: {
      //                                  title: "Miya Hwang"
      //                               }
      //                            },
      //                            {
      //                               name: "aikau/buttons/Button",
      //                               config: {
      //                                  buttonClasses: "mdl-button--icon",
      //                                  leadingIcon: "notifications"
      //                               }
      //                            },
      //                            {
      //                               name: "aikau/buttons/Button",
      //                               config: {
      //                                  buttonClasses: "mdl-button--icon",
      //                                  leadingIcon: "apps"
      //                               }
      //                            },
      //                            {
      //                               name: "aikau/buttons/Button",
      //                               config: {
      //                                  buttonClasses: "mdl-button--icon",
      //                                  leadingIcon: "settings"
      //                               }
      //                            },
      //                            {
      //                               name: "aikau/buttons/Button",
      //                               config: {
      //                                  buttonClasses: "mdl-button--icon",
      //                                  leadingIcon: "input"
      //                               }
      //                            }
      //                         ]
      //                      }
      //                   }
      //                ]
      //             }
      //          },
      //          {
      //             name: "aikau/layout/Drawer",
      //             config: {
      //                fixed: true,
      //                widgetsForDrawer: [
      //                   {
      //                      name: "aikau/buttons/Button",
      //                      config: {
      //                         buttonClasses: "mdl-button--raised mdl-button--colored mdl-button--accent",
      //                         trailingIcon: "arrow_drop_down",
      //                         label: "New"
      //                      }
      //                   },
      //                   {
      //                      name: "aikau/menus/Menu",
      //                      config: {
      //                         label: "Company Libraries",
      //                         leadingIcon: "group_work",
      //                         trailingIcon: "expand_more",
      //                         widgets: [
      //                            {
      //                               name: "aikau/menus/MenuItem",
      //                               config: {
      //                                  title: "Help"
      //                               }
      //                            }
      //                         ]
      //                      }
      //                   },
      //                   {
      //                      name: "aikau/menus/Menu",
      //                      config: {
      //                         label: "Smart Folders",
      //                         leadingIcon: "folder_special",
      //                         trailingIcon: "expand_more",
      //                         widgets: [
      //                            {
      //                               name: "aikau/menus/MenuItem",
      //                               config: {
      //                                  title: "Help"
      //                               }
      //                            }
      //                         ]
      //                      }
      //                   }
      //                ],
      //                widgetsForContent: [
      //                   {
      //                      name: "alfresco/logo/Logo"
      //                   }
      //                ]
      //             }
      //          }
      //       ]
      //    }
      // }
   ]
};