<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "alfresco/lists/AlfList",
   description: "This is the most basic list. It provides the ability to render data in multiple views but offers no sorting, filtering, pagination or hashing capabilities.",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/AlfList.html",
   services: ["alfresco/services/DocumentService"],
   mockXhrWidgets: [
      {
         name: "alfresco/testing/NodesMockXhr"
      }
   ],
   examples: [
      {
         title: "List with a single HTML list view using mock data",
         description: "",
         model: [
            {
               name: "alfresco/lists/AlfList",
               config: {
                  widgets: [
                     {
                        name: "alfresco/lists/views/HtmlListView"
                     }
                  ]
               }
            }
         ]
      }
   ]
});
