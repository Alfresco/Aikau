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
      }
   ],
   widgets: [
      {
         name: "alfresco/dashlets/Dashlet",
         config: {
            title: "Test Dashlet",
            componentId: "RESIZE_DASHLET",
            widgetsForBody: [
               {
                  name: "alfresco/html/Label",
                  config: {
                     label: "Bacon ipsum dolor amet brisket jowl drumstick, turkey tenderloin short ribs pork belly leberkas shank boudin short loin. Landjaeger shank bresaola short loin turducken flank. Tongue pork loin pastrami ham hock short ribs brisket, flank tail landjaeger bresaola ball tip. Doner chicken pork belly tail pork chop brisket, boudin shank tri-tip. Kevin beef ribs pork pancetta meatloaf ball tip kielbasa tenderloin. Pork venison short ribs pancetta, sirloin ham tenderloin chuck doner ribeye chicken pig alcatra. Ball tip andouille bacon filet mignon tenderloin prosciutto drumstick cupim. Landjaeger jerky biltong, shank ball tip capicola beef ribs chicken salami tenderloin pork loin jowl drumstick tri-tip brisket. Flank prosciutto tongue, andouille salami landjaeger cupim. Drumstick cow kielbasa meatloaf shankle, shank pancetta sirloin jerky turkey shoulder strip steak short loin pork loin pork chop. Ham ball tip meatball boudin spare ribs. Pig landjaeger capicola, meatloaf strip steak bresaola doner filet mignon fatback pork loin ham hock cow frankfurter andouille. Turkey porchetta boudin pork prosciutto pancetta jerky frankfurter pork loin rump strip steak t-bone. Pig bacon venison drumstick fatback capicola beef ribs tenderloin. Filet mignon ham fatback venison shankle."
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