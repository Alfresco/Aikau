Aikau 1.0.4 Release Notes
=========================

Current deprecations:
---------------------
This release:
* alfresco/documentlibrary/views/AlfDocumentListView (use: alfresco/lists/views/AlfListView)
* alfresco/documentlibrary/views/DocumentListRenderer (use: alfresco/lists/views/ListRenderer)
* alfresco/documentlibrary/views/_AlfAdditionalViewControlMixin (use: alfresco/lists/views/_AlfAdditionalViewControlMixin)
* alfresco/documentlibrary/views/layouts/Carousel (use: alfresco/lists/views/layouts/Carousel)
* alfresco/documentlibrary/views/layouts/Cell (use: alfresco/lists/views/layouts/Cell)
* alfresco/documentlibrary/views/layouts/Column (use: alfresco/lists/views/layouts/Column)
* alfresco/documentlibrary/views/layouts/Grid (use: alfresco/lists/views/layouts/Grid)
* alfresco/documentlibrary/views/layouts/HeaderCell (use: alfresco/lists/views/layouts/HeaderCell)
* alfresco/documentlibrary/views/layouts/Popup (use: alfresco/lists/views/layouts/Popup)
* alfresco/documentlibrary/views/layouts/Row (use: alfresco/lists/views/layouts/Row)
* alfresco/documentlibrary/views/layouts/Table (use: alfresco/lists/views/layouts/Table)
* alfresco/documentlibrary/views/layouts/XhrLayout (use: alfresco/lists/views/layouts/XhrLayout)
* alfresco/documentlibrary/views/layouts/_MultiItemRendererMixin (use: alfresco/lists/views/layouts/_MultiItemRendererMixin)

Previous releases:
* alfresco/dialogs/AlfDialogService             (use: alfresco/services/Dialog) 
* alfresco/forms/controls/DojoValidationTextBox (use: alfresco/forms/controls/TextBox)
* alfresco/forms/controls/DojoCheckBox          (use: alfresco/forms/controls/CheckBox)
* alfresco/forms/controls/DojoDateTextBox       (use: alfresco/forms/controls/DateTextBox)
* alfresco/forms/controls/DojoRadioButtons      (use: alfresco/forms/controls/RadioButtons)
* alfresco/forms/controls/DojoSelect            (use: alfresco/forms/controls/Select)
* alfresco/forms/controls/DojoTextarea          (use: alfresco/forms/controls/TextArea)

Resolved issues (see https://issues.alfresco.com/jira/browse/<issue-number>:
----------------
1.0.4:
* AKU-76 - Updated NPM to use specific tested versions
* AKU-80 - Modifications to Vagrant provisioned versions
* AKU-79 - Add callback to LogoutService to ensure logout redirection
* AKU-78 - Clean up Vagrant image configuration files that shouldn't have been committed
* AKU-83 - Resolve issues in filtered search page introduced by v1.0.3 updates
* AKU-17 - Implement standalone Aikau transient notifications

1.0.3:
* AKU-9  - Add release notes
* AKU-21 - Filmstrip view fixes
* AKU-22 - Inline edit cursor update
* AKU-24 - Remove potential XSS vulnerability in alfresco/forms/controls/Select
* AKU-65 - Pagination handling updates
* AKU-71 - Improvements to alfresco/renderers/InlineEditPropertyLink

