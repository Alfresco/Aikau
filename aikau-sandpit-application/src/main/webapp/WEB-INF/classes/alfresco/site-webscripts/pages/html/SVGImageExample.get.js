<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/SVGImage.html",
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            {
               name: "alfresco/html/SVGImage",
               config: {
                  title: "Pencil",
                  description: "An image of a pencil",
                  height: 600,
                  symbolId: "pencil",
                  source: "alfresco/html/svg/test.svg",
                  publishTopic: "IMAGE1_TOPIC"
               }
            }
         ]
      }
   ]
});