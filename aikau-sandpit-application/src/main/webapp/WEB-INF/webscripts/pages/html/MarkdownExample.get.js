<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/Markdown.html",
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            {
               name: "alfresco/html/Markdown",
               config: {
                  markdown: "# H1\n## H2\n* bullet 1\n* bullet2"
               }
            }
         ]
      },
      {
         title: "example2.title",
         description: "example2.description",
         model: [
            {
               name: "alfresco/html/Markdown",
               config: {
                  markdown: "# heading 1",
                  subscriptionTopics: ["UPDATE_MARKDOWN"]
               }
            },
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Update markdown",
                  publishTopic: "UPDATE_MARKDOWN",
                  publishPayload: {
                     markdown: "## Updated"
                  }
               }
            }
         ]
      }
   ]
});