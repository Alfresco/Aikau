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
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/layout/AbsoluteCenterWidgets",
         config: {
            width: "400",
            widgets: [
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     additionalCssClasses: "bottomBorderRadius shadow",
                     title: "Login",
                     widgets: [
                        {
                           name: "alfresco/forms/Form",
                           config: {
                              okButtonLabel: "Login",
                              okButtonPublishTopic: "ALF_DOLOGIN",
                              okButtonPublishGlobal: true,
                              showCancelButton: false,
                              widgets: [
                                 {
                                    name: "alfresco/forms/controls/DojoValidationTextBox",
                                    config: {
                                       name: "successUrl",
                                       value: "",
                                       visibilityConfig: {
                                          initialValue: false
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/forms/controls/DojoValidationTextBox",
                                    config: {
                                       name: "username",
                                       label: "User Name",
                                       description: "Your Alfresco user name",
                                       value: "",
                                       requirementConfig: {
                                          initialValue: true
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/forms/controls/Password",
                                    config: {
                                       name: "password",
                                       label: "Password",
                                       description: "The password associated with your Alfresco user name",
                                       requirementConfig: {
                                          initialValue: true
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
   ]
};