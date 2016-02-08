<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/module-alfresco_renderers_Link.html",
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            {
               name: "alfresco/renderers/Link",
               config: {
                  currentItem: {
                     data: {
                        value: "test"
                     }
                  },
                  linkLabel: "Click Me!",
                  publishTopic: "CLICKED",
                  publishPayloadType: "PROCESS",
                  publishPayloadModifiers: ["processCurrentItemTokens"],
                  publishPayload: {
                     value: "{data.value}"
                  }
               }
            }
         ]
      }
   ]
});