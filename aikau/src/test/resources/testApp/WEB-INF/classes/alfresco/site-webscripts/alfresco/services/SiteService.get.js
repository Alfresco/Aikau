var siteService = {
   name: "alfresco/services/SiteService",
   config: {
      userHomePage: "/home",
      siteHomePage: "",
      legacyMode: false
   }
};

/* global page */
/* jshint sub:true */
if (page.url.args["sitePresets"])
{
   switch (page.url.args["sitePresets"]) {
      case "configured": 
         siteService.config.sitePresets = [{ label: "Custom", value: "custom_preset" } ];
         break;

      case "additional": 
         siteService.config.additionalSitePresets = [{ label: "Additional Custom", value: "custom_preset" } ];
         break;

      case "remove":
         siteService.config.additionalSitePresets = [{ label: "Additional Custom", value: "custom_preset" } ];
         siteService.config.sitePresetsToRemove = [ "site-dashboard" ];
         break;
   }
}

if (page.url.args["customize"] === "true")
{
   siteService.config.setCreateSiteDialogValueTopic = "UPDATE_CREATE_SITE_VALUES";
   siteService.config.widgetsForCreateSiteDialogOverrides = [
      {
         id: "FIRST",
         name: "alfresco/forms/controls/TextBox",
         targetPosition: "START",
         config: {
            fieldId: "FIRST_TB",
            label: "First",
            name: "tb1",
            description: "I should be the first form control"
         }
      },
      {
         id: "LAST",
         name: "alfresco/forms/controls/TextBox",
         targetPosition: "END",
         config: {
            fieldId: "LAST_TB",
            label: "Last",
            name: "tb2",
            description: "I should be the last form control"
         }
      },
      {
         id: "BEFORE",
         name: "alfresco/forms/controls/TextBox",
         targetId: "CREATE_SITE_FIELD_TITLE",
         targetPosition: "BEFORE",
         config: {
            fieldId: "BEFORE_TB",
            label: "Before",
            name: "tb3",
            description: "I should be before the site title field"
         }
      },
      {
         id: "AFTER",
         name: "alfresco/forms/controls/TextBox",
         targetId: "CREATE_SITE_FIELD_TITLE",
         targetPosition: "AFTER",
         config: {
            fieldId: "AFTER_TB",
            label: "After",
            name: "tb4",
            description: "I should be after the site title field"
         }
      },
      {
         id: "CREATE_SITE_FIELD_TITLE",
         name: "alfresco/forms/controls/TextArea",
         config: {
            label: "Updated",
            description: "Updated title, description and control (for site title)"
         }
      },
      {
         id: "CREATE_SITE_FIELD_DESCRIPTION",
         remove: true
      },
      {
         id: "CREATE_SITE_FIELD_VISIBILITY",
         replace: true,
         name: "alfresco/forms/controls/RadioButtons",
         config: {
            fieldId: "VISIBILITY",
            label: "How am I seen?",
            name: "visibility",
            optionsConfig: {
               fixed: [
                  { 
                     label: "By everyone", 
                     value: "PUBLIC" 
                  },
                  { 
                     label: "By Some", 
                     value: "MODERATED" 
                  }
               ]
            }
         }
      }
   ];
}

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
      siteService,
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