<import resource="classpath:/alfresco/site-webscripts/org/alfresco/aikau/webscript/libs/creation/basic-creation-template.lib.js">
<import resource="classpath:/alfresco/site-webscripts/org/alfresco/aikau/webscript/libs/dnd-models/layout.lib.js">

var services = {
   name: "alfresco/services/DragAndDropModellingService",
   config: {
      models: [
         getDefaultLayoutModel()
      ]
   }
};

var palette = [
   {
      id: "DRAG_PALETTE",
      name: "alfresco/dnd/DragAndDropItems",
      config: {
         items: [
            {
               type: [ "widget" ],
               label: "Classic Window",
               value: {
                  name: "alfresco/layout/ClassicWindow",
                  config: {
                     title: "Set a title"
                  }
               }
            }
         ]
      }
   }
];

var widgets = getBasicCreationTemplateWidgets(palette).concat([
   {
      name: "alfresco/logging/DebugLog"
   }
])

model.jsonModel = {
   services: getBasicCreationTemplateServices().concat(services),
   widgets: widgets
};
