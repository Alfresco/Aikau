<@markup id="DOJO_MODULE_MAPPING_PATCHES" target="setDojoConfig" action="after" scope="global" >

   <script type="text/javascript">
      dojoConfig.map = {
         "*": {
            "dojo/touch": "alfresco/patches/touch"
         }
      };
   </script>
</@>