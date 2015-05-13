## Configuring a Remote Repository

The tutorial has been written based on the assumption that as a developer learning how to use Aikau you will have a local Alfresco Repository (e.g. an installation of Alfresco hosted on the same machine that you are developing on). However at some stage you will probably want an Aikau client created from the Maven Archetype to connect to an Alfresco Repository hosted on another server. 

The `<PROJECT>/src/main/webapp/WEB-INF/surf.xml` file that is created by the Maven Archetype includes some commented configuration that you can use to achieve this. Scroll to the bottom of the file and you should find the following commented XML:

```XML
<config evaluator="string-compare" condition="Remote">
  <remote>
    <endpoint>
       <id>alfresco-noauth</id>
       <name>Alfresco - unauthenticated access</name>
       <description>Access to Alfresco Repository WebScripts that do not require authentication</description>
       <connector-id>alfresco</connector-id>
       <endpoint-url>http://<domain>:<port>/alfresco/s</endpoint-url>
       <identity>none</identity>
    </endpoint>

    <endpoint>
       <id>alfresco</id>
       <name>Alfresco - user access</name>
       <description>Access to Alfresco Repository WebScripts that require user authentication</description>
       <connector-id>alfresco</connector-id>
       <endpoint-url>http://<domain>:<port>/alfresco/s</endpoint-url>
       <identity>user</identity>
    </endpoint>
  </remote>
</config>
```

To make your Aikau client connect to a remote Alfresco Repository you simply need to uncomment the XML and then substitute the `domain` and `port` values in both the `alfresco-noauth` and `alfresco` endpoints to be the location of the remote Alfresco Repository that you wish to use.

After making the changes and saving the file you should then start (or restart) the server and you will be able to logon using the authentication credentials associated with that server.

**NOTE: Some of the tutorial chapters require admin privileges. If you don't have admin access to the Alfresco Repository that you use then you not be able to complete the entire tutorial**

