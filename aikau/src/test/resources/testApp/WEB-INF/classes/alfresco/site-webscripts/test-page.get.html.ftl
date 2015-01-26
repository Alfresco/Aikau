<#include "./unit-test-template.ftl" />
<@templateHeader />

<@templateBody>
   <div id="content">
      <#assign regionId = page.url.templateArgs.webscript?replace("/", "-")/>
      <@autoComponentRegion uri="/${page.url.templateArgs.webscript}"/>
   </div>
</@>
