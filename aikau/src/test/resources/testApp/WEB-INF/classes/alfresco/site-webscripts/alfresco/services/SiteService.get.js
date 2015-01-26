model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true
            }
         }
      },
      {
         name: "alfresco/services/SiteService"
      },
      {
         name: "alfresco/dialogs/AlfDialogService"
      },
      {
         name: "alfresco/services/SiteService",
         config: {
            pubSubScope: "NORMAL_USER_"
         }
      },
      {
         name: "alfresco/services/SiteService",
         config: {
            pubSubScope: "ADMIN_USER_"
         }
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets:[

      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "CREATE_SITE",
            label: "Create Site",
            publishTopic: "ALF_CREATE_SITE"
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "EDIT_SITE",
            label: "Edit Site",
            publishTopic: "ALF_EDIT_SITE",
            publishPayload: {
               site: "swsdp"
            }
         }
      },

      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "GET_SITE_DETAILS",
            label: "Get Site Details",
            publishTopic: "ALF_GET_SITE_DETAILS",
            publishPayload: {
               site: "swsdp",
               responseTopic: "ALF_PROCESS_SITE_DETAILS"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "GET_SITE_DETAILS_BAD1",
            label: "Get Site Details Bad 1",
            publishTopic: "ALF_GET_SITE_DETAILS"
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "GET_SITE_DETAILS_BAD2",
            label: "Get Site Details Bad 2",
            publishTopic: "ALF_GET_SITE_DETAILS",
            publishPayload: {
               site: "swsdp"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "GET_SITE_DETAILS_BAD3",
            label: "Get Site Details Bad 3",
            publishTopic: "ALF_GET_SITE_DETAILS",
            publishPayload: {
               responseTopic: "ALF_PROCESS_SITE_DETAILS"
            }
         }
      },


      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "ADD_FAVOURITE_SITE",
            label: "Add Favourite Site",
            publishTopic: "ALF_ADD_FAVOURITE_SITE",
            publishPayload: {
               site: "swsdp",
               user: "admin"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "ADD_FAVOURITE_SITE_BAD1",
            label: "Add Favourite Site Bad 1",
            publishTopic: "ALF_ADD_FAVOURITE_SITE",
            publishPayload: {
               user: "admin"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "ADD_FAVOURITE_SITE_BAD2",
            label: "Add Favourite Site Bad 2",
            publishTopic: "ALF_ADD_FAVOURITE_SITE",
            publishPayload: {
               site: "swsdp"
            }
         }
      },


      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REMOVE_FAVOURITE_SITE",
            label: "Remove Favourite Site",
            publishTopic: "ALF_REMOVE_FAVOURITE_SITE",
            publishPayload: {
               site: "swsdp",
               user: "admin"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REMOVE_FAVOURITE_SITE_BAD1",
            label: "Remove Favourite Site Bad 1",
            publishTopic: "ALF_REMOVE_FAVOURITE_SITE",
            publishPayload: {
               site: "swsdp"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REMOVE_FAVOURITE_SITE_BAD2",
            label: "Remove Favourite Site Bad 2",
            publishTopic: "ALF_REMOVE_FAVOURITE_SITE",
            publishPayload: {
               user: "admin"
            }
         }
      },


      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "GET_SITE_MEMBERSHIPS",
            label: "Get Site Memberships",
            publishTopic: "ALF_GET_SITE_MEMBERSHIPS",
            publishPayload: {
               site: "swsdp",
               responseTopic: "ALF_PROCESS_SITE_MEMBERSHIPS"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "GET_SITE_MEMBERSHIPS_BAD1",
            label: "Get Site Memberships Bad 1",
            publishTopic: "ALF_GET_SITE_MEMBERSHIPS",
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "GET_SITE_MEMBERSHIPS_BAD2",
            label: "Get Site Memberships Bad 2",
            publishTopic: "ALF_GET_SITE_MEMBERSHIPS",
            publishPayload: {
               site: "swsdp"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "GET_SITE_MEMBERSHIPS_BAD3",
            label: "Get Site Memberships Bad 3",
            publishTopic: "ALF_GET_SITE_MEMBERSHIPS",
            publishPayload: {
               responseTopic: "ALF_PROCESS_SITE_MEMBERSHIPS"
            }
         }
      },


      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "UPDATE_SITE_DETAILS",
            label: "Update Site Details",
            publishTopic: "ALF_UPDATE_SITE_DETAILS",
            publishPayload: {
               shortName: "swsdp",
               responseTopic: "ALF_PROCESS_UPDATE_SITE_DETAILS"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "UPDATE_SITE_DETAILS_BAD1",
            label: "Update Site Details Bad 1",
            publishTopic: "ALF_UPDATE_SITE_DETAILS",
            publishPayload: {
               responseTopic: "ALF_PROCESS_UPDATE_SITE_DETAILS"
            }
         }
      },

      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "BECOME_SITE_MANAGER",
            label: "Become Site Manager",
            publishTopic: "ALF_BECOME_SITE_MANAGER",
            publishPayload: {
               site: "swsdp",
               role: "SiteCollaborator",
               user: "admin"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "BECOME_SITE_MANAGER_BAD1",
            label: "Become Site Manager Bad 1",
            publishTopic: "ALF_BECOME_SITE_MANAGER",
            publishPayload: {
               role: "SiteCollaborator",
               user: "admin"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "BECOME_SITE_MANAGER_BAD2",
            label: "Become Site Manager Bad 2",
            publishTopic: "ALF_BECOME_SITE_MANAGER",
            publishPayload: {
               site: "swsdp",
               user: "admin"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "BECOME_SITE_MANAGER_BAD3",
            label: "Become Site Manager Bad 3",
            publishTopic: "ALF_BECOME_SITE_MANAGER",
            publishPayload: {
               site: "swsdp",
               role: "SiteCollaborator"
            }
         }
      },

      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REQUEST_SITE_MEMBERSHIP",
            label: "Request Site Membership",
            publishTopic: "ALF_REQUEST_SITE_MEMBERSHIP",
            publishPayload: {
               site: "swsdp",
               user: "admin",
               role: "SiteCollaborator",
               comments: "Just for fun"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REQUEST_SITE_MEMBERSHIP_BAD1",
            label: "Request Site Membership Bad 1",
            publishTopic: "ALF_REQUEST_SITE_MEMBERSHIP",
            publishPayload: {
               user: "admin",
               role: "SiteCollaborator",
               comments: "Just for fun"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REQUEST_SITE_MEMBERSHIP_BAD2",
            label: "Request Site Membership Bad 2",
            publishTopic: "ALF_REQUEST_SITE_MEMBERSHIP",
            publishPayload: {
               site: "swsdp",
               role: "SiteCollaborator",
               comments: "Just for fun"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REQUEST_SITE_MEMBERSHIP_BAD3",
            label: "Request Site Membership Bad 3",
            publishTopic: "ALF_REQUEST_SITE_MEMBERSHIP",
            publishPayload: {
               site: "swsdp",
               user: "admin",
               comments: "Just for fun"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REQUEST_SITE_MEMBERSHIP_BAD4",
            label: "Request Site Membership Bad 4",
            publishTopic: "ALF_REQUEST_SITE_MEMBERSHIP",
            publishPayload: {
               site: "swsdp",
               user: "admin",
               role: "SiteCollaborator"
            }
         }
      },

      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "GET_RECENT_SITES",
            label: "Get Recent Sites",
            publishTopic: "ALF_GET_RECENT_SITES",
            publishPayload: {
               alfResponseTopic: "ALF_PROCESS_RECENT_SITES"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "GET_RECENT_SITES_BAD1",
            label: "Get Recent Sites Bad 1",
            publishTopic: "ALF_GET_RECENT_SITES",
         }
      },

      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "GET_FAVOURITE_SITES",
            label: "Get Favourite Sites",
            publishTopic: "ALF_GET_FAVOURITE_SITES",
            publishPayload: {
               alfResponseTopic: "ALF_PROCESS_FAVOURITE_SITES"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "GET_FAVOURITE_SITES_BAD1",
            label: "Get Favourite Sites Bad 1",
            publishTopic: "ALF_GET_FAVOURITE_SITES",
         }
      },

      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "DELETE_SITE",
            label: "Delete Site",
            publishTopic: "ALF_DELETE_SITE",
            publishPayload: {
               document: {
                  shortName: "swsdp"
               }
            }
         }
      },

      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "JOIN_SITE",
            label: "Join Site",
            publishTopic: "ALF_JOIN_SITE",
            publishPayload: {
               site: "swsdp",
               user: "admin",
               role: "SiteCollaborator"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "JOIN_SITE_BAD1",
            label: "Join Site Bad 1",
            publishTopic: "ALF_JOIN_SITE",
            publishPayload: {
               user: "admin",
               role: "SiteCollaborator"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "JOIN_SITE_BAD2",
            label: "Join Site Bad 2",
            publishTopic: "ALF_JOIN_SITE",
            publishPayload: {
               site: "swsdp",
               role: "SiteCollaborator"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "JOIN_SITE_BAD3",
            label: "Join Site Bad 3",
            publishTopic: "ALF_JOIN_SITE",
            publishPayload: {
               site: "swsdp",
               user: "admin"
            }
         }
      },

      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "LEAVE_SITE",
            label: "Leave Site",
            publishTopic: "ALF_LEAVE_SITE",
            publishPayload: {
               site: "swsdp",
               user: "admin"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "LEAVE_SITE_BAD1",
            label: "Leave Site Bad 1",
            publishTopic: "ALF_LEAVE_SITE",
            publishPayload: {
               user: "admin"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "LEAVE_SITE_BAD2",
            label: "Leave Site Bad 2",
            publishTopic: "ALF_LEAVE_SITE",
            publishPayload: {
               site: "swsdp"
            }
         }
      },

      {
         id: "SITES_LIST",
         name: "alfresco/documentlibrary/AlfSitesList",
         config: {
            dataRequestTopic: "ALF_GET_SITES",
            pubSubScope: "NORMAL_USER_",
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfDocumentListView",
                  config: {
                     itemKey: "shortName",
                     widgetsForHeader: [
                        {
                           name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                           config: {
                              label: "Site"
                           }
                        }
                     ],
                     widgets: [
                        {
                           name: "alfresco/documentlibrary/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/documentlibrary/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "title"
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
      },
      {
         id: "ADMIN_SITES_LIST",
         name: "alfresco/documentlibrary/AlfSitesList",
         config: {
            dataRequestTopic: "ALF_GET_SITES_ADMIN",
            pubSubScope: "ADMIN_USER_",
            widgets: [
               {
                  name: "alfresco/documentlibrary/views/AlfDocumentListView",
                  config: {
                     itemKey: "shortName",
                     widgetsForHeader: [
                        {
                           name: "alfresco/documentlibrary/views/layouts/HeaderCell",
                           config: {
                              label: "Site"
                           }
                        }
                     ],
                     widgets: [
                        {
                           name: "alfresco/documentlibrary/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/documentlibrary/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "title"
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
      },
      {
         name: "aikauTesting/mockservices/SiteMockXhr"
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};