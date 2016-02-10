/*global json,stringUtils*/
var sanitizedData = "";
var data = json.get("data");
if (data)
{
   sanitizedData = stringUtils.stripUnsafeHTML(data);
}
model.sanitizedData = sanitizedData;