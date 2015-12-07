<import resource="classpath:alfresco/site-webscripts/imports/playground.lib.js">

buildPageModel({
   title: "alfresco/logo/Logo",
   description: "The Logo widget is intended for rendering company logos in Alfresco Share.",
   examples: [
      {
         title: "Basic Logo",
         description: "A logo can be used without any configuration",
         model: [
            {
               name: "alfresco/logo/Logo"
            }
         ]
      },
      {
         title: "Configuring an altenative CSS class",
         description: "A number of logos are provided that can be selected by configuring the \"logoClasses\" attribute",
         model: [
            {
               name: "alfresco/logo/Logo",
               config: {
                  logoClasses: "surf-logo-large"
               }
            }
         ]
      }
   ]
});
