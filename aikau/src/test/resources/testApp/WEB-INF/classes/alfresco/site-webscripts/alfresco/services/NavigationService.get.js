/* global RequestParameters */
var label;
var posted = RequestParameters.get("test");
if (posted)
{
   label = {
      id: "POSTED",
      name: "alfresco/html/Label",
      config: {
         label: posted
      }
   };
}
else
{
   label = {
      id: "NOTHING_POSTED",
      name: "alfresco/html/Label",
      config: {
         label: "Nothing posted"
      }
   };
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
      "alfresco/services/NavigationService"
   ],
   widgets: [
      label,
      {
         id: "SET_HASH",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Set a hash",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "#hash1=bob&hash2=ted",
               type: "HASH",
               target: "CURRENT"
            }
         }
      },
      {
         id: "POST_TO_CURRENT_PAGE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Post to current page",
            publishTopic: "ALF_POST_TO_PAGE",
            publishPayload: {
               url: "tp/ws/NavigationService?same=true",
               type: "PAGE_RELATIVE",
               target: "CURRENT",
               parameters: {
                  test: "success"
               }
            }
         }
      },
      {
         id: "POST_TO_NEW_PAGE",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Post to new page",
            publishTopic: "ALF_POST_TO_PAGE",
            publishPayload: {
               url: "tp/ws/NavigationService?new=true",
               type: "PAGE_RELATIVE",
               target: "NEW",
               parameters: {
                  test: "success"
               }
            }
         }
      },
      {
         id: "BACK_TO_ORIGINAL_URL",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Reload original page",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            publishPayload: {
               url: "tp/ws/NavigationService",
               type: "PAGE_RELATIVE",
               target: "CURRENT"
            }
         }
      },
      {
         name: "aikauTesting/mockservices/NavigationServiceMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};