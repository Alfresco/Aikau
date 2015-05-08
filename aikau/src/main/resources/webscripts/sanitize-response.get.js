/* global args */
/* global remote */
/* global stringUtils */
/* global jsonUtils */
var response = {};
if (args.ws)
{
   var connector = remote.connect("alfresco");
   var json = connector.get(encodeURI(args.ws));
   try
   {
      // PLEASE NOTE: Very deliberate usage of == in the following line
      if (/*jshint eqeqeq:false*/ json.status == 200)
      {
         var proxyResponse = JSON.parse(json.response);
         var itemsProperty = args.items || "items";
         var attributeProperty = args.attribute || "content";
         if (proxyResponse[itemsProperty])
         {
            var items = proxyResponse[itemsProperty];
            for (var i = 0, il = items.length; i < il; i++)
            {
               items[i].content = stringUtils.stripUnsafeHTML(items[i][attributeProperty]);
            }
            response = proxyResponse; 
         }
      }
   }
   catch(e)
   {
      // No action. Allow empty response to pass through.
   }
}
// PLEASE NOTE: Intentional use of jsonUtils over JSON here...
model.sanitizedResponse = jsonUtils.toJSONString(response);