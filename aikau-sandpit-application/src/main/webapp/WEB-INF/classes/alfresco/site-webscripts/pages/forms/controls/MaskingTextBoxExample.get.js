<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/MaskingTextBox.html",
   mockXhrWidgets: [
      {
         name: "alfresco/testing/NodesMockXhr"
      }
   ],
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            {
               name: "alfresco/forms/Form",
               config: {
                  pubSubScope: "FORM",
                  okButtonPublishTopic: "SAVE",
                  widgets: [
                     {
                        name: "alfresco/forms/controls/TextBox",
                        config: {
                           fieldId: "TEXTBOX",
                           label: "Seed value",
                           description: "The value of this form control is used to set that of the MaskedTextBox",
                           name: "text"
                        }
                     },
                     {
                        name: "alfresco/forms/controls/MaskingTextBox",
                        config: {
                           fieldId: "MASKEDTEXTBOX",
                           targetId: "TEXTBOX",
                           label: "Resulting value",
                           description: "This value will be automatically set from the value of the other TextBox",
                           name: "maskedText",
                           replacements: [
                              {
                                 regex: "[^a-z0-9\\-\\s]",
                                 flags: "gi"
                              },
                              {
                                 regex: "\\s+",
                                 replacement: "-",
                                 flags: "g"
                              }
                           ],
                           trim: true,
                           toLowerCase: true
                        }
                     }
                  ]
               }
            }
         ]
      }
   ]
});