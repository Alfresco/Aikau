// This library file provides a convenient way in which services provided from multiple libraries can be filtered 
// against each other to ensure that there are no duplicates (e.g. you want to avoid having two DialogServices on a
// page otherwise you'll get two dialogs for each request!).
function alfAddUniqueServices(currentServices, servicesToFilter) {
   // Add the current services into the array that will ultimately be returned...
   // Unique services not already defined (or that are configured with a different pubSubScope
   // will be added) as well...
   var filteredServices = [].concat(currentServices);

   // There's only filtering to do with we have been provided with some services to
   // filter against an array of current services...
   if (servicesToFilter && servicesToFilter.length &&
       currentServices && currentServices.length)
   {
      // Re-usable function for getting service names (since services can either
      // be defined in an array as Strings or Objects)...
      var getServiceName = function(s) {
         var name;
         if (typeof s === "string")
         {
            name = s;
         }
         else if (s.name)
         {
            name = s.name;
         }
         return name;
      };

      // Iterate over the array of services to compare against the current services...
      for (var i=0; i<servicesToFilter.length; i++)
      {
         // Get the name of the current service to filter...
         var a = servicesToFilter[i];
         var foundService = false;
         var filterServiceName = getServiceName(a);
         for (var j=0; j<currentServices.length; j++)
         {
            var b = currentServices[j];
            var currentServiceName = getServiceName(b);
            if (currentServiceName === filterServiceName)
            {
               // Found a matching service - we now need to check it's scoping...
               if (a.config && b.config && a.config.pubSubScope !== b.config.pubSubScope)
               {
                  // Both services are configured with the different pubSubScope and therefore can 
                  // co-exist...
                  filteredServices.push(a);
               }
               else if (!a.config && (b.config && b.config.pubSubScope))
               {
                  // The service to filter has no scope, but the current service does have a scope (or the empty string as a scope)
                  filteredServices.push(a);
               }
               else if (!b.config && (a.config && a.config.pubSubScope))
               {
                  // The current service has no scope, but the service to filter does have a scope (or the empty string as a scope)
                  filteredServices.push(a);
               }
               else
               {
                  // Neither service is scoped or both are scoped to the same scope (so they are duplicates)...
               }
               foundService = true;
               break;
            }
         }

         if (!foundService)
         {
            // The service doesn't already exist - add it now...
            filteredServices.push(a);
         }
      }
   }
   return filteredServices;
}