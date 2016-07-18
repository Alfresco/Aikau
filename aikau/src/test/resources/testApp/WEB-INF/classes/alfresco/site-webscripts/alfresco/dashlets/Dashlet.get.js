/*jshint maxlen:false*/

var view = {
   name: "alfresco/lists/views/AlfListView",
   config: {
      widgets: [
         {
            name: "alfresco/lists/views/layouts/Row",
            config: {
               widgets: [
                  {
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/renderers/Property",
                              config: {
                                 propertyToRender: "index"
                              }
                           }
                        ]
                     }
                  }
               ]
            }
         }
      ]
   }
};

model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true
            }
         }
      },
      "alfresco/services/DashletService",
      "alfresco/services/NotificationService",
      {
         name: "aikauTesting/mockservices/PaginationService",
         config: {
            loadDataSubscriptionTopic: "ALF_RETRIEVE_DOCUMENTS_REQUEST"
         }
      },
      "alfresco/services/NavigationService"
   ],
   widgets: [
      {
         "name": "alfresco/layout/HorizontalWidgets",
         "config": {
            "widgetMarginLeft": 10,
            "widgetMarginRight": 10,
            "widgets": [
               {
                  name: "alfresco/dashlets/Dashlet",
                  id: "NO_ID_DASHLET",
                  config: {
                     additionalCssClasses: "smallpad",
                     pubSubScope: "NO_ID_",
                     title: "Dashlet (no ID)",
                     bodyHeight: 500,
                     widgetsForTitleBarActions: [
                        {
                           id: "TITLE_BAR_ACTION",
                           name: "alfresco/html/Label",
                           config: {
                              label: "Title-bar actions"
                           }
                        }
                     ],
                     widgetsForToolbar: [
                        {
                           name: "alfresco/html/Label",
                           config: {
                              label: "Toolbar"
                           }
                        }
                     ],
                     widgetsForToolbar2: [
                        {
                           name: "alfresco/html/Label",
                           config: {
                              label: "Toolbar2"
                           }
                        }
                     ],
                     widgetsForBody: [
                        {
                           name: "alfresco/layout/InfiniteScrollArea",
                           config: {
                              scrollTolerance: 300,
                              widgets: [
                                 {
                                    id: "INFITE_SCROLL_LIST",
                                    name: "alfresco/lists/AlfSortablePaginatedList",
                                    config: {
                                       useHash: false,
                                       useInfiniteScroll: true,
                                       currentPageSize: 20,
                                       filteringTopics: ["FILTER_THIS"],
                                       widgets: [view]
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/dashlets/Dashlet",
                  id: "VALID_ID_DASHLET",
                  config: {
                     additionalCssClasses: "mediumpad",
                     pubSubScope: "VALID_ID_",
                     title: "Dashlet (valid ID, presized)",
                     componentId: "component.valid-dashlet",
                     bodyHeight: 300,
                     widgetsForBody: [
                        {
                           name: "alfresco/html/Label",
                           config: {
                              label: "Objectively innovate empowered manufactured products whereas parallel platforms. Holisticly predominate extensible testing procedures for reliable supply chains. Dramatically engage top-line web services vis-a-vis cutting-edge deliverables. Proactively envisioned multimedia based expertise and cross-media growth strategies. Seamlessly visualize quality intellectual capital without superior collaboration and idea-sharing. Holistically pontificate installed base portals after maintainable products. Phosfluorescently engage worldwide methodologies with web-enabled technology. Interactively coordinate proactive e-commerce via process-centric 'outside the box' thinking. Completely pursue scalable customer service through sustainable potentialities."
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/dashlets/Dashlet",
                  id: "INVALID_ID_DASHLET",
                  config: {
                     additionalCssClasses: "largepad",
                     pubSubScope: "INVALID_ID_",
                     title: "Dashlet (invalid ID)",
                     componentId: "component.invalid-dashlet",
                     widgetsForBody: [
                        {
                           name: "alfresco/html/Label",
                           config: {
                              label: "Collaboratively administrate turnkey channels whereas virtual e-tailers. Objectively seize scalable metrics whereas proactive e-services. Seamlessly empower fully researched growth strategies and interoperable internal or 'organic' sources. Credibly innovate granular internal or 'organic' sources whereas high standards in web-readiness. Energistically scale future-proof core competencies vis-a-vis impactful experiences. Dramatically synthesize integrated schemas with optimal networks. Interactively procrastinate high-payoff content without backward-compatible data. Quickly cultivate optimal processes and tactical architectures. Completely iterate covalent strategic theme areas via accurate e-markets."
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/DashletServiceMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};