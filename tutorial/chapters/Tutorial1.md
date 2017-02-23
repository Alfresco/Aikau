Previous: [About This Tutorial](./About.md),
Next: [How to Create a new Widget](./Tutorial2.md)

## Tutorial 1 - Getting Started
If you're already familiar with what Aikau is then you're probably here for an in-depth tutorial on how to use it – but for those who aren't this tutorial should serve as an example of how fast it can be to develop a new client that accesses data from an [Alfresco](http://www.alfresco.com/ "Link to Alfresco home page") repository.

In this tutorial we're going to create a very simple application that allows a user to login and access their personal home folder in the Repository.

The only thing required to complete the tutorial is an installed and operational instance of Alfresco. If you don't have Alfresco installed then you can download and install it from [here](http://www.alfresco.com/products/community "Alfresco Community Download Page"). It’s recommended that you download and install a new version of Alfresco Community because you’ll need administrator privileges to work through the entire tutorial.

**NOTE: If you wish to use an Alfresco Repository that is not locally hosted then you should follow the instructions described [here](./UsingRemoteRepository.md "Link to instructions for configuring a remote Alfresco Repository") to update the default client configuration.**

### Step 1. Create a new client via Maven Archetype
From the command line of your operating system, create (or navigate to) a folder in which you wish to create your new client project and then run the following command:

```
mvn org.apache.maven.plugins:maven-archetype-plugin:2.4:generate -DarchetypeCatalog=https://artifacts.alfresco.com/nexus/content/groups/public/archetype-catalog.xml -DarchetypeGroupId=org.alfresco -DarchetypeArtifactId=aikau-sample-archetype -DarchetypeVersion=RELEASE
```

You will be prompted to enter the following parameters for your project:
* groupId
* artifactId
* version
* package

If you’re not familiar with Maven then the groupId should be related to your organization (e.g. “org.alfresco”) the artifactId should be the name of your project (e.g. “aikau-client”) and you can just hit the enter key to accept the defaults for the version and package.

When the project has been generated you should see the following in the terminal output:

> [INFO] BUILD SUCCESS

A folder will have been created with the same value as you provided for the “artifactId” parameter. Change to this directory and then run:

```
mvn install
```

Which will build your new Aikau project.

### Step 2. Login to your new client
Make sure you have an Alfresco Repository up and running, then start your new application by running:

```
mvn jetty:run
```

...from a command line. After a small pause (don’t worry while this happens, it is busy!) the Jetty server will have started, when you see the line:

> [INFO] Started Jetty Server

...you’ll be able to access your new application at: [http://localhost:8090/aikau-sample/](http://localhost:8090/aikau-sample/ "Link to client")

You will automatically be re-directed to the default login page at which you can enter the credentials of a valid user of your Alfresco repository and you will be taken to the default home page.

**NOTE: There’s nothing particularly special about port 8090, it’s simply been selected in order to avoid conflicting with other ports that might in use (e.g. the Alfresco Repository). It can easily be changed by editing the pom.xml file of the Maven project.**

At the moment it’s quite empty, containing nothing more than a header and footer with a big empty space in the middle which we’re going to fill.

![alt text](../resources/Tutorial%201%20-%20Image%201.png "Your client login page")

![alt text](../resources/Tutorial%201%20-%20Image%202.png "Your client home page")

### Step 3. Show the user files
Currently the home page of your client has very little displayed on it. We're going to update this page by adding in the widgets and services that will render the contents of the user’s home folder.

To do this we need to add a DocumentList widget onto the page along with a view to render the contents of the list and the services required to retrieve the documents and folders to display.

Open the JavaScript controller file for the home page (`“<PROJECT>/src/main/webapp/WEB-INF/webscripts/pages/home.get.js”`) and find the comment:

```
// Add more widgets here !!!
```

At the end of the line before the comment add a comma (because we're about to add another object to the array of widgets) and then directly underneath that line add the following code:

```
{
  name: "alfresco/documentlibrary/AlfDocumentList",
  config: {
    rootNode: "alfresco://user/home",
    rawData: true,
    widgets: [
      {
        name: "alfresco/documentlibrary/views/AlfSimpleView"
      }
    ]
  }
}
```

Now reload the page in the browser (you won't need to restart the server). You should see the following:

![alt text](../resources/Tutorial%201%20-%20Image%203.png "Document List waiting for data")

The AlfDocumentList widget is renders a loading message (“Loading…”) and attempts to retrieve some data from the Alfresco Repository. We have not included anything in the page to service that request so the message is never replaced with any actual data. In order to service the request for data we’ll need to include a dedicated service on the page.

In the JavaScript controller find the comment:

```
// Add more services here !!!
```

At the end of the line before the comment add a comma (because we're about to add another object to the array) and then directly underneath the comment line add the following code:

```
"alfresco/services/DocumentService"
```

Reload the page and you should see a list of files for the currently logged in user. If you've logged in as “admin” then you will see the contents of “Company Home” which will look like this:

![alt text](../resources/Tutorial%201%20-%20Image%204.png "Document List populated with data from Alfresco Repository")

We’ll explore services in more detail in later tutorials (in fact you’ll be writing your own!) but for the time being all you need to know that Aikau provides a number of services that you can easily reuse. These are all located in the “alfresco/services” package.

You can now browse around the files but you won't be able to view an individual file yet (because the default document link is for an Alfresco Share specific page that does not exist in your application). Nor will you be able to do anything with the files (such as delete them) because the actions haven’t yet been configured yet. We’ll get to these in a later tutorials.

### Step 4. Improve Navigation
Although you can navigate into folders it’s not currently possible to navigate back out of them. There are lots of different ways in which we can address this (e.g. breadcrumb trails, navigation trees, etc) but as a simple solution we’ll add a button to navigate back to the parent of the current folder.

Add this to the model in the JavaScript controller directly above the `“alfresco/documentlibrary/AlfDocumentList”` entry you added earlier.

```
{
  name: "alfresco/buttons/AlfButton",
  config: {
    label: "Go to parent folder",
    iconClass: "alf-folder-up-icon",
    publishTopic: "ALF_DOCLIST_PARENT_NAV"
  }
},
```

When you refresh the page you should now see a button that can be used to navigate back to the parent folder.

![alt text](../resources/Tutorial%201%20-%20Image%205.png "Document List with parent folder navigation")

The key thing to note here is that the only link between the AlfDocumentList and the AlfButton is the topic that the button publishes on when clicked (defined by the “publishTopic” configuration attribute) which is subscribed to by the AlfDocumentList.

Aikau uses a publication/subscription (sometimes referred to as “PubSub”) [communication model](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern "Link to Wikipedia page") to ensure that there are no fixed relationships between widgets and services in order that they can be easily reused independently of each other. The “publishTopic” that we have configured is an example of a topic that is published when an action occurs - but there will only be reaction to this publication if something else is subscribing to that topic.

### Step 5. Add File Upload Support
Now let's make an update to allow the user to upload new content.

Add the following services to the page, in the same way that you added the DocumentService earlier.

```
"alfresco/services/ActionService",
"alfresco/services/UploadService",
"alfresco/services/DialogService"
```

Now refresh the page and then try dragging and dropping a file from your computer’s file-system onto the document list and you should see it successfully uploaded. Ensure you drop the file into the document list component area to trigger the drop-zone.

![alt text](../resources/Tutorial%201%20-%20Image%206.png "Document List with upload support")

### So What Was Happening?
You can jump straight to the [next tutorial](./Tutorial2.md "Link to next tutorial") if you want to continue developing your client, but if you want to understand more about what was happening on the page you created then read on...

If you’ve no experience with Alfresco (and in particular, WebScript) development then most of what you have just done will seem new to you.

You can find everything you need to know about WebScripts on the official [Alfresco documentation website](http://docs.alfresco.com/4.0/concepts/ws-architecture.html "Link to Alfresco Documentation") but the main thing to understand is that each page in your Aikau client is represented by a single WebScript.

WebScripts uses an [MVC pattern](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller "Link to Wikipedia") and for an Aikau page it is the controller where all the development takes place. The JavaScript controller is used to create a declarative model that represents the page to be rendered. This model consists of widgets, widget configuration and services - the main difference between a widget and a service is that the former will typically render some visible content onto the page when it loads, whereas a service “sits in the background” and services requests issued by widgets. 

Each widget and service is intended to serve a specific purpose. The AlfDocumentList manages the current state of a view of documents but the rendering of that view is handled by the AlfSimpleView widget (and the AlfSimpleView widget is in fact a “wrapper” around dozens of smaller widgets). The AlfDocumentList doesn’t access the Alfresco Repository for data, instead it publishes a request for data and the DocumentService handles that request by making the necessary XHR call to the Repository and publishing the data it retrieves.

If you really want to learn more about the inner workings of Aikau then you can watch [this presentation](https://www.youtube.com/watch?v=qcaotLDJq9U&noredirect=1 "Link to YouTube") from Alfresco Summit 2013  and read [this blog post](http://blogs.alfresco.com/wp/developer/2013/03/05/under-the-hood-of-the-surf-updates/ "Link to Alfresco Developer Blogs").

_You can [download the project files from here](../resources/aikau-tutorial_001.zip?raw=true) as they exist at the end of this tutorial._

Next: [How to Create a new Widget](./Tutorial2.md)


