#Aikau

Aikau is a framework of custom JavaScript widgets designed to work with [Alfresco](http://www.alfresco.com/products/one). It is dependant upon the Surf framework but is not dependant upon the Share application (although in 5.0.0 the code lives within the Share source tree).

The framework provides a suite of small widgets that can be referenced in a JSON models to build complete pages. These page models can be defined in [WebScripts](https://wiki.alfresco.com/wiki/Web_Scripts) or remotely stored and rendered from an Alfresco Repository. This means that it possible to dynamically create and render new pages from within an application without needing to restart the server. Because the models are stored as JSON they are not executable code making it completely safe for users to create and share pages on a live Alfresco instance such as the [Cloud](http://my.alfresco.com) without causing any security concerns.

## Third Party Code
Aikau incorporates code libraries not provided by Alfresco. All licenses are included within the distribution package. The following table summarizes the 3rd party code.

| Name | Project URL | License | Modified |
| ---- | ----------- | ------- | -------- |
| CodeMirror 5.20.2 | https://codemirror.net/ | MIT (https://codemirror.net/LICENSE) | No | 
| Community Chart Components | https://github.com/webdetails/ccc | MPL 2.0 (https://github.com/webdetails/ccc/blob/master/LICENSE.txt) | No |
| dialog-polyfill | https://github.com/GoogleChrome/dialog-polyfill | BSD (https://github.com/GoogleChrome/dialog-polyfill/blob/master/LICENSE) | Yes |
| Dojo 1.10.4 | https://dojotoolkit.org/ | BSD (https://dojotoolkit.org/license.html) | No |
| Enum | https://github.com/adrai/enum | MIT (https://github.com/adrai/enum/blob/master/licence) | No |
| ES6 Promise | https://github.com/stefanpenner/es6-promise | MIT (https://github.com/stefanpenner/es6-promise/blob/master/LICENSE) | Yes |
| JQuery 1.11.1 | https://jquery.com/ | Apache 2.0 (https://js.foundation/pdf/ip-policy.pdf) | No |
| JQuery UI 1.11.1 | https://jqueryui.com/ | Apache 2.0 (https://js.foundation/pdf/ip-policy.pdf) | No |
| lightbox2 | https://github.com/lokesh/lightbox2 | MIT (https://github.com/lokesh/lightbox2/blob/master/LICENSE) | Yes |
| PDF.js | https://github.com/mozilla/pdf.js | Apache 2.0 (https://github.com/mozilla/pdf.js/blob/master/LICENSE) | Yes |
| Showdown | https://github.com/showdownjs/showdown | BSD (https://github.com/showdownjs/showdown/blob/master/license.txt) | No |
| spin.js | https://github.com/fgnass/spin.js | MIT (https://github.com/fgnass/spin.js/blob/master/LICENSE.md) | No |
| SVG for Everybody | https://github.com/jonathantneal/svg4everybody | CC0 (https://github.com/jonathantneal/svg4everybody/blob/master/LICENSE.md) | No |
| TinyMCE | https://github.com/tinymce/tinymce | LGPL 2.1 (https://github.com/tinymce/tinymce/blob/master/LICENSE.TXT) | No |





