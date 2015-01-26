model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      // Clicking this button will ensure that LOGO1 is displayed...
      {  
         id: "TEST_NON_STRICT_1",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Test Non-Strict Mode",
            publishTopic: "LOGO1",
            publishPayload: {
               value: "DUMMY"
            }
         }
      },
      // Clicking this button should ensure that LOGO2 is still displayed...
      // It relies on the currentItem property matching the publishedPayload attribute...
      {  
         id: "HIDE_LOGO_2",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Test CurrentItem Data",
            publishTopic: "LOGO2",
            publishPayload: {
               value: {
                  data: "SHOW"
               }
            }
         }
      },
      // Clicking this should hide LOGO3 (which is configured with invisibilityConfig)...
      {
         id: "HIDE_LOGO_3",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Test Invisibility Config (hide)",
            publishTopic: "LOGO3",
            publishPayload: {
               value: "HIDE"
            }
         }
      },
      // Clicking this should reveal LOGO3
      {
         id: "SHOW_LOGO_3",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Test Invisibility Config (show)",
            publishTopic: "LOGO3",
            publishPayload: {
               value: "SHOW"
            }
         }
      },
      // This widget should NOT be hidden when the rule fails (because strict is false)
      {
         id: "LOGO1",
         name: "alfresco/logo/Logo",
         config: {
            logoClasses: "alfresco-logo-only",
            visibilityConfig: {
               initialValue: true,
               rules: [
                  {
                     topic: "LOGO1",
                     attribute: "value",
                     is: ["SHOW"],
                     strict: false
                  }
               ]
            }
         }
      },
      // This widget should rely on the currentItem data to evaluate the rule...
      {
         id: "LOGO2",
         name: "alfresco/logo/Logo",
         config: {
            logoClasses: "surf-logo-small",
            currentItem:{
               data: {
                  test: "SHOW"
               }
            },
            visibilityConfig: {
               initialValue: true,
               rules: [
                  {
                     topic: "LOGO2",
                     attribute: "value.data",
                     is: ["data.test"],
                     useCurrentItem: true,
                     strict: true
                  }
               ]
            }
         }
      },
      // This should be initially displayed...
      {
         id: "LOGO3",
         name: "alfresco/logo/Logo",
         config: {
            logoClasses: "surf-logo-large",
            invisibilityConfig: {
               initialValue: false,
               rules: [
                  {
                     topic: "LOGO3",
                     attribute: "value",
                     is: ["HIDE"]
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};