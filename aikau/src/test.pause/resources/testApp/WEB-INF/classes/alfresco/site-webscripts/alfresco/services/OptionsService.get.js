/* global url, model */
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
      "alfresco/services/OptionsService",
      "alfresco/services/UserService"
   ],
   widgets: [
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/layout/TitleDescriptionAndContent",
                  config: {
                     title: "Scoped within form",
                     description: "The controls are scoped within a form (the expected behaviour)",
                     widgets: [
                        {
                           id: "FORM",
                           name: "alfresco/forms/Form",
                           config: {
                              okButtonPublishTopic: "POST",
                              okButtonPublishGlobal: true,
                              widgets: [
                                 {
                                    id: "SELECT_1",
                                    name: "alfresco/forms/controls/Select",
                                    config: {
                                       fieldId: "SELECT_1",
                                       label: "Select a person",
                                       description: "The people options are provided by the OptionsService",
                                       name: "person1",
                                       optionsConfig: {
                                          publishTopic: "ALF_GET_FORM_CONTROL_OPTIONS",
                                          publishPayload: {
                                             url: url.context + "/proxy/alfresco/api/people",
                                             itemsAttribute: "people",
                                             labelAttribute: "userName",
                                             valueAttribute: "userName"
                                          }
                                       }
                                    }
                                 },
                                 {
                                    id: "SELECT_2",
                                    name: "alfresco/forms/controls/Select",
                                    config: {
                                       fieldId: "SELECT_2",
                                       label: "Select a person",
                                       description: "The people options are provided by the UserService",
                                       name: "person1",
                                       optionsConfig: {
                                          labelAttribute: "displayName",
                                          valueAttribute: "userName",
                                          itemsAttribute: "items",
                                          publishTopic: "ALF_GET_USERS"
                                       }
                                    }
                                 },
                                 {
                                    id: "FILTERING_SELECT_1",
                                    name: "alfresco/forms/controls/FilteringSelect",
                                    config: {
                                       fieldId: "FILTERING_SELECT_1",
                                       name: "person2",
                                       label: "Select a person",
                                       description: "The people options are provided by the OptionsService, but can be filtered via the ServiceStore",
                                       optionsConfig: {
                                          queryAttribute: "label",
                                          labelAttribute: "label",
                                          valueAttribute: "value",
                                          publishTopic: "ALF_GET_FORM_CONTROL_OPTIONS",
                                          publishPayload: {
                                             resultsProperty: "options",
                                             url: url.context + "/proxy/alfresco/api/people",
                                             itemsAttribute: "people",
                                             labelAttribute: "userName",
                                             valueAttribute: "userName"
                                          }
                                       }
                                    }
                                 }, 
                                 {
                                    id: "MULTI_SELECT_INPUT_1",
                                    name: "alfresco/forms/controls/MultiSelectInput",
                                    config: {
                                       fieldId: "MULTI_SELECT_INPUT_1",
                                       label: "Select People",
                                       description: "The people options are provided by the OptionsService, but can be filtered via the ServiceStore. More than one user can be selected",
                                       name: "people1",
                                       width: "400px",
                                       optionsConfig: {
                                          queryAttribute: "label",
                                          labelAttribute: "label",
                                          valueAttribute: "value",
                                          publishTopic: "ALF_GET_FORM_CONTROL_OPTIONS",
                                          publishPayload: {
                                             resultsProperty: "options",
                                             url: url.context + "/proxy/alfresco/api/people",
                                             itemsAttribute: "people",
                                             labelAttribute: "userName",
                                             valueAttribute: "userName"
                                          }
                                       }
                                    }
                                 },
                                 {
                                    id: "MULTI_SELECT_INPUT_2",
                                    name: "alfresco/forms/controls/MultiSelectInput",
                                    config: {
                                       fieldId: "MULTI_SELECT_INPUT_2",
                                       label: "Select People",
                                       description: "The people options are provided by the UserService, but can be filtered via the ServiceStore. Users are displayed with a sensible name.",
                                       name: "people2",
                                       width: "400px",
                                       optionsConfig: {
                                          labelAttribute: "displayName",
                                          queryAttribute: "displayName",
                                          valueAttribute: "userName",
                                          publishTopic: "ALF_GET_USERS",
                                          publishPayload: {
                                             resultsProperty: "items"
                                          }
                                       }
                                    }
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
                     title: "Unscoped without form",
                     description: "The controls are not placed in a form and are not scoped",
                     widgets: [
                        {
                           id: "SELECT_3",
                           name: "alfresco/forms/controls/Select",
                           config: {
                              fieldId: "SELECT_3",
                              label: "Select a person",
                              description: "The people options are provided by the OptionsService",
                              name: "person1",
                              optionsConfig: {
                                 publishTopic: "ALF_GET_FORM_CONTROL_OPTIONS",
                                 publishPayload: {
                                    url: url.context + "/proxy/alfresco/api/people",
                                    itemsAttribute: "people",
                                    labelAttribute: "userName",
                                    valueAttribute: "userName"
                                 }
                              }
                           }
                        },
                        {
                           id: "SELECT_4",
                           name: "alfresco/forms/controls/Select",
                           config: {
                              fieldId: "SELECT_4",
                              label: "Select a person",
                              description: "The people options are provided by the UserService",
                              name: "person1",
                              optionsConfig: {
                                 labelAttribute: "displayName",
                                 valueAttribute: "userName",
                                 itemsAttribute: "items",
                                 publishTopic: "ALF_GET_USERS"
                              }
                           }
                        },
                        {
                           id: "FILTERING_SELECT_2",
                           name: "alfresco/forms/controls/FilteringSelect",
                           config: {
                              fieldId: "FILTERING_SELECT_2",
                              name: "person2",
                              label: "Select a person",
                              description: "The people options are provided by the OptionsService, but can be filtered via the ServiceStore",
                              optionsConfig: {
                                 queryAttribute: "label",
                                 labelAttribute: "label",
                                 valueAttribute: "value",
                                 publishTopic: "ALF_GET_FORM_CONTROL_OPTIONS",
                                 publishPayload: {
                                    resultsProperty: "options",
                                    url: url.context + "/proxy/alfresco/api/people",
                                    itemsAttribute: "people",
                                    labelAttribute: "userName",
                                    valueAttribute: "userName"
                                 }
                              }
                           }
                        }, 
                        {
                           id: "MULTI_SELECT_INPUT_3",
                           name: "alfresco/forms/controls/MultiSelectInput",
                           config: {
                              fieldId: "MULTI_SELECT_INPUT_3",
                              label: "Select People #1",
                              description: "The people options are provided by the OptionsService, but can be filtered via the ServiceStore. More than one user can be selected",
                              name: "people1",
                              width: "400px",
                              optionsConfig: {
                                 queryAttribute: "label",
                                 labelAttribute: "label",
                                 valueAttribute: "value",
                                 publishTopic: "ALF_GET_FORM_CONTROL_OPTIONS",
                                 publishPayload: {
                                    resultsProperty: "options",
                                    url: url.context + "/proxy/alfresco/api/people",
                                    itemsAttribute: "people",
                                    labelAttribute: "userName",
                                    valueAttribute: "userName"
                                 }
                              }
                           }
                        },
                        {
                           id: "MULTI_SELECT_INPUT_4",
                           name: "alfresco/forms/controls/MultiSelectInput",
                           config: {
                              fieldId: "MULTI_SELECT_INPUT_4",
                              label: "Select People #2",
                              description: "The people options are provided by the UserService, but can be filtered via the ServiceStore. Users are displayed with a sensible name.",
                              name: "people2",
                              width: "400px",
                              optionsConfig: {
                                 labelAttribute: "displayName",
                                 queryAttribute: "displayName",
                                 valueAttribute: "userName",
                                 publishTopic: "ALF_GET_USERS",
                                 publishPayload: {
                                    resultsProperty: "items"
                                 }
                              }
                           }
                        },
                        {
                           id: "MULTI_SELECT_INPUT_5",
                           name: "alfresco/forms/controls/MultiSelectInput",
                           config: {
                              fieldId: "MULTI_SELECT_INPUT_5",
                              label: "Select People #3",
                              description: "This is essentially the same as 'Select People #1' but the payload contains an empty string as the itemsAttribute",
                              name: "people1",
                              width: "400px",
                              optionsConfig: {
                                 queryAttribute: "label",
                                 labelAttribute: "label",
                                 valueAttribute: "value",
                                 publishTopic: "ALF_GET_FORM_CONTROL_OPTIONS",
                                 publishPayload: {
                                    resultsProperty: "options",
                                    url: url.context + "/proxy/alfresco/api/people/raw",
                                    itemsAttribute: "",
                                    labelAttribute: "userName",
                                    valueAttribute: "userName"
                                 }
                              }
                           }
                        }
                     ]
                  }
               }
            ]
         }
      },
      {
         name: "aikauTesting/mockservices/UserMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};
