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
      "aikauTesting/mockservices/SelectTestOptions",
      "alfresco/services/DialogService"
   ],
   widgets: [
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REQUEST_GLOBAL_UPDATE",
            label: "Refresh 'Update Topics'",
            publishTopic: "GLOBAL_UPDATE_TOPIC"
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REQUEST_SCOPED_UPDATE_GLOBALLY",
            label: "Fail To refresh 'Update Topics' (Scoped Topic/Global Publish)",
            publishTopic: "SCOPED_UPDATE_TOPIC"
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         config: {
            id: "REQUEST_SCOPED_UPDATE",
            label: "Succeed Updating 'Update Topics' (Scoped)",
            publishTopic: "UNIT_TEST_SCOPED_UPDATE_TOPIC"
         }
      },
      {
         id: "CREATE_FORM_DIALOG",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Create dialog with select",
            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
            publishPayload: {
               dialogId: "DIALOG_WITH_SELECT",
               dialogTitle: "Dialog With Select",
               formSubmissionTopic: "DIALOG_POST",
               widgets: [
                  {
                     id: "SELECT_IN_DIALOG",
                     name: "alfresco/forms/controls/Select",
                     config: {
                        fieldId: "SiD",
                        name: "selected",
                        label: "Select",
                        value: "DO2",
                        optionsConfig: {
                           publishTopic: "GET_OPTIONS_FOR_SELECT_IN_DIALOG"
                        }
                     }
                  },
                  {
                     id: "SELECT2_IN_DIALOG",
                     name: "alfresco/forms/controls/RadioButtons",
                     config: {
                        fieldId: "SiD2",
                        name: "selected2",
                        label: "Select Fixed",
                        value: "2",
                        optionsConfig: {
                           fixed: [
                              { label: "One", value: "1"}, { label: "Two", value: "2"}
                           ]
                        }
                     }
                  }
               ]
            }
         }
      },
      {
         name: "alfresco/html/Spacer",
         config: {
            height: "30px"
         }
      },
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgets: [
               {
                  name: "alfresco/forms/Form",
                  id: "FORM1",
                  config: {
                     pubSubScope: "UNIT_TEST_",
                     okButtonPublishTopic: "FORM1_POST",
                     widgets: [
                        {
                           id: "NO_CONFIG",
                           name: "alfresco/forms/controls/Select",
                           config: null
                        },
                        {
                           id: "INVALID_CONFIG",
                           name: "alfresco/forms/controls/Select",
                           config: {
                              label: "Invalid options config",
                              description: "This select field has incorrectly configured options configuration. No options are expected to be displayed",
                              optionsConfig: {
                                 fixed: 1
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/Select",
                           config: {
                              id: "FIXED_INVALID_CHANGES_TO",
                              fieldId: "Select1",
                              name: "fixed1",
                              label: "Fixed Options",
                              description: "This select field is configured with a mixture of valid and invalid static options. Only the valid options will be displayed",
                              value: "2",
                              optionsConfig: {
                                 changesTo: "INVALID_DATA",
                                 updateTopics: "INVALID_DATA",
                                 fixed: [
                                    {label:"select.test.fixed.option.one",value:"1"},
                                    {label:"select.test.fixed.option.two",value:"2"},
                                    {label:"No value",value:""},
                                    {value:"NO LABEL"},
                                    {INVALID:"DATA"}
                                 ]
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/forms/Form",
                  id: "FORM2",
                  config: {
                     pubSubScope: "UNIT_TEST_",
                     okButtonPublishTopic: "FORM2_POST",
                     widgets: [
                        {
                           name: "alfresco/forms/controls/Select",
                           config: {
                              id: "HAS_UPDATE_TOPICS",
                              fieldId: "Select2",
                              name: "updated1",
                              label: "Update Topics",
                              description: "This field is configured with a topic to publish requesting options, along with a number of topics that will trigger the options to be refreshed. The update topics can be triggered by clicking the button at below the form.",
                              value: "Value2_1", 
                              optionsConfig: {
                                 updateTopics: [
                                    {
                                       topic: "GLOBAL_UPDATE_TOPIC",
                                       global: true
                                    },
                                    {
                                       topic: "SCOPED_UPDATE_TOPIC",
                                       global: false
                                    },
                                    {
                                       topic: "UNSCOPED_UPDATE_TOPIC"
                                    },
                                    {
                                       INVALID: "DATA"
                                    }
                                 ],
                                 publishTopic: "GET_OPTIONS_FOR_SELECT_2"
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/Select",
                           config: {
                              id:"BASIC_FIXED_OPTIONS",
                              fieldId: "Select3",
                              name: "fixed2",
                              label: "Fixed Options Trigger",
                              description: "This is another example of a select field with fixed options. This particular field can be used to trigger the refreshing of options in the 'ChangesTo' field.",
                              optionsConfig: {
                                 fixed: [
                                    {label:"Three",value:"3"},
                                    {label:"Four",value:"4"}
                                 ]
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/Select",
                           config: {
                              id: "HAS_CHANGES_TO",
                              fieldId: "Select4",
                              name: "updated2",
                              label: "ChangesTo",
                              description: "This select field is configured to dynamically request options each time the value of 'Fixed Options Trigger' is changed",
                              optionsConfig: {
                                 changesTo: [
                                    {
                                       targetId:"Select1"
                                    },
                                    {
                                       targetId:"Select3",
                                       global: false
                                    },
                                    {
                                       INVALID: "DATA"
                                    }
                                 ],
                                 publishTopic: "GET_OPTIONS_FOR_SELECT_4"
                              }
                           }
                        },
                        {
                           id:"XSS_OPTIONS",
                           name: "alfresco/forms/controls/Select",
                           config: {
                              fieldId: "XSS_OPTIONS",
                              name: "xss",
                              label: "Check XSS Options",
                              description: "This field is configured with a single option that attempts to inject JavaScript into the page, it is included to validate that this is not possible",
                              optionsConfig: {
                                 fixed: [
                                    {label:'<img src="1" onerror="window.hackedLabel=true">',value:'<img src="1" onerror="window.hackedValue=true">'}
                                 ]
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
         name: "alfresco/html/Spacer",
         config: {
            height: "30px"
         }
      },
      {
         name: "alfresco/forms/Form",
         id: "FORM3",
         config: {
            pubSubScope: "UNIT_TEST_",
            okButtonPublishTopic: "FORM3_POST",
            widgets: [
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgetMarginRight: "20px",
                     widgets: [
                        {
                           name: "alfresco/forms/controls/Select",
                           id: "LONG_OPTIONS_NORMAL",
                           config: {
                              name: "longOptionsNormal",
                              label: "Long options (normal)",
                              description: "This select field is has some long options values without any width constraints",
                              optionsConfig: {
                                 fixed: [{
                                    label: "Krill sardonically clung outside and",
                                    value: "1"
                                 }, {
                                    label: "Forgot folded owing gosh matter-of-factly so hello less bleak gosh contrary precise",
                                    value: "2"
                                 }, {
                                    label: "Through chose ate convulsive dear insufferably in ingenuously",
                                    value: "3"
                                 }, {
                                    label: "Firefly and thus oh connected or much this tacky preparatory hence grievously notwithstanding wombat",
                                    value: "4"
                                 }, {
                                    label: "Clung some as much some since lightly",
                                    value: "5"
                                 }, {
                                    label: "Alas together ape dazedly less fleetly",
                                    value: "6"
                                 }]
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/Select",
                           id: "LONG_OPTIONS_FORCEWIDTH",
                           config: {
                              name: "longOptionsForceWidth",
                              forceWidth: true,
                              width: "200px",
                              label: "Long options (forceWidth)",
                              description: "This select field is has some long options values in it and has been set to constrain its with",
                              optionsConfig: {
                                 fixed: [{
                                    label: "Krill sardonically clung outside and (quick bit of extra text)",
                                    value: "1"
                                 }, {
                                    label: "Forgot folded owing gosh matter-of-factly so hello less bleak gosh contrary precise",
                                    value: "2"
                                 }, {
                                    label: "Through chose ate convulsive dear insufferably in ingenuously",
                                    value: "3"
                                 }, {
                                    label: "Firefly and thus oh connected or much this tacky preparatory hence grievously notwithstanding wombat",
                                    value: "4"
                                 }, {
                                    label: "Clung some as much some since lightly",
                                    value: "5"
                                 }, {
                                    label: "Alas together ape dazedly less fleetly",
                                    value: "6"
                                 }]
                              }
                           }
                        },
                        {
                           name: "alfresco/forms/controls/Select",
                           id: "LONG_OPTIONS_FORCEWIDTH_TRUNCATE",
                           config: {
                              name: "longOptionsForceWidthTruncate",
                              width: "200px",
                              forceWidth: true,
                              truncate: true,
                              label: "Long options (forceWidth,truncate)",
                              description: "This select field is has some long options values in it and has been set to constrain its with and additionally to use an ellipsis to hide anything that overflows a single line",
                              optionsConfig: {
                                 fixed: [{
                                    label: "Krill sardonically clung outside and",
                                    value: "1"
                                 }, {
                                    label: "Forgot folded owing gosh matter-of-factly so hello less bleak gosh contrary precise",
                                    value: "2"
                                 }, {
                                    label: "Through chose ate convulsive dear insufferably in ingenuously",
                                    value: "3"
                                 }, {
                                    label: "Firefly and thus oh connected or much this tacky preparatory hence grievously notwithstanding wombat",
                                    value: "4"
                                 }, {
                                    label: "Clung some as much some since lightly",
                                    value: "5"
                                 }, {
                                    label: "Alas together ape dazedly less fleetly",
                                    value: "6"
                                 }]
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
         name: "alfresco/logging/DebugLog"
      }
   ]
};