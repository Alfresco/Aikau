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
               name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
               config: {
                  breadcrumbs: [
                     {
                        label: "Small"
                     },
                     {
                        label: "Crumb"
                     },
                     {
                        label: "Of"
                     },
                     {
                        label: "Comfort"
                     }
                  ]
               }
            }
         ]
      },
      {
         title: "example2.title",
         description: "example2.description",
         model: [
            {
               name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
               config: {
                  currentPath: "/the/road/less/travelled",
                  showRootLabel: true
               }
            }
         ]
      },
      {
         title: "example3.title",
         description: "example3.description",
         model: [
            {
               name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
               config: {
                  currentPath: "/there's/a/lady/who/knows",
                  showRootLabel: true,
                  rootLabel: "HOME",
                  pathChangeTopic: "UPDATE_PATH"
               }
            },
            {
               name: "alfresco/buttons/AlfButton",
               config: {
                  label: "Update Path",
                  publishTopic: "UPDATE_PATH",
                  publishPayload: {
                     path: "all/that/glitters/is/gold"
                  }
               }
            }
         ]
      },
      {
         title: "example4.title",
         description: "example4.description",
         model: [
            {
               name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
               config: {
                  currentPath: "/another/path/to/render",
                  useHash: true
               }
            }
         ]
      },
      {
         title: "example5.title",
         description: "example5.description",
         model: [
            {
               name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
               config: {
                  currentPath: "/another/path/to/render",
                  publishTopic: "NAVIGATE",
                  publishPayloadType: "PROCESS",
                  publishPayloadModifiers: ["processInstanceTokens"],
                  publishPayload: {
                     url: "documentlibrary#filter=path|{path}",
                     type: "PAGE_RELATIVE",
                     target: "CURRENT"
                  }
               }
            }
         ]
      },
      {
         title: "example6.title",
         description: "example6.description",
         model: [
            {
               name: "alfresco/documentlibrary/AlfBreadcrumbTrail",
               config: {
                  currentPath: "/another/path/to/render",
                  lastBreadcrumbPublishTopic: "NAVIGATE",
                  lastBreadcrumbPublishPayload: {
                     url: "documentlibrary#filter=path|{path}",
                     type: "PAGE_RELATIVE",
                     target: "CURRENT"
                  },
                  lastBreadcrumbPublishPayloadType: "PROCESS",
                  lastBreadcrumbPublishPayloadModifiers: ["processInstanceTokens"],
               }
            }
         ]
      }
   ]
});