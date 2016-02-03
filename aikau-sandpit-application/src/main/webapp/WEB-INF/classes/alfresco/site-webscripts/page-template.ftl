<#assign theme = (page.url.args.theme!theme)?html />

<#macro templateHeader doctype="strict">

   <#if doctype = "strict">
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
   <#else>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
   </#if>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
   <title>Aikau Sandpit</title>
   <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
   
   <#-- Note that it's necessary to import the Sinon libs synchronously because version 1.10.3 does not support AMD and
        breaks when used with the Aikau widgets. This ensures that the global "sinon" object is available when required -->
   <script type="text/javascript" src="${url.context}/res/js/lib/sinon-1.17.2/lib/sinon-server-1.17.2.js"></script> 

   <@generateMessages type="text/javascript" src="${url.context}/service/messages.js" locale="${locale}"/>
   
   <#-- Bootstrap Dojo -->
   <@createComponent scope="global" regionId="bootstrap" sourceId="global" uri="/surf/dojo/bootstrap"/>
   <@region scope="global" id="bootstrap" chromeless="true"/>

   <link rel="stylesheet" type="text/css" href="${url.context}${sitedata.getDojoPackageLocation('dijit')}/themes/claro/claro.css"/>
   <@outputJavaScript/>
   <@outputCSS/>

   <#-- Template Resources (nested content from < @templateHeader > call) -->
   <#nested>
   
   <#-- Component Resources from .get.head.ftl files or from dependency directives processed before the
        <@outputJavaScript> and <@outputCSS> directives. -->
   ${head}
</head>
</#macro>

<#--
   Template "templateBody" macro.
   Pulls in main template body.
-->
<#macro templateBody>
<body id="Share" class="claro alfresco-share">
<#nested>
</#macro>

<#--
   Template "templateFooter" macro.
   Pulls in template footer.
-->
<#macro templateFooter>
   <div class="sticky-footer">
<#-- Template-specific footer markup -->
<#nested>
   </div>
<#-- This function call MUST come after all other component includes. -->
   <div id="alfresco-yuiloader"></div>
</body>
</html>
</#macro>

