Next: [Getting Started](./Tutorial1.md)

## About This Tutorial
This tutorial has been developed to help developers understand the Aikau framework. Although Aikau was developed to support the continuing development of the Alfresco Share client it can also be used to develop standalone clients. 

Whilst this tutorial describes steps that can be taken to build a client it should be recognised that the resulting client is not intended to provide the ideal user interface, but that instead the design decisions were made to progress the readers understanding of techniques and the available resources. 

It is also important to understand that only existing Alfresco Repository APIs were used to create the sample client which in turn places limitations on what can be achieved - it is expected that when writing a dedicated client that additional Alfresco Repository APIs may be required to meet user-interface goals. 

## What to do if Things go Wrong
Great care has been taken to ensure that the steps and sample code provided in this tutorial are accurate, however during the review period it was found that people were still able to make the occasional mistake.

1. If something goes wrong then it is recommended to follow these simple steps:
2. Carefully check your code against the sample code (for example, make sure you’ve updated the correct section or file).
3. [Refresh WebScripts](./RefreshingWebScripts.md) - this shouldn’t be necessary unless you’ve made seriously deviated from the described path, but it never hurts to be sure!
4. [Clear Surf dependency caches](./ClearingDependencyCaches.md)
5. Enable logging (see [Tutorial 4](./Tutorial4.md)) and check the browser console for errors
6. Check the Jetty server standard out log for errors
7. Check to see if you have the latest version of Aikau (the Maven Archetype should use the latest release, but releases are very frequent so one or more releases may have been made before you finish the tutorial!)
8. Raise an issue and report the problem!

If all else fails, turn it off and on again (e.g. restart the server, clear the browser caches)

Next: [Getting Started](./Tutorial1.md)
