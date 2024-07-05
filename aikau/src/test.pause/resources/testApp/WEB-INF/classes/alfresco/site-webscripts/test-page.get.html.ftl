<#include "./unit-test-template.ftl" />
<@templateHeader />

<@templateBody>
   <div id="content">
      <#assign regionId = page.url.templateArgs.webscript?replace("/", "-")/>
      <@autoComponentRegion uri="/${page.url.templateArgs.webscript}"/>
   </div>
   <#-- When livereload running (i.e. during development) this will connect to it -->   
   <script src="//localhost:35729/livereload.js"></script>
</@>
