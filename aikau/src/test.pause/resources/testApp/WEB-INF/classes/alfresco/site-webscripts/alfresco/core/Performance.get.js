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

var rowModel = [], cellModel, propertyModel;
for (var i=0; i<50; i++)
{
   propertyModel = {
      name: "alfresco/renderers/Property",
      config: {
         propertyToRender: "p" + i
      }
   };
   cellModel = {
      name: "alfresco/lists/views/layouts/Cell",
      config: {
         widgets: [
            propertyModel
         ]
      }
   };
   
   // simulate a somewhat high number of config properties
   // non-functional so should only highlight performance issues in config handling
   for (var j=0; j<50; j++)
   {
       propertyModel.config["configKey_" + j] = "configValue_" + j;
       cellModel.config["configKey_" + j] = "configValue_" + j;
   }
   
   rowModel.push(cellModel);
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