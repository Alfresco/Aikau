/* Consolidated configuration file for the grunt tasks */
module.exports = {

   // Files/filesets
   files: {
      alfTestModels: "src/test/resources/alfresco_model_files.json",
      app: "src/main/resources/alfresco/**",
      app2: "src/main/resources/aikau/**",
      coverageReports: "code-coverage-reports/*.json",
      css: "src/main/resources/**/*.css",
      gruntFile: "Gruntfile.js",
      gruntTasks: "resources/grunt/**/*.js",
      html: "src/main/resources/alfresco/**/*.html",
      js: "src/main/resources/alfresco/**/*.js",
      jsdocConfig: "conf.json",
      jsdocReadme: "resources/jsdoc/templates/alfresco/README.md",
      reporter: "src/test/resources/reporters/ConcurrentReporter.js",
      test: "tests/alfresco/**",
      testApp: "src/test/resources/testApp/WEB-INF/classes/alfresco/site-webscripts/**",
      testPageDescriptors: "src/test/resources/testApp/WEB-INF/classes/alfresco/site-webscripts/**/*.get.desc.xml",
      testFramework: "src/test/resources/testApp/js/aikau/testing/**",
      testModel: "src/test/resources/alfresco/**/*.json",
      testScreenshots: "src/test/screenshots/*.png",
      testScripts: "src/test/resources/alfresco/**/*.js"
   },

   // Directories
   dir: {
      appTarget: "target/classes/META-INF/js/aikau",
      appTargetDirs: "target/classes/META-INF/js/aikau/*",
      basePackage: "alfresco",
      code: "./",
      coverage: "code-coverage-reports",
      docs: "docs",
      jsdoc: "src/main/resources/alfresco",
      jsdocTemplates: "resources/jsdoc/templates/alfresco",
      main: "src/main/resources/alfresco",
      mainInstrumented: "src/main/resources/alfrescoInst",
      nodeBin: "node_modules/.bin/",
      root: "./",
      testResources: "src/test/resources",
      testReports: "test_reports",
      vagrant: "resources/vagrant"
   },

   // Require-everything settings
   requireEverything: {
      exclusions: [
         "alfresco/charts/ccc/BarChart",
         "alfresco/charts/ccc/Chart",
         "alfresco/charts/ccc/ChartsView",
         "alfresco/charts/ccc/DonutChart",
         "alfresco/charts/ccc/PieChart",
         "alfresco/editors/TinyMCE",
         "alfresco/external-doc",
         "alfresco/forms/controls/AceEditor",
         "alfresco/forms/controls/CodeMirrorEditor",
         "alfresco/reports/Report",
         "alfresco/reports/SiteContentReport",
         "alfresco/reports/TopSiteContributorReport"
      ],
      pathRegex: /^src\/main\/resources\/(.+)\.js$/,
      template: "src/test/resources/RequireEverything.template.js",
      widget: "src/test/resources/testApp/js/aikau/testing/RequireEverything.js"
   }
};