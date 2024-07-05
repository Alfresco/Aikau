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
      },
      {
         name: "alfresco/services/CrudService",
         config: {
            encodeURIs: true
         }
      },
      "alfresco/services/NotificationService",
      "alfresco/services/DialogService"
   ],
   widgets:[
      {
         name: "alfresco/buttons/AlfButton",
         id: "DELETE_SUCCESS_BUTTON",
         config: {
            label: "Successful delete call",
            publishTopic: "ALF_CRUD_DELETE",
            publishPayload: {
               url: "resources/123",
               responseTopic: "ALF_CRUD_DELETED"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "DELETE_FAILURE_BUTTON",
         config: {
            label: "Failed delete call",
            publishTopic: "ALF_CRUD_DELETE",
            publishPayload: {
               url: "resources/234",
               responseTopic: "ALF_CRUD_DELETED",
               failureMessage: "Test delete-failure message"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "UPDATE_SUCCESS_BUTTON",
         config: {
            label: "Successful update call",
            publishTopic: "ALF_CRUD_UPDATE",
            publishPayload: {
               url: "resources/123",
               alfResponseTopic: "ALF_CRUD_UPDATED"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "UPDATE_FAILURE_BUTTON",
         config: {
            label: "Failed update call",
            publishTopic: "ALF_CRUD_UPDATE",
            publishPayload: {
               url: "resources/234",
               alfResponseTopic: "ALF_CRUD_UPDATED",
               failureMessage: "Test update-failure message"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "CREATE_SUCCESS_BUTTON",
         config: {
            label: "Successful create call",
            publishTopic: "ALF_CRUD_CREATE",
            publishPayload: {
               url: "resources/123",
               alfResponseTopic: "ALF_CRUD_CREATED"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "CREATE_FAILURE_BUTTON",
         config: {
            label: "Failed create call",
            publishTopic: "ALF_CRUD_CREATE",
            publishPayload: {
               url: "resources/234",
               alfResponseTopic: "ALF_CRUD_CREATED",
               failureMessage: "Test create-failure message"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "GET_ALL_DEFAULT_CACHE_BUTTON",
         config: {
            label: "Get with default cache options",
            publishTopic: "ALF_CRUD_GET_ALL",
            publishPayload: {
               url: "resources/cache",
               alfResponseTopic: "ALF_GET_ALL_DEFAULT_CACHE",
               failureMessage: "Test get all message"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "GET_ALL_PREVENT_CACHE_BUTTON",
         config: {
            label: "Get with prevent cache options",
            publishTopic: "ALF_CRUD_GET_ALL",
            publishPayload: {
               url: "resources/nocache",
               preventCache: true,
               alfResponseTopic: "ALF_GET_ALL_PREVENT_CACHE",
               failureMessage: "Test get all prevent cache message"
            }
         }
      },
      {
         name: "alfresco/buttons/AlfButton",
         id: "URL_ENCODING_REQUIRED_BUTTON",
         config: {
            label: "Encoded URI check",
            publishTopic: "ALF_CRUD_GET_ALL",
            publishPayload: {
               url: "resources/nocache?filter=%moomin",
               alfResponseTopic: "ALF_GET_ALL_PREVENT_CACHE",
               failureMessage: "Test get all prevent cache message"
            }
         }
      },
      {
         id: "SCOPED_CREATE",
         name: "alfresco/buttons/AlfButton",
         config: {
            pubSubScope: "SCOPE1_",
            label: "Scoped create",
            publishTopic: "ALF_CRUD_CREATE",
            publishPayload: {
               url: "resources/123",
               alfResponseTopic: "ALF_CRUD_CREATED"
            },
            publishGlobal: true
         }
      },
      {
         id: "SCOPED_DELETE",
         name: "alfresco/buttons/AlfButton",
         config: {
            pubSubScope: "SCOPE2_",
            label: "Scoped delete",
            publishTopic: "ALF_CRUD_DELETE",
            publishPayload: {
               url: "resources/123",
               responseTopic: "ALF_CRUD_DELETED"
            },
            publishGlobal: true
         }
      },
      {
         id: "SCOPED_DELETE_WITH_CONFIRMATION",
         name: "alfresco/buttons/AlfButton",
         config: {
            pubSubScope: "SCOPE3_",
            label: "Scoped delete (with confirmation)",
            publishTopic: "ALF_CRUD_DELETE",
            publishPayload: {
               requiresConfirmation: true,
               url: "resources/123",
               responseTopic: "ALF_CRUD_DELETED"
            },
            publishGlobal: true
         }
      },
      {
         id: "SCOPED_UPDATE",
         name: "alfresco/buttons/AlfButton",
         config: {
            pubSubScope: "SCOPE4_",
            label: "Scoped update",
            publishTopic: "ALF_CRUD_UPDATE",
            publishPayload: {
               url: "resources/123",
               alfResponseTopic: "ALF_CRUD_UPDATED"
            },
            publishGlobal: true
         }
      },
      {
         name: "aikauTesting/mockservices/CrudServiceMockXhr"
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};