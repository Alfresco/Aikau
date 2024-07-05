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
      "aikauTesting/mockservices/MockPreferenceService"
   ],
   widgets: [
      {
         // Should end up as 3 (from default preferences)
         name: "alfresco/documentlibrary/AlfGalleryViewSlider",
         config: {
            pubSubScope: "GS1_"
         }
      },
      {
         // Should end up as 7 (from searchlist preferences)
         name: "alfresco/documentlibrary/AlfGalleryViewSlider",
         config: {
            pubSubScope: "GS2_",
            columns: 10,
            columnsPreferenceProperty: "org.alfresco.share.searchList.galleryColumns"
         }
      },
      {
         // Should end up as 10 (from config)
         name: "alfresco/documentlibrary/AlfGalleryViewSlider",
         config: {
            pubSubScope: "GS3_",
            columns: 10,
            columnsPreferenceProperty: "org.alfresco.share.no.prefs"
         }
      },
      {
         // Should end up as 4 (from defauls on invalid config)
         name: "alfresco/documentlibrary/AlfGalleryViewSlider",
         config: {
            pubSubScope: "GS4_",
            columns: "bob",
            columnsPreferenceProperty: "org.alfresco.share.no.prefs"
         }
      },
      {
         // Should end up as 4 (from defauls on invalid config)
         name: "alfresco/documentlibrary/AlfGalleryViewSlider",
         config: {
            pubSubScope: "GS5_",
            columns: null,
            columnsPreferenceProperty: "org.alfresco.share.no.prefs"
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};