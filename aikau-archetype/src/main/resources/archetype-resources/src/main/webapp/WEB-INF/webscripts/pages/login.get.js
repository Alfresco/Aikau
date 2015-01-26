var successUrl = context.properties["alfRedirectUrl"];
if (successUrl === null)
{
   successUrl = url.context;
}
successUrl = successUrl.replace("?error=true","");
successUrl = successUrl.replace("&error=true","");

model.jsonModel = {
   services: [
      {
         name: "alfresco/services/NavigationService"
      },
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
      {
         name: "alfresco/services/LoginService",
         config: {
            defaultLoginPage: "ap/ws/home"
         }
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         name: "alfresco/layout/AbsoluteCenterWidgets",
         config: {
            width: 400,
            widgets: [
               {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Login",
                     additionalCssClasses: "bottomBorderRadius shadow",
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
                                       value: successUrl,
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
                                       value: context.properties["alfLastUsername"],
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