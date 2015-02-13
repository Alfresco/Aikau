module.exports = function(grunt) {

   // The only vagrant targets we "should" ever need
   // Anything else should be run so infrequently, just
   // run src/test/vagrant/vagrant <args>
   grunt.registerTask("vcreate", [
      "shell:vagrantDestroy",
      "shell:vagrantInstallGuestPlugins",
      "shell:vagrantMountSharedFoldersFix"
   ]);
   grunt.registerTask("vup", ["shell:vagrantUp"]);
   grunt.registerTask("vdown", ["shell:vagrantHalt"]);

};