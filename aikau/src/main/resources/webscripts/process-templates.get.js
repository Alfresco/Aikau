// This file is just for sketching out some ideas for WebScripts to parse/save Aikau templates for remote pages...


// An example template might look like this:
var template = {
   name: "alfresco/layout/HorizontalWidgets",
   config: {
      widgets: [
         {
            name: "alfresco/layout/ClassicWindow",
            config: {
               title: "",
               widgets: [

               ],

               // Flag to indicate that this has attributes to be exposed in the template
               // _alfIncludeInTemplate: true,

               // "_alfTemplateMapping_" is a prefix, "x1" would be a GUID
               _alfTemplateMapping_x1: {
                  
                  // This is the property to expose via the template...
                  property: "title",

                  // These values would override the default label/description for the model...
                  label: "Window title",
                  description: "Enter the title for the window"
               },

               // QUESTION: Should here be a distinction between config attributes and drop-zones?
               _alfTemplateMapping_x2: {
                  
                  property: "widgets",
                  label: "Window widgets",
                  description: "The widgets to display in the window"
               }

            }
         }
      ]
   }
};

// An actual use of a template might look like this:
var instance = [{
   name: "alfresco/layout/VerticalWidgets",
   config: {
      widgets: [
         {
            _alfTemplateName: "template1", // In actual fact this is more likely to be a nodeRef
            config: { 
               x1: "My Template Window",
               x2: [
                  {
                     name: "alfresco/logo/Logo"
                  }
               ]
            }
         }
      ]
   }
}];

// We'd then want to be able to convert the instance into a usable model...
// 
// -) Look for _alfTemplateName in the model
// -) At the locaion of a template
// 0) Load and clone the template
// 1) Iterate over the keys in the config...
// 2) For each key... look up prefix+key in the model
// 3) Get the property to set from the value of prefix+key
// 4) Set the value on that property in the cloned template with the value from the instance
// 5) Insert template contents before the template object
// 6) Delete the template reference



function findObject(object, parameters) {
   if (!parameters.ancestors)
   {
      parameters.ancestors = [];
   }

   // Push the current object into the ancestors array for the purpose of recursion...
   // We're going to need to get the object ancestors...
   parameters.ancestors.push(object);

   if (Array.isArray(object))
   {
      object.forEach(function(child, index) {
         parameters.ancestors.push(index); // Push the index of the current object in the parent array
         findObject(child, parameters);
         parameters.ancestors.pop(); // Pop the index...
      });
   }
   else if (typeof object === "object")
   {
      // Iterate over the object keys...
      Object.keys(object).forEach(function(key) {

         if (key.startsWith(parameters.prefix))
         {
            // Do some stuff with the object...
            if (typeof parameters.processFunction === "function")
            {
               parameters.processFunction.call(this, {
                  key: key,
                  object: object[key],
                  config: parameters.config,
                  ancestors: parameters.ancestors
               });
            }
            else
            {
               // TODO: Log that the processFunction was not defined or was not a function
            }
         }
         else
         {
            // Recurse into the object...
            findObject(object[key], parameters);
         }
      });
   }

   // Pop the last ancestor as we exit the recursion...
   parameters.ancestors.pop();
}

// Processes all templates found in the supplied widgets array...
function processTemplates(widgets) {
   findObject(widgets, {
      prefix: "_alfTemplateName",
      processFunction: processTemplate
   });
}

// Step 3...
// ancestors: _alfTemplateMapping_x1, config, 0, widgets


// Loads a template from the Repository...
function loadTemplate(templateName) {
   return template;
}




// Load a template
// Set the exposed configuration...
// 
// object = "template1"
// ancestors = [
//   {
//    _alfTemplateName: "template1", // In actual fact this is more likely to be a nodeRef
//    config: { 
//       x1: "My Template Window",
//       x2: [
//          {
//             name: "alfresco/logo/Logo"
//          }
//       ]
//    }
// }
//  ]
function processTemplate(parameters) {

   // The object should actually be a string (i.e. the name or nodeRef of the template)...
   if (typeof parameters.object === "string" &&
       parameters.ancestors)
   {
      // TODO: load the template...
      var loadedTemplate = loadTemplate(parameters.object);

      // Get the parent in order to get the "config" to apply to the template...
      var parent = parameters.ancestors[parameters.ancestors.length-1];
      if (parent.config)
      {
         // Set the template configuration points...
         // findObject(loadedTemplate, "_alfTemplateMapping_", parent.config, null, setTemplateConfiguration);
         findObject(loadedTemplate, {
            prefix: "_alfTemplateMapping_", 
            config: parent.config,
            processFunction: setTemplateConfiguration
         });

         // Swap the loaded template back into the correct location...
         var arrayToUpdate = parameters.ancestors[parameters.ancestors.length-3];
         var indexToSwapForTemplate = parameters.ancestors[parameters.ancestors.length-2];
         arrayToUpdate.splice(indexToSwapForTemplate, 1, loadedTemplate);
      }
      else
      {
         // TODO: Log missing config (not able to set configure template without values!)
      }
   }
   else
   {
      // TODO: Log incorrect object type - string expected for template name/nodeRef
   }
}


// Sets the values in the supplied template...
function setTemplateConfiguration(parameters) {
   if (parameters.key &&
       parameters.config && 
       parameters.object && 
       parameters.object.property &&
       parameters.ancestors)
   {
      // Get the last ancestor as this will be the "config" object of a widget in the 
      // template that has a property to be set...
      var parent = parameters.ancestors[parameters.ancestors.length-1]; 

      // The key will contain a prefix "_alfTemplateMapping_" and then the actual value to be set...
      var valueProperty = parameters.key.substring("_alfTemplateMapping_".length);
      if (typeof valueProperty !== undefined)
      {
         parent[parameters.object.property] = parameters.config[valueProperty];

         delete parent["_alfTemplateMapping_" + valueProperty];
      }
      else
      {
         // TODO: Log missing value attribute (e.g. the attribute to get the value from to set in the template)
      }
   }
   else
   {
      // TODO: Log incorrect parameters argument - missing some attributes
   }
}