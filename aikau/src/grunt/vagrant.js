module.exports = function(grunt) {

    // Rebuild a vagrant instance.
   grunt.registerTask("vcreate", [
      "shell:vagrantInstallGuestPlugins",
      "shell:vagrantMountSharedFoldersFix",
      "shell:vagrantUp",
      "shell:vagrantProvision",
      "shell:vagrantHalt",
      "shell:vagrantUp",
      "shell:vagrantProvision"
   ]);

   grunt.registerTask("vdestroy", [
      "shell:vagrantDestroy"
   ]);

   // Bring up an instance of vagrant
   grunt.registerTask("vup", [
      "shell:vagrantUp"
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
      "shell:vagrantInstallGuestPlugins",
      "shell:vagrantMountSharedFoldersFix",
      "shell:vagrantUp",
      "shell:vagrantProvision"
   ]);
};
