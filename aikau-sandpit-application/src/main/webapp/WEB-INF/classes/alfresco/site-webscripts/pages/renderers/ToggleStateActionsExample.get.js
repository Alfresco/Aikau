<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/module-alfresco_renderers_ToggleStateActions.html",
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            {
               name: "alfresco/renderers/ToggleStateActions",
               config: {
                  currentItem: {
                     nodeRef: "some://fake/nodeRef",
                     node: {
                        properties: {
                           "qshare:sharedId": "fake-share-id"
                        }
                     }
                  },
                  itemKeyProperty: "nodeRef",
                  toggleOnWhenPropertySet: true,
                  toggleStateProperty: "node.properties.qshare:sharedId",
                  toggleOnStateLabel: "Shared",
                  toggleOffStateLabel: "Share",
                  toggleOnRequestTopic: "SHARE",
                  toggleOnSuccessTopic: "SHARE",
                  toggleOffSuccessTopic: "UNSHARED",
                  customActions: [
                     {
                        label: "Copy Link",
                        publishTopic: "COPY"
                     },
                     {
                        label: "E-Mail Link",
                        publishTopic: "EMAIL"
                     },
                     {
                        label: "Stop sharing",
                        publishTopic: "UNSHARED"
                     }
                  ]
               }
            }
         ]
      }
   ]
});