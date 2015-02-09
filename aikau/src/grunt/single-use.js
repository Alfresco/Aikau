/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Grunt tasks to perform one-off activities
 */
module.exports = function(grunt, alfConfig) {

   grunt.registerTask("generate-webscripts-from-models", "Generate webscripts from the json models in the tests area", function() {
      grunt.task.run("folder_list:alf_test_models");
      grunt.task.run("write-webscripts-from-models");
   });

   grunt.registerTask("write-webscripts-from-models", "A task for writing the webscripts from the json models in the tests area", function() {

      var files = grunt.file.readJSON(alfConfig.dir.testResources + "/" + alfConfig.alfTestModels),
         xmlTemplate = grunt.file.read(alfConfig.dir.testResources + "/webscript_template.get.desc.xml"),
         ftlTemplate = grunt.file.read(alfConfig.dir.testResources + "/webscript_template.get.html.ftl"),
         jsTemplate = grunt.file.read(alfConfig.dir.testResources + "/webscript_template.get.js");

      for (var i = 0; i < files.length; i++) {
         var filename = files[i].filename,
            filepath = files[i].location.replace(filename, ""),
            filestem = filename.replace(".json", "") .replace("_TestPage", ""),
            filecontent = grunt.file.read(files[i].location),

            destfilepath = filepath.replace("tests/", "test_webscripts/") .replace("/page_models", ""),
            destfilenamexml = destfilepath + filestem + ".get.desc.xml",
            destfilenameftl = destfilepath + filestem + ".get.html.ftl",
            destfilenamejs = destfilepath + filestem + ".get.js";

         grunt.file.write(destfilenamexml, xmlTemplate.replace("{0}", filestem) .replace("{1}", filestem) .replace("{2}", filestem));
         grunt.file.write(destfilenameftl, ftlTemplate);
         grunt.file.write(destfilenamejs, jsTemplate.replace("{0}", filecontent.replace(/"([^"]*)"( )?:/g, "$1:")));
      }

      grunt.log.writeln("Finished writing webscripts");

   });

};