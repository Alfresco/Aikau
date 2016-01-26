<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/AlfList.html",
   services: ["alfresco/services/DocumentService"],
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
