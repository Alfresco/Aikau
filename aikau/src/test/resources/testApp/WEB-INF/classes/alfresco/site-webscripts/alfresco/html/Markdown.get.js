/* global msg*/
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
         id: "FORM",
         name: "alfresco/forms/Form",
         config: {
            okButtonPublishTopic: "UPDATE_MARKDOWN",
            okButtonPublishGlobal: true,
            okButtonLabel: "Render Markdown",
            showCancelButton: false,
            widgets: [
               {
                  id: "TEXTAREA",
                  name: "alfresco/forms/controls/TextArea",
                  config: {
                     name: "markdown",
                     label: "Markdown",
                     description: "Enter some markdown to render",
                     value: msg.get("markdown.example")
                  }
               }
            ]
         }
      },
      {
         id: "MARKDOWN",
         name: "alfresco/html/Markdown",
         config: {
            markdown: "# H1\n## H2",
            subscriptionTopics: ["UPDATE_MARKDOWN"]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};