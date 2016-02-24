/* global page */
/* jshint sub:true */
var iframed = false;
if (page.url.args["iframed"])
{
   iframed = page.url.args["iframed"] === "true";
}

var iframeHeight = 200;
if (page.url.args["iframeHeight"])
{
   iframeHeight = parseInt(page.url.args["iframeHeight"], 10);
}

// innerHeight is a better default for display purposes, but outerHeight is better for the actual
// test - so this can be set through a parameter in the unit test...
var property = "innerHeight";
if (page.url.args["property"])
{
   property = page.url.args["property"];
}

model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      }
   ],
   widgets: [
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/TitleDescriptionAndContent",
                  config: {
                     title: "Less Than",
                     description: "Button will be displayed if the height of the window is LESS THAN 500px",
                     widgets: [
                        {
                           id: "BUTTON1",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Button 1",
                              additionalCssClasses: "call-to-action",
                              renderFilter: [
                                 {
                                    target: "window",
                                    property: property,
                                    comparator: "lessThan",
                                    value: 500
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/TitleDescriptionAndContent",
                  config: {
                     title: "Less Than 2",
                     description: "Button will be displayed if the height of the window is LESS THAN 500px",
                     currentItem: {
                        someProperty: "someValue"
                     },
                     widgets: [
                        {
                           id: "BUTTON1WITHITEM",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Button 1 with item",
                              additionalCssClasses: "call-to-action",
                              renderFilter: [
                                 {
                                    target: "window",
                                    property: property,
                                    comparator: "lessThan",
                                    value: 500
                                 }
                              ]
                           }
                        }                        
                     ]
                  }
               },
               {
                  name: "alfresco/layout/TitleDescriptionAndContent",
                  config: {
                     title: "Greater Than",
                     description: "Buttons will be displayed if the height of the window is GREATER THAN 500px",
                     widgets: [
                        {
                           id: "BUTTON2",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Button 2",
                              additionalCssClasses: "call-to-action",
                              renderFilter: [
                                 {
                                    target: "window",
                                    property: property,
                                    comparator: "greaterThan",
                                    value: 500
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/TitleDescriptionAndContent",
                  config: {
                     title: "Greater Than 2",
                     description: "Button will be displayed if the height of the window is GREATER THAN 500px",
                     currentItem: {
                        someProperty: "someValue"
                     },
                     widgets: [
                        {
                           id: "BUTTON2WITHITEM",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Button 2 with item",
                              additionalCssClasses: "call-to-action",
                              renderFilter: [
                                 {
                                    target: "window",
                                    property: property,
                                    comparator: "greaterThan",
                                    value: 500
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/TitleDescriptionAndContent",
                  config: {
                     title: "Equal To",
                     description: "A button will be displayed if the height of the window is EQUAL TO 500px",
                     widgets: [
                        {
                           id: "BUTTON3",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Button 3",
                              additionalCssClasses: "call-to-action",
                              renderFilter: [
                                 {
                                    target: "window",
                                    property: property,
                                    value: 500
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/TitleDescriptionAndContent",
                  config: {
                     title: "Equal To 2",
                     description: "A button will be displayed if the height of the window is EQUAL TO 500px",
                     currentItem: {
                        someProperty: "someValue"
                     },
                     widgets: [
                        {
                           id: "BUTTON3WITHITEM",
                           name: "alfresco/buttons/AlfButton",
                           config: {
                              label: "Button 3 with item",
                              additionalCssClasses: "call-to-action",
                              currentItem: {
                                 someProperty: "someValue"
                              },
                              renderFilter: [
                                 {
                                    target: "window",
                                    property: property,
                                    value: 500
                                 }
                              ]
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};

// Load the same page in an iframe, but use request parameters to prevent infinite recursion...
if (!iframed)
{
   model.jsonModel.widgets.splice(0, 0, {
      name: "alfresco/layout/TitleDescriptionAndContent",
      config: {
         title: "IFrame",
         description: "This is the page displayed within an iframe (to test dimensions handled appropriately). The height of the iframe can be controlled with the 'iframeHeight' request parameter.",
         widgets: [
            {
               name: "alfresco/integration/IFrame",
               config: {
                  src: "tp/ws/ClientPropRenderFilter?iframed=true",
                  srcType: "PAGE_RELATIVE",
                  height: iframeHeight
               }
            }
         ]
      }
   });
}
else
{
   // Get rid of the DebugLog from the iframe...
   model.jsonModel.widgets.pop();
}
