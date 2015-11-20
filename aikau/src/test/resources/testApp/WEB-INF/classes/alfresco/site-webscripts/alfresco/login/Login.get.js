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
            defaultLoginPage: "tp/ws/Index"
         }
      },
      "alfresco/services/NavigationService"
   ],
   widgets:[
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/ClassicWindow",
                  widthPx: 400,
                  config: {
                     title: "Login",
                     additionalCssClasses: "bottomBorderRadius shadow",
                     widgets: [
                        {
                           name: "alfresco/forms/Form",
                           id: "LOGIN_FORM",
                           config: {
                              okButtonLabel: "Login",
                              okButtonPublishTopic: "ALF_DOLOGIN",
                              okButtonPublishGlobal: true,
                              okButtonPublishRevertSecs: 2,
                              okButtonSubmitsToHiddenIframe: true,
                              showCancelButton: false,
                              widgets: [
                                 {
                                    name: "alfresco/forms/controls/TextBox",
                                    config: {
                                       name: "successUrl",
                                       value: successUrl,
                                       visibilityConfig: {
                                          initialValue: false
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/forms/controls/TextBox",
                                    id: "LOGIN_USERNAME",
                                    config: {
                                       name: "username",
                                       label: "Username",
                                       placeHolder: "Username",
                                       description: "Your Alfresco user name",
                                       autocomplete: "username",
                                       value: context.properties["alfLastUsername"],
                                       requirementConfig: {
                                          initialValue: true
                                       }
                                    }
                                 },
                                 {
                                    name: "alfresco/forms/controls/Password",
                                    id: "LOGIN_PASSWORD",
                                    config: {
                                       name: "password",
                                       label: "Password",
                                       placeHolder: "Password",
                                       autocomplete: "current-password",
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
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};