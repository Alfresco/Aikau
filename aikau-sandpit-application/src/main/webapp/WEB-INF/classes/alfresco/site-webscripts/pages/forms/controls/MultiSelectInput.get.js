<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/MultiSelect.html",
   services: ["alfresco/services/TagService"],
   mockXhrWidgets: [
      {
         name: "sandpit/mockdata/MultiSelectInputMockXhr"
      }
   ],
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            {
               name: "alfresco/forms/controls/MultiSelectInput",
               config: {
                  label: "Sweets (fixed options)",
                  name: "sweets",
                  width: "300px",
                  value: "foam_strawberries",
                  optionsConfig: {
                     fixed: [
                        {
                           name: "Foam Strawberries",
                           label: "Foam Strawberries",
                           value: "foam_strawberries"
                        },
                        {
                           name: "Sherbert Lemons",
                           label: "Sherbert Lemons",
                           value: "sherbert_lemons"
                        },
                        {
                           name: "White Chocolate Mice",
                           label: "White Chocolate Mice",
                           value: "white_chocolate_mice"
                        },
                        {
                           name: "Refreshers",
                           label: "Refreshers",
                           value: "refreshers"
                        },
                        {
                           name: "Flying Saucers",
                           label: "Flying Saucers",
                           value: "flying_saucers"
                        }
                     ]
                  }
               }
            }
         ]
      },
      {
         title: "example2.title",
         description: "example2.description",
         model: [
            {
               name: "alfresco/forms/controls/MultiSelectInput",
               config: {
                  label: "Tags",
                  name: "tags",
                  width: "400px",
                  optionsConfig: {
                     queryAttribute: "name",
                     valueAttribute: "nodeRef",
                     labelAttribute: "name",
                     publishTopic: "ALF_RETRIEVE_CURRENT_TAGS",
                     publishPayload: {
                        resultsProperty: "response.data.items"
                     }
                  }
               }
            }
         ]
      }
   ]
});