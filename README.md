# Aikau

### About Aikau
#### What is Aikau?
Aikau is a meta-framework of custom JavaScript widgets designed to work with Alfresco. It is dependant upon the Surf framework but is not dependent upon Alfresco Share application.

The framework provides a suite of widgets that can be referenced in JSON models to build complete pages. These page models can be defined in WebScripts or remotely stored and rendered from an Alfresco Repository. This means that it possible to dynamically create and render new pages from within an application without needing to restart the server.
 
#### Simple Third Party Customizations
The page models are intended to be dynamically customizable through Surf extension modules meaning that a client (such as Alfresco Share) can be dynamically customized by third parties without needing to write any code. The modular approach means that it is easy for 3rd parties to provide custom widgets that are either completely new or extend the Aikau base.
Aikau extends the AMD (Asynchronous Module Definition) paradigm such that; a single widget encapsulates all of the HTML, CSS, JavaScript and localization properties that it needs and Surf ensures that only the required resources required by a page are loaded by the browser.
 
#### Cross-Framework Compatible
Surf uses the Dojo framework for AMD module loading and Aikau widgets make use of the Dojo templating capabilities but it is not limited to any single JavaScript framework. Aikau is intended to work with any JavaScript library by design and its widget library already makes use of JQuery, YUI, TinyMCE, Code Mirror and Sinon.
 
#### Testing
The atomic nature of the widgets means that they are easily unit testable and Aikau makes use of the Intern JavaScript testing framework, driven by Grunt and uses Vagrant for multi-platform, cross-browser testing. It uses node-coverage to capture code coverage results of its unit tests.

## Learning Aikau
We've written a tutorial that takes you through the process of building a standalone Aikau client. We're in the process of converting it into GitHub markdown files - the chapters that have been converted so far start [here](https://github.com/Alfresco/Aikau/blob/master/tutorial/chapters/About.md "Link to Tutorial").

There is also an [Alfresco Wiki page](https://wiki.alfresco.com/wiki/Aikau_framework "Link to Alfresco Wiki") that collates avaialble Aikau educational material.

## Contributing to Aikau
We will gladly be welcoming contributions from the Alfresco Community - however, we would be grateful if you could please review and adhere to the [contribution acceptance criteria](https://github.com/Alfresco/Aikau/wiki/Contribution-Acceptance-Criteria) before generating any pull requests.

Setup instructions are available for [Linux](https://github.com/Alfresco/Aikau/wiki/Aikau%20Setup%20(Linux) "Link to setup instructions for Linux"), [Windows](https://github.com/Alfresco/Aikau/wiki/Aikau%20Setup%20(Windows) "Link to setup instructions for OS X") and [OS X](https://github.com/Alfresco/Aikau/wiki/Aikau%20Setup%20(OS%20X) "Link to setup instructions for OS X")
