function getTaskListServices() {
   return [
      {
         id: "CRUD_SERVICE",
         name: "alfresco/services/CrudService"
      },
      {
         id: "DOCUMENT_SERVICE",
         name: "alfresco/services/DocumentService"
      },
      {
         id: "NOTIFICATION_SERVICE",
         name: "alfresco/services/NotificationService"
      },
      {
         id: "USER_SERVICE",
         name: "alfresco/services/UserService"
      }
   ];
}

function getUserProfilesPaginator() {
   return {
     name: "alfresco/lists/Paginator",
     config: {
      documentsPerPage: 10,
       pageSizes: [5,10,20],
       widgetsAfter: [
         {
           name: "alfresco/lists/SortFieldSelect",
           config: {
             sortFieldOptions: [
               { label: "Display Name", value: "fullName", selected: true },
               { label: "User Name", value: "userName" }
             ]
           }
         },
         {
           name: "alfresco/lists/SortOrderToggle"
         }
       ]
     }
   };
}

function getUserProfileInfoTab() {
   return {
      name: "alfresco/layout/VerticalWidgets",
      title: "Info",
      config: {
         widgets: [
            {
               name: "alfresco/node/MetadataGroups",
               config: {
                  groups: [
                     {
                        title: "Contact Information",
                        widgets: [
                           {
                              label: "Email",
                              name: "alfresco/renderers/Property",
                              config: {
                                propertyToRender: "email"
                              }
                           },
                           {
                              label: "Telephone",
                              name: "alfresco/renderers/Property",
                              config: {
                                propertyToRender: "telephone"
                              }
                           },
                           {
                              label: "Mobile",
                              name: "alfresco/renderers/Property",
                              config: {
                                propertyToRender: "mobile"
                              }
                           },
                           {
                              label: "Skype",
                              name: "alfresco/renderers/Property",
                              config: {
                                propertyToRender: "skype"
                              }
                           }
                        ]
                     },
                     {
                        title: "Company Details",
                        widgets: [
                           {
                              label: "Name",
                              name: "alfresco/renderers/Property",
                              config: {
                                propertyToRender: "organization"
                              }
                           },
                           {
                              label: "Address",
                              name: "alfresco/renderers/Property",
                              config: {
                                propertyToRender: "companyaddress1"
                              }
                           },
                           {
                              label: "",
                              name: "alfresco/renderers/Property",
                              config: {
                                propertyToRender: "companyaddress2"
                              }
                           },
                           {
                              label: "",
                              name: "alfresco/renderers/Property",
                              config: {
                                propertyToRender: "companyaddress3"
                              }
                           }
                        ]
                     }
                  ]
               }
            }
         ]
      }
   };
}

function getUserProfileContentList(data) {
   return {
      name: "alfresco/layout/VerticalWidgets",
      title: data.title,
      config: {
         widgets: [
            {
               name: "alfresco/lists/AlfList",
               config: {
                  pubSubScope: data.pubSubScope,
                  waitForPageWidgets: false,
                  loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                  loadDataPublishPayload: {
                     url: "slingshot/profile/usercontents?user={userName}&maxResults=50"
                  },
                  itemsProperty: data.itemsProperty,
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
                                             width: "64px",
                                             widgets: [
                                                {
                                                   name: "alfresco/renderers/Thumbnail",
                                                   config: {
                                                      
                                                   }
                                                }
                                             ]
                                          }
                                       },
                                       {
                                          name: "alfresco/lists/views/layouts/Cell",
                                          config: {
                                             additionalCssClasses: "mediumpad",
                                             widgets: [
                                                {
                                                   name: "alfresco/renderers/PropertyLink",
                                                   config: {
                                                      propertyToRender: "displayName",
                                                      renderSize: "large",
                                                      renderOnNewLine: true
                                                   }
                                                },
                                                {
                                                   name: "alfresco/renderers/Property",
                                                   config: {
                                                      propertyToRender: "description",
                                                      renderOnNewLine: true,
                                                      deemphasized: true
                                                   }
                                                },
                                                {
                                                   name: "alfresco/renderers/Date",
                                                   config: {
                                                      renderOnNewLine: true,
                                                      modifiedDateProperty: "modifiedOn",
                                                      modifiedByProperty: "modifiedBy",
                                                      deemphasized: true
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
      }
   };
}

function getUserProfileRecentlyAddedTab() {
   return getUserProfileContentList({
      title: "Recently Added Content",
      pubSubScope: "RECENTLY_ADDED_",
      itemsProperty: "created.items"
   });
}

function getUserProfileRecentlyModifiedTab() {
   return getUserProfileContentList({
      title: "Recently Modified Content",
      pubSubScope: "RECENTLY_MODIFIED_",
      itemsProperty: "modified.items"
   });
}

function getUserProfileSitesTab() {
   return {
      name: "alfresco/layout/VerticalWidgets",
      title: "Sites",
      config: {
         widgets: [
            {
               name: "alfresco/lists/AlfList",
               config: {
                  pubSubScope: "SITES_",
                  waitForPageWidgets: false,
                  loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                  loadDataPublishPayload: {
                     url: "api/people/{userName}/sites"
                  },
                  itemsProperty: "",
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
                                             width: "64px",
                                             widgets: [
                                                {
                                                   name: "alfresco/html/Image",
                                                   config: {
                                                      src: "components/site-finder/images/site-64.png",
                                                      srcType: "CONTEXT_RELATIVE"
                                                   }
                                                }
                                             ]
                                          }
                                       },
                                       {
                                          name: "alfresco/lists/views/layouts/Cell",
                                          config: {
                                             additionalCssClasses: "mediumpad",
                                             widgets: [
                                                {
                                                   name: "alfresco/renderers/PropertyLink",
                                                   config: {
                                                      propertyToRender: "title",
                                                      renderSize: "large",
                                                      renderOnNewLine: true
                                                   }
                                                },
                                                {
                                                   name: "alfresco/renderers/Property",
                                                   config: {
                                                      propertyToRender: "description",
                                                      renderOnNewLine: true
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
      }
   };
}

function getFollowUserListView() {
   return {
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
                           width: "64px",
                           widgets: [
                              {
                                 name: "alfresco/renderers/AvatarThumbnail"
                              }
                           ]
                        }
                     },
                     {
                        name: "alfresco/lists/views/layouts/Cell",
                        config: {
                           additionalCssClasses: "mediumpad",
                           widgets: [
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "firstName",
                                    renderSize: "large"
                                 }
                              },
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "lastName",
                                    renderSize: "large"
                                 }
                              },
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "userName",
                                    renderedValuePrefix: "(",
                                    renderedValueSuffix: ")"
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

function getFollowingTab() {
   return {
      name: "alfresco/layout/VerticalWidgets",
      title: "I'm following",
      config: {
         widgets: [
            {
               name: "alfresco/lists/AlfList",
               config: {
                  pubSubScope: "FOLLOWING_",
                  waitForPageWidgets: false,
                  loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                  loadDataPublishPayload: {
                     url: "api/subscriptions/{userName}/following"
                  },
                  itemsProperty: "people",
                  widgets: [
                     getFollowUserListView()
                  ]
               }
            }
         ]
      }
   };
}

function getFollowersTab() {
   return {
      name: "alfresco/layout/VerticalWidgets",
      title: "Following Me",
      config: {
         widgets: [
            {
               name: "alfresco/lists/AlfList",
               config: {
                  pubSubScope: "FOLLOWERS_",
                  waitForPageWidgets: false,
                  loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                  loadDataPublishPayload: {
                     url: "api/subscriptions/{userName}/followers"
                  },
                  itemsProperty: "people",
                  widgets: [
                     getFollowUserListView()
                  ]
               }
            }
         ]
      }
   };
}

function getUserProfileNotificationsTab() {
   return {
      name: "alfresco/layout/VerticalWidgets",
      title: "Notifications",
      config: {
         widgets: [
            {
               name: "alfresco/forms/Form",
               config: {
                  okButtonPublishTopic: "ALF_CRUD_CREATE",
                  okButtonPublishLabel: "OK",
                  okButtonPublishGlobal: true,
                  okButtonPublishPayload: {
                     url: "components/profile/user-notifications",
                     urlType: "SHARE"
                  },
                  showCancelButton: false,
                  // This form might seem strange at first glance!...
                  // The displayed checkbox shows the actual property which represents
                  // *disabled* and NOT enabled... so the on/off values are inverted...
                  // ...The REST API requires entirely different values to be set
                  // so to work around this problem we have a hidden field that auto-sets
                  // its value based on the changing state of the visible checkbox
                  widgets: [
                     {
                        name: "alfresco/forms/controls/CheckBox",
                        config: {
                           fieldId: "DISPLAYED_CHECKBOX",
                           label: "E-mail notification feed",
                           value: "{emailFeedDisabled}",
                           onValue: false,
                           offValue: true
                        }
                     },
                     {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "HIDDEN_CHECKBOX",
                           name: "user-notifications-email",
                           autoSetConfig: [
                              {
                                 rulePassValue: "on",
                                 ruleFailValue: "off",
                                 rules: [
                                    {
                                       targetId: "DISPLAYED_CHECKBOX",
                                       is: [true]
                                    }
                                 ]
                              }
                           ],
                           visibilityConfig: {
                              initialValue: false
                           }
                        }
                     }
                  ]
               }
            }
         ]
      }
   };
}

function getUserProfileCell() {
   return {
      name: "alfresco/lists/views/layouts/CellContainer",
      config: {
         minHeight: 125,
         publishTopic: "EXPAND",
         publishPayloadType: "PROCESS",
         publishPayloadModifiers: ["processCurrentItemTokens", "setCurrentItem"],
         publishPayloadItemMixin: true,
         publishPayload: {
            widgets: [
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "{displayName}",
                     widgets: [
                        {
                           name: "alfresco/layout/AlfTabContainer",
                           config: {
                              currentItem: "___AlfCurrentItem",
                              widgets: [
                                 getUserProfileInfoTab(),
                                 getUserProfileSitesTab(),
                                 getUserProfileRecentlyAddedTab(),
                                 getUserProfileRecentlyModifiedTab(),
                                 getFollowingTab(),
                                 getFollowersTab(),
                                 getUserProfileNotificationsTab()
                              ]
                           }
                        }
                     ]
                  }
               }
            ]
         },
         widgets: [
            {
               name: "alfresco/layout/HorizontalWidgets",
               config: {
                  widgets: [
                     {
                        widthPx: 120,
                        name: "alfresco/renderers/AvatarThumbnail"
                     },
                     {
                        name: "alfresco/layout/VerticalWidgets",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "displayName",
                                    renderSize: "large",
                                    renderOnNewLine: true
                                 }
                              },
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "jobtitle",
                                    renderOnNewLine: true
                                 }
                              },
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "organization",
                                    renderOnNewLine: true
                                 }
                              },
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "location",
                                    renderOnNewLine: true
                                 }
                              }
                           ]
                        }
                     }
                  ]
               }
            },
            {
               name: "alfresco/renderers/Property",
               config: {
                  propertyToRender: "persondescription",
                  renderOnNewLine: true
               }
            }
         ]
      }
   };
}

function getUserProfilesList() {
   return {
      name: "alfresco/lists/AlfFilteredList",
      config: {
         useHash: true,
         loadDataPublishTopic: "ALF_GET_USERS",
         filteringTopics: ["_valueChangeOf_FILTER"],
         widgetsForFilters: [{
           name: "alfresco/forms/controls/TextBox",
           config: {
             fieldId: "FILTER",
             name: "filter",
             placeHolder: "Enter filter text...",
             label: "Name"
           }
         }],
         widgets: [
            {
               name: "alfresco/documentlibrary/views/AlfGalleryView",
               config: {
                  enableHighlighting: true,
                  itemKeyProperty: "userName",
                  expandTopics: ["EXPAND"],
                  widgets: [
                     getUserProfileCell()
                  ]
               }
            }
         ]
      }
   };
}

function getUserProfileWidgets() {
   return {
      name: "alfresco/layout/VerticalWidgets",
      config: {
         style: {
            marginTop: "10px"
         },
         widgets: [
            getUserProfilesPaginator(),
            getUserProfilesList()
         ]
      }
   };
}