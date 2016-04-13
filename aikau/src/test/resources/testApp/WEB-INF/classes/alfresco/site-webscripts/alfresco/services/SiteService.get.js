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
         name: "alfresco/services/SiteService",
         config: {
            userHomePage: "home",
            legacyMode: false
         }
      },
      "alfresco/services/DialogService",
      "alfresco/services/NotificationService",
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/buttons/AlfButton",
         id: "CREATE_SITE",
         config: {
            label: "Create Site",
            publishTopic: "ALF_CREATE_SITE"
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "EDIT_SITE",
         config: {
            label: "Edit Site",
            publishTopic: "ALF_EDIT_SITE",
            publishPayload: {
               site: "swsdp"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "EDIT_MODERATED_SITE",
         config: {
            label: "Edit Moderated Site",
            publishTopic: "ALF_EDIT_SITE",
            publishPayload: {
               site: "site2"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "BECOME_SITE_MANAGER",
         config: {
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
         id: "BECOME_SITE_MANAGER_PAGE_RELOAD",
         config: {
            label: "Become Site Manager (reload page)",
            publishTopic: "ALF_BECOME_SITE_MANAGER",
            publishPayload: {
               site: "swsdp",
               role: "SiteCollaborator",
               reloadPage: true
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "REQUEST_SITE_MEMBERSHIP",
         config: {
            label: "Request Site Membership",
            publishTopic: "ALF_REQUEST_SITE_MEMBERSHIP",
            publishPayload: {
               site: "swsdp",
               user: "admin@alfresco.com",
               role: "SiteCollaborator",
               comments: "Just for fun"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "REQUEST_SITE_MEMBERSHIP_ALREADY_PENDING",
         config: {
            label: "Request Site Membership (Already pending)",
            publishTopic: "ALF_REQUEST_SITE_MEMBERSHIP",
            publishPayload: {
               site: "swsdp",
               user: "admin",
               role: "SiteCollaborator",
               comments: "Request pending"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "REQUEST_SITE_MEMBERSHIP_ERROR",
         config: {
            label: "Request Site Membership (Other error)",
            publishTopic: "ALF_REQUEST_SITE_MEMBERSHIP",
            publishPayload: {
               site: "swsdp",
               user: "admin",
               role: "SiteCollaborator",
               comments: "Error"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "CANCEL_PENDING_REQUEST",
         config: {
            label: "Cancel pending join-site request",
            publishTopic: "ALF_CANCEL_JOIN_SITE_REQUEST",
            publishPayload: {
               siteId: "my-site",
               siteTitle: "My Site",
               pendingInvite: {
                  id: "foo"
               }
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "LEAVE_SITE",
         config: {
            label: "Leave Site",
            publishTopic: "ALF_LEAVE_SITE",
            publishPayload: {
               site: "swsdp",
               user: "admin@alfresco.com"
            }
         }
      },
      {
         name: "aikauTesting/mockservices/SiteMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};