define([], 
       function () {
   
   if (typeof console !== 'object') {
      // IE<10 does not provide a global console object when Developer Tools is turned off
      return {};
   }

   var hasGrouping = 'group' in console && 'groupEnd' in console;
   
   var passed = [],
       failed = [];
   var consoleReporter = {
      
     '/test/pass': function (test) {
         passed.push(test);
      },

      '/test/fail': function (test) {
         var error = test.error;
         var message = error.name + ': ' + (error.message || 'Unknown error');
         console.error('TEST FAILURE: ' + (hasGrouping ? test.name : test.id) + ' >> ' + message);
         failed.push(test);
      },

      '/runner/end': function() {

         console.log("");
         console.log("Passing Tests...");
         console.log("~~~~~~~~~~~~~~~~");
         console.log("");
         for(var i=0; i<passed.length;i++)
         {
            var test = passed[i];
            console.log((hasGrouping ? test.name : test.id) + ' (' + test.timeElapsed + 'ms)');
         }
         console.log("");
         console.log("Failing Tests...");
         console.log("~~~~~~~~~~~~~~~~");
         console.log("");
         for(var i=0; i<failed.length;i++)
         {
            var test = failed[i];
            var error = test.error;
            var message = error.name + ': ' + (error.message || 'Unknown error');
            console.log((hasGrouping ? test.name : test.id) + ' >> ' + message);
         }
         console.log("");

         var totalTests = passed.length + failed.length;
         var message = 'Test Run Complete: %d/%d tests failed';
         console.log(message, failed.length, totalTests);
      },

      '/tunnel/start': function () {
         console.log('Starting tunnel...');
      },

      '/tunnel/status': function (tunnel, status) {
         console.log(status);
      }
   };
   return consoleReporter;
});
