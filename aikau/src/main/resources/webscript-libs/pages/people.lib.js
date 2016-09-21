/* global user */
function getUserProfileServices() {
   return [
      {
         id: "CRUD_SERVICE",
         name: "alfresco/services/CrudService"
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
                  width: "500px",
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
                                                      dimensions: {
                                                         w: "64px",
                                                         h: "64px",
                                                         margin: "3px"
                                                      },
                                                      itemKey: "nodeRef",
                                                      hasShadow: true,
                                                      showDocumentPreview: true
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
                                       },
                                       {
                                          name: "alfresco/lists/views/layouts/Cell",
                                          config: {
                                             width: "70px",
                                             additionalCssClasses: "mediumpad",
                                             widgets: [
                                                {
                                                   name: "alfresco/renderers/XhrActions",
                                                   config: {
                                                      renderFilter: [
                                                         {
                                                            property: "type",
                                                            values: ["document","folder"]
                                                         }
                                                      ],
                                                      onlyShowOnHover: true,
                                                      filterActions: true,
                                                      allowedActions: [
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
                                                         "document-cancel-editing",
                                                         "document-approve",
                                                         "document-reject",
                                                         "document-manage-aspects"
                                                      ]
                                                   }
                                                },
                                                {
                                                   name: "alfresco/renderers/XhrActions",
                                                   config: {
                                                      renderFilter: [
                                                         {
                                                            property: "type",
                                                            values: ["document","folder"],
                                                            negate: true
                                                         }
                                                      ],
                                                      onlyShowOnHover: true,
                                                      filterActions: true,
                                                      allowedActions: [
                                                         "document-delete"
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
                  loadDataPublishTopic: "ALF_GET_USER_SITES",
                  loadDataPublishPayload: {
                     userName: "{userName}"
                  },
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
                                                },
                                                { 
                                                   name: "alfresco/renderers/Toggle",
                                                   config: {
                                                      renderFilter: [
                                                         {
                                                            comparator: "currentUser",
                                                            value: "{userName}"
                                                         }
                                                      ],
                                                      propertyToRender: "activityFeedEnabled",
                                                      checkedValue: true,
                                                      onLabel: "Following actvity",
                                                      offLabel: "Follow activity",
                                                      onTooltip: "Disable activity feed for {0}",
                                                      offTooltip: "Enable activity feed for {0}",
                                                      tooltipIdProperty: "title",
                                                      toggleOnTopic: "ALF_ENABLE_SITE_ACTIVITY_FEED",
                                                      toggleOnPublishPayload: {
                                                         siteId: "{shortName}"
                                                      },
                                                      toggleOnPublishGlobal: true,
                                                      toggleOnPublishPayloadType: "PROCESS",
                                                      toggleOnPublishPayloadModifiers: ["processCurrentItemTokens"],
                                                      toggleOffTopic: "ALF_DISABLE_SITE_ACTIVITY_FEED",
                                                      toggleOffPublishPayload: {
                                                         siteId: "{shortName}"
                                                      },
                                                      toggleOffPublishGlobal: true,
                                                      toggleOffPublishPayloadType: "PROCESS",
                                                      toggleOffPublishPayloadModifiers: ["processCurrentItemTokens"]
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
                           width: "48px",
                           widgets: [
                              {
                                 name: "alfresco/renderers/AvatarThumbnail",
                                 config: {
                                    dimensions: {
                                       w: "48px",
                                       h: "48px",
                                       margin: "2px"
                                    }
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
      title: "Following",
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
      title: "Followers",
      config: {
         renderFilter: [
            {
               property: "userName",
               values: [user.name]
            }
         ],
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

function getUserProfileChangePasswordLink() {
   return {
      name: "alfresco/renderers/Link",
      config: {
         renderFilter: [
            {
               property: "userName",
               values: [user.name]
            }
         ],
         linkLabel: "Change Password",
         renderOnNewLine: true,
         publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
         publishPayload: {
            dialogId: "CHANGE_PASSWORD",
            dialogTitle: "Change Password",
            formSubmissionTopic: "ALF_CRUD_CREATE",
            formSubmissionPayloadMixin: {
               url: "components/profile/change-password",
               urlType: "SHARE",
               failureMessage: "Incorrect authentication details or not authorised to change password.",
               successMessage: "Password updated"
            },
            widgets: [
               {
                  name: "alfresco/forms/controls/Password",
                  config: {
                     fieldId: "OLD_PASSWORD",
                     label: "Current Password",
                     value: "",
                     name: "-oldpassword"
                  }
               },
               {
                  name: "alfresco/forms/controls/Password",
                  config: {
                     fieldId: "NEW_PASSWORD",
                     label: "New Password",
                     value: "",
                     name: "-newpassword1"
                  }
               },
               {
                  name: "alfresco/forms/controls/Password",
                  config: {
                     fieldId: "NEW_PASSWORD_CONFIRMATION",
                     label: "Confirm New Password",
                     value: "",
                     name: "-newpassword2",
                     confirmationTargetId: "NEW_PASSWORD"
                  }
               }
            ]
         }
      }
   };
}

function getUserProfileNotificationsTab() {
   return {
      name: "alfresco/layout/VerticalWidgets",
      title: "Notifications",
      config: {
         renderFilter: [
            {
               property: "userName",
               values: [user.name]
            }
         ],
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

function getUserProfileTrashcan() {
   return {
      name: "alfresco/layout/VerticalWidgets",
      title: "Trashcan",
      config: {
         renderFilter: [
            {
               property: "userName",
               values: [user.name]
            }
         ],
         widgets: [
            {
               name: "alfresco/lists/AlfFilteredList",
               config: {
                  pubSubScope: "TRASHCAN_",
                  useHash: false,
                  loadDataPublishTopic: "ALF_CRUD_GET_ALL",
                  loadDataPublishPayload: {
                     url: "api/archive/workspace/SpacesStore?maxItems=51"
                  },
                  itemsProperty: "data.deletedNodes",
                  filteringTopics: ["_valueChangeOf_FILTER"],
                  widgetsForFilters: [{
                    name: "alfresco/forms/controls/TextBox",
                    config: {
                      fieldId: "FILTER",
                      name: "nf",
                      placeHolder: "Enter search text...",
                      label: "Search"
                    }
                  }],
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
                                             widgets: [
                                                {
                                                   name: "alfresco/renderers/Property",
                                                   config: {
                                                      propertyToRender: "name",
                                                      renderSize: "large",
                                                      renderOnNewLine: true
                                                   }
                                                },
                                                {
                                                   name: "alfresco/renderers/Date",
                                                   config: {
                                                      propertyToRender: "name",
                                                      modifiedDateProperty: "archivedDate",
                                                      modifiedByProperty: "firstName",
                                                      modifiedByLastNameProperty: "lastName",
                                                      modifiedByMessage:  "Deleted {0} by {1} {2}",
                                                      renderOnNewLine: true
                                                   }
                                                },
                                                {
                                                   name: "alfresco/renderers/Property",
                                                   config: {
                                                      propertyToRender: "displayPath",
                                                      deemphasized: true,
                                                      renderOnNewLine: true
                                                   }
                                                }
                                             ]
                                          }
                                       },
                                       {
                                          name: "alfresco/lists/views/layouts/Cell",
                                          config: {
                                             width: "70px",
                                             widgets: [
                                                {
                                                   name: "alfresco/renderers/Actions",
                                                   config: {
                                                     customActions: [
                                                         {
                                                            label: "Recover",
                                                            publishTopic: "ALF_CRUD_UPDATE",
                                                            publishPayloadType: "PROCESS",
                                                            publishPayloadModifiers: ["processCurrentItemTokens","convertNodeRefToUrl"],
                                                            publishPayload: {
                                                               url: "api/archive/{nodeRef}"
                                                            },
                                                            publishGlobal: true,
                                                            icon: "document-cloud-sync",
                                                            index: "10",
                                                            type: "javascript"

                                                         },
                                                         {
                                                            label: "Delete",
                                                            publishTopic: "ALF_CRUD_DELETE",
                                                            publishPayloadType: "PROCESS",
                                                            publishPayloadModifiers: ["processCurrentItemTokens","convertNodeRefToUrl"],
                                                            publishPayload: {
                                                               url: "api/archive/{nodeRef}",
                                                               requiresConfirmation: true,
                                                               confirmationTitle: "Delete",
                                                               confirmationPrompt: "This will permanently delete the item(s). Are you sure?",
                                                               confirmationButtonLabel: "Yes",
                                                               cancellationButtonLabel: "No"
                                                            },
                                                            publishGlobal: true,
                                                            icon: "document-delete",
                                                            index: "20",
                                                            type: "javascript"
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
      }
   };
}

function getUserProfileInfo() {
   return {
      name: "alfresco/layout/LeftAndRight",
      config: {
         widgetsLeft: [
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
                           renderSize: "large"
                        }
                     },
                     {
                        name: "alfresco/renderers/Property",
                        config: {
                           propertyToRender: "userName",
                           deemphasized: true,
                           renderedValuePrefix: "(",
                           renderedValueSuffix: ")"
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
                     },
                     getUserProfileChangePasswordLink()
                  ]
               }
            }
         ],
         widgetsRight: [
            { 
               name: "alfresco/renderers/Toggle",
               config: {
                  propertyToRender: "following",
                  checkedValue: true,
                  onLabel: "Following",
                  offLabel: "Follow",
                  onTooltip: "Stop following {0}",
                  offTooltip: "Start following {0}",
                  tooltipIdProperty: "displayName",
                  toggleOnTopic: "ALF_FOLLOW_USERS",
                  toggleOnPublishPayload: {
                     userNames: ["{userName}"]
                  },
                  toggleOnPublishGlobal: true,
                  toggleOnPublishPayloadType: "PROCESS",
                  toggleOnPublishPayloadModifiers: ["processCurrentItemTokens"],
                  toggleOffTopic: "ALF_UNFOLLOW_USERS",
                  toggleOffPublishPayload: {
                     userNames: ["{userName}"]
                  },
                  toggleOffPublishGlobal: true,
                  toggleOffPublishPayloadType: "PROCESS",
                  toggleOffPublishPayloadModifiers: ["processCurrentItemTokens"],
                  renderFilter: [
                     {
                        property: "userName",
                        values: [user.name],
                        negate: true
                     }
                  ]
               }
            }
         ]
      }
   };
}

function getUserProfileTabContainer() {
   return {
      name: "alfresco/layout/AlfTabContainer",
      config: {
         padded: true,
         currentItem: "___AlfCurrentItem",
         widgets: [
            getUserProfileInfoTab(),
            getUserProfileSitesTab(),
            getUserProfileRecentlyAddedTab(),
            getUserProfileRecentlyModifiedTab(),
            getFollowingTab(),
            getFollowersTab(),
            getUserProfileNotificationsTab(),
            getUserProfileTrashcan()
         ]
      }
   };
}

function getUserProfileCell() {
   return {
      name: "alfresco/lists/views/layouts/CellContainer",
      config: {
         minHeight: 140,
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
                        getUserProfileTabContainer()
                     ]
                  }
               }
            ]
         },
         widgets: [
            getUserProfileInfo(),
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
      name: "alfresco/lists/UserList",
      config: {
         useHash: true,
         filteringTopics: ["_valueChangeOf_FILTER"],
         widgetsForFilters: [{
           name: "alfresco/forms/controls/TextBox",
           config: {
             fieldId: "FILTER",
             name: "filter",
             placeHolder: "Search text...",
             label: "Search for People",
             description: "To search user profiles (by location, job title, or organization) include the profile property you're searching by, for example, \"location:London\", \"organization:Alfresco\", or \"jobtitle:Manager\"."
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

function getUserProfilesWidgets() {
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

function getUserProfileWidgets(data) {
   return {
      name: "alfresco/renderers/Item",
      config: {
         style: {
            padding: "10px"
         },
         loadItemPublishTopic: "ALF_GET_USER",
         loadItemPublishPayload: {
            userName: data.userName
         },
         itemProperty: "user",
         widgets: [
            getUserProfileInfo(),
            {
               name: "alfresco/renderers/Property",
               config: {
                  propertyToRender: "persondescription"
               }
            },
            getUserProfileTabContainer()
         ]
      }
   };
}
