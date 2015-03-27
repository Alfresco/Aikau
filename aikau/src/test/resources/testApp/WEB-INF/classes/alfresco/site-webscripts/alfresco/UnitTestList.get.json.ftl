
{
   "length": ${family.scripts?size},
   "unitTestPages": [
      <#list family.scripts as script>
         <#assign desc = script.description>
         {
            "shortname": "${desc.shortName!""}",
            "url": "${desc.URIs[0]}",
            "description": "${desc.description!""}"
         }<#if script_has_next>,</#if>
         </#list>
   ]
}