## Tutorial 1 - Getting Started
If you're already familiar with what Aikau is then you're probably here for an in-depth tutorial on how to use it – but for those who aren't this tutorial should serve as an example of how fast it can be to develop a new client that accesses data from an Alfresco repository.

In this tutorial we're going to create a very simple application that allows a user to login and access their personal home folder in the Repository.

The only thing required to complete the tutorial is an installed and operational instance of Alfresco. If you don't have Alfresco installed then you can download and install it from [LINK] here. It’s recommended that you download and install a new version of Alfresco Community because you’ll need administrator privileges to work through the entire tutorial.

### Step 1. Create a new client via Maven Archetype
From the command line of your operating system, create (or navigate to) a folder in which you wish to create your new client project and then run the following command:

> mvn archetype:generate -DarchetypeCatalog=https://artifacts.alfresco.com/nexus/content/groups/public/archetype-catalog.xml -DarchetypeGroupId=org.alfresco -DarchetypeArtifactId=aikau-sample-archetype

You will be prompted to enter the following parameters for your project:
* groupId
* artifactId
* version
* package

If you’re not familiar with Maven then the groupId should be related to your organization (e.g. “org.alfresco”) the artifactId should be the name of your project (e.g. “aikau-client”) and you can just hit the enter key to accept the defaults for the version and package.

When the project has been generated you should see the following in the terminal output:

When the project has been generated you should see the following in the terminal output:

> [INFO] BUILD SUCCESS

A folder will have been created with the same value as you provided for the “artifactId” parameter. Change to this directory and then run:

> mvn install

Which will build your new Aikau project.

## Step 2. Login to your new client
Make sure you have an Alfresco Repository up and running, then start your new application by running:

> mvn jetty:run

...from a command line. After small pause (don’t worry while this happens, it is busy!) the Jetty server will have started, when you see the line:

> [INFO] Started Jetty Server

...you’ll be able to access your new application at:

> http://localhost:8090/aikau-sample/

You will automatically be re-directed to the default login page at which you can enter the credentials of a valid user of your Alfresco repository and you will be taken to the default home page.



