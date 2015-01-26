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
      "alfresco/services/ErrorReporter"
   ],
   widgets:[
      {
         id: "BANNER",
         name: "alfresco/renderers/Banner",
         config: {
            bannerMessage: "Banner Message"
         }
      },
      {
         id: "BANNER_EMPTY_MESSAGE",
         name: "alfresco/renderers/Banner",
         config: {
            bannerMessage: ""
         }
      },
      {
         id: "BANNER_NULL_MESSAGE",
         name: "alfresco/renderers/Banner",
         config: {
            bannerMessage: null
         }
      },
      {
         id: "BANNER_NO_MESSAGE",
         name: "alfresco/renderers/Banner",
         config: {}
      },
      {
         id: "LOCKED_BANNER_LOCK_OWNER",
         name: "alfresco/renderers/LockedBanner",
         config: {
            bannerMessage: "Locked Banner Message",
            currentItem: {
               isContainer: true,
               workingCopy: true,
               jsNode: {
                  properties: {
                     lockOwner: "admin"
                  }
               }
            }
         }
      },
      {
         id: "LOCKED_BANNER_WORKING_COPY_OWNER",
         name: "alfresco/renderers/LockedBanner",
         config: {
            bannerMessage: "Locked Banner Message",
            currentItem: {
               jsNode: {
                  properties: {
                     workingCopyOwner: "admin"
                  }
               }
            }
         }
      },
      {
         id: "LOCKED_BANNER_NO_MESSAGE",
         name: "alfresco/renderers/LockedBanner",
         config: {
            currentItem: {
               jsNode: {
                  properties: {}
               }
            }
         }
      },
      {
         name: "alfresco/logging/SubscriptionLog"
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};