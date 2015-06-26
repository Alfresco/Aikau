/*jshint maxlen:false*/
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
      "alfresco/services/NotificationService"
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
                     pubSubScope: "NO_ID_",
                     title: "Dashlet (no ID)",
                     widgetsForBody: [
                        {
                           name: "alfresco/html/Label",
                           config: {
                              label: "Collaboratively administrate empowered markets via plug-and-play networks. Dynamically procrastinate B2C users after installed base benefits. Dramatically visualize customer directed convergence without revolutionary ROI. Efficiently unleash cross-media information without cross-media value. Quickly maximize timely deliverables for real-time schemas. Dramatically maintain clicks-and-mortar solutions without functional solutions. Completely synergize resource sucking relationships via premier niche markets. Professionally cultivate one-to-one customer service with robust ideas. Dynamically innovate resource-leveling customer service for state of the art customer service."
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/dashlets/Dashlet",
                  id: "VALID_ID_DASHLET",
                  config: {
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