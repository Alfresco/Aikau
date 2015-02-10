module.exports = function(grunt) {

   // Bring up an instance of vagrant
   grunt.registerTask("vup", [
      "shell:vagrantUp",
      "shell:vagrantProvision"
   ]);

   // Provision an instance of vagrant
   grunt.registerTask("vpro", [
      "shell:vagrantProvision"
   ]);

   // Take down an instance of vagrant
   grunt.registerTask("vdown", [
      "shell:vagrantHalt"
   ]);

   // Rebuild a vagrant instance.
   grunt.registerTask("vclean", [
      "shell:vagrantDestroy",
      "shell:vagrantUp",
      "shell:vagrantProvision"
   ]);
};