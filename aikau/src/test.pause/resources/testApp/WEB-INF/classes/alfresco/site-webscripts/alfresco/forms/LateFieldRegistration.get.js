model.jsonModel = {
   services: [{
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
         "id": "RM_CLASSIFY_FORM",
         "name": "alfresco/forms/Form",
         "config": {
            "okButtonPublishTopic": "RM_EDIT_CLASSIFIED",
            "value": {
               "classificationLevelId": "S"
            },
            "widgets": [
               {
                  "id": "CLASSIFICATION_PANEL",
                  "name": "alfresco/forms/CollapsibleSection",
                  "config": {
                     "label": "Security Classification",
                     "widgets": [
                        {
                           "id": "LEVELSPAGE_CREATE",
                           "name": "alfresco/forms/controls/PushButtons",
                           "config": {
                              "multiMode": false,
                              "noWrap": true,
                              "optionsConfig": {
                                 "fixed": [{
                                    "value": "TS",
                                    "label": "Top Secret"
                                 }, {
                                    "value": "S",
                                    "label": "Secret"
                                 }, {
                                    "value": "C",
                                    "label": "Confidential"
                                 }, {
                                    "value": "U",
                                    "label": "Unclassified"
                                 }]
                              },
                              "name": "classificationLevelId",
                              "simpleLayout": true,
                              "maxChoices": 1,
                              "postWhenHiddenOrDisabled": false,
                              "noPostWhenValueIs": [""],
                              "label": "Classification",
                              "fieldId": "LEVELS"
                           }
                        },
                        {
                           "id": "TAB_CONTAINER",
                           "name": "alfresco/forms/TabbedControls",
                           "config": {
                              "padded": true,
                              "widgets": [{
                                 "name": "alfresco/forms/ControlColumn",
                                 "id": "DOWNGRADE_SCHEDULE",
                                 "title": "Downgrade Schedule",
                                 "config": {
                                    "widgets": [{
                                       "id": "DOWNGRADE_DATE",
                                       "name": "alfresco/forms/controls/DateTextBox",
                                       "config": {
                                          "name": "downgradeDate",
                                          "label": "Downgrade Date",
                                          "disablementConfig": {
                                             "initialValue": true,
                                             "rules": [{
                                                "targetId": "LEVELS",
                                                "isNot": [{
                                                   "value": "TS",
                                                   "label": "Top Secret"
                                                }, {
                                                   "value": "S",
                                                   "label": "Secret"
                                                }, {
                                                   "value": "C",
                                                   "label": "Confidential"
                                                }, {
                                                   "value": "U",
                                                   "label": "Unclassified"
                                                }]
                                             }]
                                          },
                                          "fieldId": "DOWNGRADE_SCHEDULE_FIELD"
                                       }
                                    }]
                                 }
                              }]
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