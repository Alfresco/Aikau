model.jsonModel = {
   services: [
      {
         name: "aikauTesting/RequireEverything"
      },
      "alfresco/services/ErrorReporter"
   ],
   widgets: [
      {
         id: "LABEL",
         name: "alfresco/html/Label",
         config: {
            label: "Coverage Balanced!"
         }
      },
      {
         name: "aikauTesting/TestCoverageResults"
      }
   ]
};