var value = 0;
var items = [];
for (var j=0; j < 100; j++)
{
   var item = {};
   for (var k=0; k<50; k++)
   {
      item["p" + k] = value++;
   }
   items.push(item);
}

var rowModel = [];
for (var i=0; i<50; i++)
{
   rowModel.push({
      name: "alfresco/lists/views/layouts/Cell",
      config: {
         widgets: [
            {
               name: "alfresco/renderers/Property",
               config: {
                  propertyToRender: "p" + i
               }
            }
         ]
      }
   });
}

model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: false,
               all: false
            }
         }
      }
   ],
   widgets: [
      {
         name: "alfresco/lists/AlfList",
         config: {
            currentData: {
               items: items
            },
            widgets: [
               {
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: rowModel
                           }
                        }
                     ]
                  }
               }
            ]
         }
      }
   ]
};