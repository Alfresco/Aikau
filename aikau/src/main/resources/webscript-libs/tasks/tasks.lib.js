/* global msg */

/* 
 * This library file can be used to assist in building pages for managing workflow tasks in Share. To
 * get the default model you should import this file into your Aikau page WebScript and call the
 * "getTaskListModel" function to get the model to include in the page, you should also call the
 * "getTaskListServices" to get the array of services that are required for the model to be functional.
 */



function getTaskListServices() {
   return [
      {
         id: "CRUD_SERVICE",
         name: "alfresco/services/CrudService"
      },
      {
         id: "DIALOG_SERVICE",
         name: "alfresco/services/DialogService"
      },
      {
         id: "DOCUMENT_SERVICE",
         name: "alfresco/services/DocumentService"
      },
      {
         id: "FORMS_RUNTIME_SERVICE",
         name: "alfresco/services/FormsRuntimeService"
      },
      {
         id: "NOTIFICATION_SERVICE",
         name: "alfresco/services/NotificationService"
      },
      {
         id: "SEARCH_SERVICE",
         name: "alfresco/services/SearchService"
      },
      {
         id: "SITE_SERVICE",
         name: "alfresco/services/SiteService"
      },
      {
         id: "USER_SERVICE",
         name: "alfresco/services/UserService"
      }
   ];
}

function getTaskDialogRequestPayload(data) {
   data = data || {};

   return {
      itemId: data.itemId || "{id}",
      itemKind: data.itemKind || "task",
      mode: data.mode || "view",
      alfSuccessTopic: "TASK_FORM_RETRIEVED",
      formConfig: {
         useDialog: true,
         formId: data.dialogId || "CREATE_TASK_DIALOG",
         dialogTitle: data.dialogTitle || "View Task",
         formSubmissionPayloadMixin: {
            alfResponseScope: "TASKS_"
         }
      }
   };
}

function getTaskListView() {
   return {
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
                           additionalCssClasses: "mediumpad",
                           widgets: [
                              {
                                 name: "alfresco/renderers/PropertyLink",
                                 config: {
                                    propertyToRender: "properties.bpm_description",
                                    renderSize: "large",
                                    publishTopic: "ALF_FORM_REQUEST",
                                    publishPayloadType: "PROCESS",
                                    publishPayloadModifiers: ["processCurrentItemTokens"],
                                    useCurrentItemAsPayload: false,
                                    publishGlobal: true,
                                    publishPayload: getTaskDialogRequestPayload()
                                 }
                              },
                              {
                                 name: "alfresco/renderers/Date",
                                 config: {
                                    propertyToRender: "workflowInstance.dueDate",
                                    simple: true,
                                    label: "Due",
                                    renderOnNewLine: true
                                 }
                              },
                              {
                                 name: "alfresco/renderers/Date",
                                 config: {
                                    propertyToRender: "workflowInstance.startDate",
                                    simple: true,
                                    label: "Started"
                                 }
                              },
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "properties.bpm_status",
                                    label: "Status",
                                    renderOnNewLine: true
                                 }
                              },
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "title",
                                    label: "Type",
                                    renderOnNewLine: true
                                 }
                              },
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "description",
                                    label: "Description",
                                    renderOnNewLine: true
                                 }
                              },
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "workflowInstance.initiator.userName",
                                    label: "Started by",
                                    renderOnNewLine: true
                                 }
                              }
                           ]
                        }
                     },
                     {
                        name: "alfresco/lists/views/layouts/Cell",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/renderers/Link",
                                 config: {
                                    linkLabel: "Edit task",
                                    publishTopic: "ALF_FORM_REQUEST",
                                    publishPayloadType: "PROCESS",
                                    publishPayloadModifiers: ["processCurrentItemTokens"],
                                    useCurrentItemAsPayload: false,
                                    publishGlobal: true,
                                    publishPayload: getTaskDialogRequestPayload({
                                       dialogTitle: "Edit Task",
                                       mode: "edit"
                                    }),
                                    renderOnNewLine: true
                                 }
                              },
                              {
                                 name: "alfresco/renderers/Link",
                                 config: {
                                    linkLabel: "View task",
                                    publishTopic: "ALF_FORM_REQUEST",
                                    publishPayloadType: "PROCESS",
                                    publishPayloadModifiers: ["processCurrentItemTokens"],
                                    useCurrentItemAsPayload: false,
                                    publishGlobal: true,
                                    publishPayload: getTaskDialogRequestPayload({
                                       dialogTitle: "View Task",
                                       mode: "view"
                                    }),
                                    renderOnNewLine: true
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
}


function getTaskList() {
   return {
      name: "alfresco/lists/AlfFilteredList",
      config: {
         pubSubScope: "TASKS_",
         useHash: true,
         loadDataPublishTopic: "ALF_CRUD_GET_ALL",
         loadDataPublishPayload: {
            url: "api/task-instances?authority=admin&properties=bpm_priority,bpm_status,bpm_dueDate,bpm_description&exclude=wcmwf:*&skipCount=0&maxItems=50"
         },
         itemsProperty: "data",
         filteringTopics: [],
         // TODO: Summary is working properly
         // showFilterSummary: true,
         // filterSummaryLabelMapping: {
         //    priority: {
         //       bob: "High",
         //       woof: "Medium",
         //       "_1": "Low"
         //    }
         // },
         widgetsForFilters: [
            {
               name: "alfresco/forms/controls/Select",
               config: {
                  fieldId: "PRIORITY",
                  name: "priority",
                  label: "Priority",
                  optionsConfig: {
                     fixed: [
                        { label: "All", value: "" },
                        { label: "High", value: "3" },
                        { label: "Medium", value: "2" },
                        { label: "Low", value: "1" }
                     ]
                  }
               }
            },
            {
               name: "alfresco/forms/controls/DateTextBox",
               config: {
                  fieldId: "DUE_AFTER",
                  name: "dueAfter",
                  label: "Due After",
                  value: "TODAY",
                  valueFormatSelector: "datetime"
               }
            },
            {
               name: "alfresco/forms/controls/DateTextBox",
               config: {
                  fieldId: "DUE_BEFORE",
                  name: "dueBefore",
                  label: "Due Before",
                  value: "TODAY",
                  valueFormatSelector: "datetime"
               }
            },
            {
               name: "alfresco/forms/controls/Select",
               config: {
                  fieldId: "STATE",
                  name: "state",
                  label: "State",
                  optionsConfig: {
                     fixed: [
                        { label: "Active", value: "" },
                        { label: "Completed", value: "COMPLETED" }
                     ]
                  }
               }
            },
            {
               name: "alfresco/forms/controls/Select",
               config: {
                  fieldId: "Assignee",
                  name: "pooledTasks",
                  label: "Assignee",
                  optionsConfig: {
                     fixed: [
                        { label: "Me", value: "false" },
                        { label: "Unassigned", value: "true" }
                     ]
                  }
               }
            }
         ],
         widgets: [
            getTaskListView()
         ]
      }
   };
}


function getStartWorkflowButton() {
   return {
      name: "alfresco/buttons/AlfButton",
      config: {
         label: msg.get("my-tasks.buttons.startWorkflow"),
         additionalCssClasses: "call-to-action",
         publishTopic: "ALF_CREATE_DIALOG_REQUEST",
         publishPayload: {
            dialogId: "CREATE_TASK_DIALOG",
            dialogTitle: "Create task",
            contentWidth: "1000px",
            hideTopic: "ALF_CRUD_CREATE",
            widgetsContent: [
               {
                  name: "alfresco/forms/Form",
                  config: {
                     autoSavePublishTopic: "ALF_FORM_REQUEST",
                     autoSavePublishGlobal: true,
                     autoSavePublishPayload: {
                        itemKind: "workflow",
                        mode: "create",
                        alfSuccessTopic: "WORKFLOW_FORM_RETRIEVED",
                        formConfig: {
                           formSubmissionPayloadMixin: {
                              alfResponseScope: "TASKS_"
                           }
                        }
                     },
                     widgets: [
                        {
                           name: "alfresco/forms/controls/Select",
                           config: {
                              fieldId: "SELECT_FORM",
                              label: "Workflow",
                              description: "Select a workflow to create a task from",
                              name: "itemId",
                              optionsConfig: {
                                 fixed: [
                                    {
                                       label: "New Task", value: "activiti%24activitiAdhoc"
                                    },
                                    {
                                       label: "Review and approve (Group review)", value: "activiti%24activitiParallelGroupReview"
                                    },
                                    {
                                       label: "Review and approve (one or more reviewers)", value: "activiti%24activitiParallelReview"
                                    },
                                    {
                                       label: "Review and approve (pooled review)", value: "activiti%24activitiReviewPooled"
                                    },
                                    {
                                       label: "Review and approve (single reviewer)", value: "activiti%24activitiReview"
                                    }
                                 ]
                              }
                           }
                        }
                     ]
                  }
               },
               {
                  name: "alfresco/layout/DynamicWidgets",
                  config: {
                     subscribeGlobal: true,
                     subscriptionTopic: "WORKFLOW_FORM_RETRIEVED"
                  }
               }
            ],
            publishOnShow: [
               {
                  publishTopic: "ALF_FORM_REQUEST",
                  publishPayload: {
                     itemId: "activiti%24activitiAdhoc",
                     itemKind: "workflow",
                     mode: "create",
                     alfSuccessTopic: "WORKFLOW_FORM_RETRIEVED",
                     formConfig: {
                        formSubmissionPayloadMixin: {
                           alfResponseScope: "TASKS_"
                        }
                     }
                  },
                  publishGlobal: true
               }
            ]
         }
      }
   };
}

function getTaskListModel() {
   return {
      name: "alfresco/layout/VerticalWidgets",
      config: {
         style: {
            marginTop: "10px"
         },
         widgets: [
            {
               name: "alfresco/layout/HorizontalWidgets",
               config: {
                  widgets: [
                     getStartWorkflowButton()
                  ]
               }
            },
            getTaskList()
         ]
      }
   };
}