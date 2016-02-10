# Aikau Sandpit

### About the Sandpit
The Sandpit application is hosted by Alfresco [here](https://aikau-sandpit.alfresco.com/aikau-sandpit/ "Link to Sandpit application online"). It is provided as an education tool for demonstrating available widgets and allowing dynamic experimentation through configuration. It was originally created during the 1.0.50 release so does not yet contain examples for every Aikau widget available. Examples should be created for all new widgets from now on (as part of the Aikau delivery team definition of "done") and it is hoped that the team (with assistance from the Alfresco community) will be able to add examples for all the existing widgets.

### Contributing to the Sandpit
The example pages for the Sandpit can be found in the [/aikau-sandpit-application/src/main/webapp/WEB-INF/webscripts/pages](https://github.com/Alfresco/Aikau/tree/feature/AKU-748_Sandpit/aikau-sandpit-application/src/main/webapp/WEB-INF/classes/alfresco/site-webscripts/pages "Link to pages folder") folder. Each example page is defined as a WebScript. To contribute a new example you should follow these steps:

##### Create WebScript files
Create the WebScript files in a suitable sub-folder for the widget type that you are creating the example for (i.e. and "alfresco/buttons/AlfButton" widget example should go in a "pages/buttons" folder). The four files you need to create are:

###### Descriptor (example.get.desc.xml):
``` XML
<webscript>
   <shortname>Example name</shortname>
   <description>Example description</description>
   <family>ExamplePage</family>
   <url>/PathToExample</url>
</webscript>
```

###### Template (example.get.html.ftl):
``` HTML
<@processJsonModel/>
```

###### Properties (example.get.properties):
``` JavaScript
page.title=Example Page Title
page.description=Example page description
example1.title=Title for individual example
example1.description=Description of example
```

###### Controller (example.get.js):
``` JavaScript
<import resource="classpath:alfresco/site-webscripts/imports/sandpit.lib.js">

buildPageModel({
   title: "page.title",
   description: "page.description",
   jsdoc: "https://dev.alfresco.com/resource/docs/aikau-jsdoc/<link to JSDoc for widget>.html",
   examples: [
      {
         title: "example1.title",
         description: "example1.description",
         model: [
            
         ]
      }
   ]
});

```

The `examples` attribute should be an array of objects with the attributes:
* title
* description
* model

...where the `model` is an Aikau widgets model to be rendered on the page.

##### Mock data
Some widgets require services to be present on the page in order to demonstrate their capabilities. There is no Alfresco Repository associated with the Sandpit application so all data is provided through mocking. We have currently provided mock data for previews and list data and will look to provide more mock data in the future.

To use services and mockdata on the page you can use the `services` and `mockXhrWidgets` attributes in your page model, e.g:

```javascript
services: ["alfresco/services/DocumentService"],
mockXhrWidgets: [
  {
    name: "alfresco/testing/NodesMockXhr"
  }
],
```

##### Localization
Please also remember to put all display strings into the associated `.properties` file of the WebScript. At the moment we are *not* translating the Sandpit, but we'd like to make it as easy as possible to do so in the future if required.
