/* Consolidated configuration file for the grunt tasks */
module.exports = {

   // Files/filesets
   files: {
      alfTestModels: "src/test/resources/alfresco_model_files.json",
      alfWidgets: "src/test/resources/alfresco_widgets.json",
      coverageReports: "code-coverage-reports/*.json",
      css: "src/main/resources/**/*.css",
      html: "src/main/resources/alfresco/**/*.html",
      js: "src/main/resources/alfresco/**/*.js",
      jsdocConfig: "conf.json",
      jsdocReadme: "src/jsdoc-templates/alfresco/README.md",
      test: "tests/alfresco/**",
      testModel: "src/test/resources/alfresco/**/*.json"
   },

   // Directories
   dir: {
      code: "./",
      coverage: "code-coverage-reports",
      coverageTemp: "code-coverage-reports/temp",
      docs: "docs",
      jsdoc: "src/main/resources/alfresco",
      jsdocTemplates: "src/jsdoc-templates/alfresco",
      jsInst: "src/main/resources/alfrescoInst",
      nodeBin: "node_modules/.bin/",
      root: "./",
      testResources: "src/test/resources",
      vagrant: "src/test/vagrant"
   },

   // Require-everything settings
   requireEverything: {
      exclusions: [
         "aikauTesting/mockservices/CreateContentMockXhr",
         "aikauTesting/mockservices/DocumentLibraryMockXhr",
         "aikauTesting/mockservices/HeaderMockXhr",
         "aikauTesting/mockservices/PaginationMockXhr",
         "aikauTesting/mockservices/PreviewMockXhr",
         "aikauTesting/mockservices/SearchMockXhr",
         "aikauTesting/mockservices/SearchScrollMockXhr",
         "aikauTesting/mockservices/SiteMockXhr",
         "aikauTesting/mockservices/SiteMockXhr",
         "aikauTesting/mockservices/UploadMockXhr",
         "aikauTesting/mockservices/UserMockXhrBad",
         "aikauTesting/mockservices/UserMockXhrGood",
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
      template: "RequireEverything.template.js",
      widget: "src/test/resources/testApp/js/aikau/testing/RequireEverything.js",
      widgetsPrefix: "src/main/resources/",
      widgetsSuffix: ".js"
   }
};