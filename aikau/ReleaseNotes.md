Aikau 1.0.8 Release Notes
=========================

Current deprecations:
---------------------
Previous releases:
* alfresco/documentlibrary/views/AlfDocumentListView             (use: alfresco/lists/views/AlfListView)
* alfresco/documentlibrary/views/DocumentListRenderer            (use: alfresco/lists/views/ListRenderer)
* alfresco/documentlibrary/views/_AlfAdditionalViewControlMixin  (use: alfresco/lists/views/_AlfAdditionalViewControlMixin)
* alfresco/documentlibrary/views/layouts/Carousel                (use: alfresco/lists/views/layouts/Carousel)
* alfresco/documentlibrary/views/layouts/Cell                    (use: alfresco/lists/views/layouts/Cell)
* alfresco/documentlibrary/views/layouts/Column                  (use: alfresco/lists/views/layouts/Column)
* alfresco/documentlibrary/views/layouts/Grid                    (use: alfresco/lists/views/layouts/Grid)
* alfresco/documentlibrary/views/layouts/HeaderCell              (use: alfresco/lists/views/layouts/HeaderCell)
* alfresco/documentlibrary/views/layouts/Popup                   (use: alfresco/lists/views/layouts/Popup)
* alfresco/documentlibrary/views/layouts/Row                     (use: alfresco/lists/views/layouts/Row)
* alfresco/documentlibrary/views/layouts/Table                   (use: alfresco/lists/views/layouts/Table)
* alfresco/documentlibrary/views/layouts/XhrLayout               (use: alfresco/lists/views/layouts/XhrLayout)
* alfresco/documentlibrary/views/layouts/_MultiItemRendererMixin (use: alfresco/lists/views/layouts/_MultiItemRendererMixin)
* alfresco/documentlibrary/AlfSearchList                         (use: alfresco/search/AlfSearchList)
* alfresco/documentlibrary/views/AlfSearchListView               (use: alfresco/search/AlfSearchListView)
* alfresco/renderers/SearchResultPropertyLink                    (use: alfresco/search/SearchResultPropertyLink)
* alfresco/renderers/SearchThumbnail                             (use: alfresco/search/SearchThumbnail)
* alfresco/upload/AlfUpload                                      (use: alfresco/services/UploadService)
* alfresco/dialogs/AlfDialogService                              (use: alfresco/services/Dialog) 
* alfresco/forms/controls/DojoValidationTextBox                  (use: alfresco/forms/controls/TextBox)
* alfresco/forms/controls/DojoCheckBox                           (use: alfresco/forms/controls/CheckBox)
* alfresco/forms/controls/DojoDateTextBox                        (use: alfresco/forms/controls/DateTextBox)
* alfresco/forms/controls/DojoRadioButtons                       (use: alfresco/forms/controls/RadioButtons)
* alfresco/forms/controls/DojoSelect                             (use: alfresco/forms/controls/Select)
* alfresco/forms/controls/DojoTextarea                           (use: alfresco/forms/controls/TextArea)

Resolved issues (see https://issues.alfresco.com/jira/browse/<issue-number>:
----------------
1.0.8:
* [AKU-5](https://issues.alfresco.com/jira/browse/AKU-5)       - Remove YUI2 and Share dependencies from TinyMCE modules
* [AKU-30](https://issues.alfresco.com/jira/browse/AKU-30)     - Updates to Indicators renderer
* [AKU-112](https://issues.alfresco.com/jira/browse/AKU-112)   - Drag and drop items and post form value
* [AKU-113](https://issues.alfresco.com/jira/browse/AKU-113)   - Re-order items and post updated value 
* [AKU-114](https://issues.alfresco.com/jira/browse/AKU-114)   - Delete dropped items and post updated value
* [AKU-117](https://issues.alfresco.com/jira/browse/AKU-117)   - Render widgets as dropped items
* [AKU-118](https://issues.alfresco.com/jira/browse/AKU-118)   - Implement drag and drop modelling service
* [AKU-140](https://issues.alfresco.com/jira/browse/AKU-140)   - Search scope issues resolved
* [AKU-142](https://issues.alfresco.com/jira/browse/AKU-142)   - Add hash fragment support to AlfDynamicPayloadButton
* [AKU-151](https://issues.alfresco.com/jira/browse/AKU-151)   - Fixed DialogService config issue

* 1.0.7:
* [AKU-13](https://issues.alfresco.com/jira/browse/AKU-13)   - Added support for stacked dialogs
* [AKU-27](https://issues.alfresco.com/jira/browse/AKU-27)   - Add support for create folder templated content
* [AKU-94](https://issues.alfresco.com/jira/browse/AKU-94)   - Added Grunt task for patching clients
* [AKU-124](https://issues.alfresco.com/jira/browse/AKU-124) - Added alfresco/lists/views/layouts/EditableRow
* [AKU-127](https://issues.alfresco.com/jira/browse/AKU-127) - Add alt text to developer mode widgets
* [AKU-131](https://issues.alfresco.com/jira/browse/AKU-131) - Ensure pub/sub options for form controls work in dialogs
* [AKU-139](https://issues.alfresco.com/jira/browse/AKU-139) - Updated tests for more reliable code coverage

1.0.6:
* [AKU-41](https://issues.alfresco.com/jira/browse/AKU-41)   - Add Manage Aspects support
* [AKU-41](https://issues.alfresco.com/jira/browse/AKU-72)   - Add colspan support to Cell
* [AKU-102](https://issues.alfresco.com/jira/browse/AKU-101) - Add additionalCssClasses support to Row
* [AKU-102](https://issues.alfresco.com/jira/browse/AKU-102) - NLS updates for alfresco/html/Heading
* [AKU-103](https://issues.alfresco.com/jira/browse/AKU-103) - NLS updates for alfresco/header/SetTitle
* [AKU-105](https://issues.alfresco.com/jira/browse/AKU-105) - Add notification after joining site
* [AKU-108](https://issues.alfresco.com/jira/browse/AKU-108) - Allow form values to be set via publication
* [AKU-109](https://issues.alfresco.com/jira/browse/AKU-109) - Fix typo in sites menu
* [AKU-119](https://issues.alfresco.com/jira/browse/AKU-119) - Add IDs to dialogs from alfresco/services/DialogService

1.0.5:
* [AKU-40](https://issues.alfresco.com/jira/browse/AKU-40) - Remove picked items from simple picker available list
* [AKU-81](https://issues.alfresco.com/jira/browse/AKU-81) - Allow copy/move content into empty document libraries
* [AKU-96](https://issues.alfresco.com/jira/browse/AKU-96) - CSS updates to copy/move action dialogs
* [AKU-97](https://issues.alfresco.com/jira/browse/AKU-97) - Ensure en locale files are generated

1.0.4:
* [AKU-17](https://issues.alfresco.com/jira/browse/AKU-17) - Implement standalone Aikau transient notifications
* [AKU-76](https://issues.alfresco.com/jira/browse/AKU-76) - Updated NPM to use specific tested versions
* [AKU-78](https://issues.alfresco.com/jira/browse/AKU-78) - Clean up Vagrant image configuration files that shouldn't have been committed
* [AKU-79](https://issues.alfresco.com/jira/browse/AKU-79) - Add callback to LogoutService to ensure logout redirection
* [AKU-80](https://issues.alfresco.com/jira/browse/AKU-80) - Modifications to Vagrant provisioned versions
* [AKU-83](https://issues.alfresco.com/jira/browse/AKU-83) - Resolve issues in filtered search page introduced by v1.0.3 updates

1.0.3:
* [AKU-9](https://issues.alfresco.com/jira/browse/AKU-9)   - Add release notes
* [AKU-21](https://issues.alfresco.com/jira/browse/AKU-21) - Filmstrip view fixes
* [AKU-22](https://issues.alfresco.com/jira/browse/AKU-22) - Inline edit cursor update
* [AKU-24](https://issues.alfresco.com/jira/browse/AKU-24) - Remove potential XSS vulnerability in alfresco/forms/controls/Select
* [AKU-65](https://issues.alfresco.com/jira/browse/AKU-65) - Pagination handling updates
* [AKU-71](https://issues.alfresco.com/jira/browse/AKU-71) - Improvements to alfresco/renderers/InlineEditPropertyLink

