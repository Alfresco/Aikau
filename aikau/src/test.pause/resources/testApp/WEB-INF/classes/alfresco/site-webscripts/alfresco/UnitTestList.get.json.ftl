
{
   "totalRecords": ${totalRecords},
   "startIndex": ${startIndex},
   "unitTestPages": [
      <#assign count = 0>
      <#list scripts as script>
         <#if script?is_hash>
         <#assign desc = script.description>
         <#if count != 0>,</#if>
         {
            "shortname": "${desc.shortName!""}",
            "url": "${desc.URIs[0]}",
            "description": "${desc.description!""}"
         }<#assign count = count + 1>
         </#if>
      </#list>
   ]
}