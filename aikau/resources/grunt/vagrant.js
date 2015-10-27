module.exports = function(grunt) {

   // The only vagrant targets we "should" ever need
   // Anything else should be run so infrequently, just
   // run resources/vagrant/vagrant <args>
   grunt.registerTask("vcreate", [
      "shell:vagrantDestroy",
      "shell:vagrantInstallGuestPlugins",
      "shell:vagrantUp",
      "shell:vagrantMountSharedFoldersFix",
      "shell:vagrantReloadAndProvision"
   ]);
   grunt.registerTask("vup", ["shell:vagrantUpAndProvision"]);
   grunt.registerTask("vdown", ["shell:vagrantHalt"]);
   grunt.registerTask("vrestart", ["vdown", "vup"]);

};