<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/webscript/libs/creation/basic-creation-template.lib.js">
<import resource="classpath:alfresco/site-webscripts/org/alfresco/aikau/webscript/libs/dnd-models/layout.lib.js">

var services = [{
   name: "alfresco/services/DragAndDropModellingService",
   config: {
      models: [
         getDefaultClassicWindowModel()
      ]
   }
},
"alfresco/services/NotificationService"];

var palette = [
   {
      id: "DRAG_PALETTE",
      name: "alfresco/lists/AlfList",
      config: {
         loadDataPublishTopic: "ALF_GET_ALL_REMOTE_PAGES",
         noDataMessage: "No remote templates",
         widgets: [
            {
               name: "alfresco/dnd/DragAndDropItemsListView"
            }
         ]
      }
   },
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

var coreWidgets = [
   {
      name: "alfresco/buttons/AlfButton",
      config: {
         label: "Refresh Remote Templates",
         publishTopic: "ALF_DOCLIST_RELOAD_DATA"
      }
   }
];

var widgets = coreWidgets.concat(getBasicCreationTemplateWidgets(palette)).concat([
   {
      name: "aikauTesting/mockservices/PageCreationMockXhr"
   },
   {
      name: "alfresco/logging/DebugLog"
   }
]);

model.jsonModel = {
   services: getBasicCreationTemplateServices().concat(services),
   widgets: widgets
};
