/* global exports */
exports.defineTags = function(dictionary) {

   // When something is page safe it can be used in a page model in the knowledge that it isn't
   // going to be removed or significantly changed in a future release (this should be applied
   // to widgets and services)
   dictionary.defineTag("pageSafe", {
      onTagged: function(doclet, /*jshint unused:false*/ tag) {
         if (!doclet.pageSafe) { doclet.pageSafe = true; }
      }
   });

   // When a module is mixin safe it means that a 3rd party widgets can extend it
   dictionary.defineTag("extendSafe", {
      onTagged: function(doclet, /*jshint unused:false*/ tag) {
         if (!doclet.extendSafe) { doclet.extendSafe = true; }
      }
   });

   // When a module is mixin safe it means that a 3rd party can mix it into their own widgets
   // without worrying about it being removed
   dictionary.defineTag("mixinSafe", {
      onTagged: function(doclet, /*jshint unused:false*/ tag) {
         if (!doclet.mixinSafe) { doclet.mixinSafe = true; }
      }
   });

   // When a module is use safe it means that a 3rd party can reference it within their own
   // widgets and services - this typically applies to utility modules.
   dictionary.defineTag("useSafe", {
      onTagged: function(doclet, /*jshint unused:false*/ tag) {
         if (!doclet.useSafe) { doclet.useSafe = true; }
      }
   });

   // When a function is marked as "callable" it can be safely called by an extending module, but
   // it should not be overridden or extended
   dictionary.defineTag("callable", {
      onTagged: function(doclet, /*jshint unused:false*/ tag) {
         if (!doclet.callable) { doclet.callable = true; }
      }
   });

   // When a function is marked as "extendable" it can be safely overridden in an extending module
   // but the inherited behaviour MUST be called before any other code is executed in the extending
   // function
   dictionary.defineTag("extendable", {
      onTagged: function(doclet, /*jshint unused:false*/ tag) {
         if (!doclet.extendable) { doclet.extendable = true; }
      }
   });

   // When a function is marked as "overrideable" it can be safely overridden in an extending module
   // and that the extending module does not need to call the inherited behaviour. However it is
   // required that the function perform the designated task and return the expected data.
   dictionary.defineTag("overrideable", {
      onTagged: function(doclet, /*jshint unused:false*/ tag) {
         if (!doclet.overrideable) { doclet.overrideable = true; }
      }
   });

   // When a function is marked as "extensionPoint" it indicates that the purpose of the function
   // is for extending modules to override it to add additional capabilities.
   dictionary.defineTag("extensionPoint", {
      onTagged: function(doclet, /*jshint unused:false*/ tag) {
         if (!doclet.extensionPoint) { doclet.extensionPoint = true; }
      }
   });
};