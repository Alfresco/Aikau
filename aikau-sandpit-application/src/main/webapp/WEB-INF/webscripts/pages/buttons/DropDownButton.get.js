<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/DropDownButton.html",
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            {
               name: "alfresco/buttons/DropDownButton",
               config: {
                  hideDropDownTopics: ["SAVE"],
                  label: "Show drop down",
                  widgets: [
                     {
                        name: "alfresco/forms/Form",
                        config: {
                           okButtonLabel: "Save",
                           okButtonPublishTopic: "SAVE",
                           okButtonPublishGlobal: true,
                           widgets: [
                              {
                                 name: "alfresco/forms/controls/TextBox",
                                 config: {
                                    label: "Name",
                                    name: "name",
                                    placeHolder: "Enter a name...",
                                    value: ""
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
   ]
});
