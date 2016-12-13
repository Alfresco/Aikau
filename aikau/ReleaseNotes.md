Aikau 1.0.101 Release Notes
===

IMPORTANT
---
From version 1.0.96 onwards there is a new `aikau` package provided. The code in this package is intended to form the basis of a 1.1 version of Aikau (which will be the first release to contain breaking changes). The contents of this package at **not** subject to the same backwards compatibility rules as the `alfresco` package. Instead this will be a collaboration space where code can be changed with breaking changes up until the point where 1.1 is released. You should not use anything from the `aikau` package in production until 1.1 is released. There is no date yet determined for the 1.1 release, 1.0.x releases will continue as always as we prepare for it.

Current deprecations:
---
* alfresco/dialogs/AlfFormDialog                                 (use alfresco/services/DialogService)
* alfresco/renderers/Thumbnail.js
  * onNodePromiseResolved                                        (configure usePreviewService to be true)
  * onLoadNode                                                   (configure usePreviewService to be true)
  * onNodeLoaded                                                 (configure usePreviewService to be true)
  * onShowPreview                                                (configure usePreviewService to be true)
* alfresco/buttons/AlfFormDialogButton.js                        (use alfresco/services/DialogService)
* alfresco/core/Core "alfDeleteFrameworkAttributes"              (use alfresco/core/Core "alfCleanFrameworkAttributes")
* alfresco/core/NotificationUtils.js                             (use alfresco/services/NotificationService)
* alfresco/core/UrlUtils.js                                      (use alfresco/util/urlUtils or alfresco/core/UrlUtilsMixin)
* alfresco/dialogs/_AlfCreateFormDialogMixin.js                  (use alfresco/services/DialogService)
* alfresco/dialogs/AlfDialogService                              (use: alfresco/services/Dialog) 
* alfresco/documentlibrary/_AlfFilterMixin                       (use alfresco/documentlibrary/_AlfHashMixin)
* alfresco/documentlibrary/AlfDocumentListInfiniteScroll.js      (use: alfresco/services/InfiniteScrollService)
* alfresco/documentlibrary/AlfDocumentListPaginator              (use: alfresco/lists/Paginator)
* alfresco/documentlibrary/AlfResultsPerPageGroup                (use: alfresco/lists/ResultsPerPageGroup)
* alfresco/documentlibrary/AlfSearchList                         (use: alfresco/search/AlfSearchList)
* alfresco/documentlibrary/views/_AlfAdditionalViewControlMixin  (use: alfresco/lists/views/_AlfAdditionalViewControlMixin)
* alfresco/documentlibrary/views/AlfDocumentListView             (use: alfresco/lists/views/AlfListView)
* alfresco/documentlibrary/views/AlfSearchListView               (use: alfresco/search/AlfSearchListView)
* alfresco/documentlibrary/views/DocumentListRenderer            (use: alfresco/lists/views/ListRenderer)
* alfresco/documentlibrary/views/layouts/_MultiItemRendererMixin (use: alfresco/lists/views/layouts/_MultiItemRendererMixin)
* alfresco/documentlibrary/views/layouts/Carousel                (use: alfresco/lists/views/layouts/Carousel)
* alfresco/documentlibrary/views/layouts/Cell                    (use: alfresco/lists/views/layouts/Cell)
* alfresco/documentlibrary/views/layouts/Column                  (use: alfresco/lists/views/layouts/Column)
* alfresco/documentlibrary/views/layouts/Grid                    (use: alfresco/lists/views/layouts/Grid)
* alfresco/documentlibrary/views/layouts/HeaderCell              (use: alfresco/lists/views/layouts/HeaderCell)
* alfresco/documentlibrary/views/layouts/Popup                   (use: alfresco/lists/views/layouts/Popup)
* alfresco/documentlibrary/views/layouts/Row                     (use: alfresco/lists/views/layouts/Row)
* alfresco/documentlibrary/views/layouts/Table                   (use: alfresco/lists/views/layouts/Table)
* alfresco/documentlibrary/views/layouts/XhrLayout               (use: alfresco/lists/views/layouts/XhrLayout)
* alfresco/forms/controls/DojoCheckBox                           (use: alfresco/forms/controls/CheckBox)
* alfresco/forms/controls/DojoDateTextBox                        (use: alfresco/forms/controls/DateTextBox)
* alfresco/forms/controls/DojoRadioButtons                       (use: alfresco/forms/controls/RadioButtons)
* alfresco/forms/controls/DojoSelect                             (use: alfresco/forms/controls/Select)
* alfresco/forms/controls/DojoTextarea                           (use: alfresco/forms/controls/TextArea)
* alfresco/forms/controls/DojoValidationTextBox                  (use: alfresco/forms/controls/TextBox)
* alfresco/renderers/SearchResultPropertyLink                    (use: alfresco/search/SearchResultPropertyLink)
* alfresco/renderers/SearchThumbnail                             (use: alfresco/search/SearchThumbnail)
* alfresco/services/_PreferenceServiceTopicMixin.js              (use alfresco/core/topics)
* alfresco/services/actions/SimpleWorkflowService.js             (use alfresco/services/actions/WorkflowService)
* alfresco/upload/AlfUpload                                      (use: alfresco/services/UploadService)

Resolved issues:
---
1.0.101:
* [AKU-1148](https://issues.alfresco.com/jira/browse/AKU-1148)         - Converted renderers and layout modules to create DOM natively
* [AKU-1151](https://issues.alfresco.com/jira/browse/AKU-1151)         - Improve performance enhanced view rendering completion
* [AKU-1152](https://issues.alfresco.com/jira/browse/AKU-1152)         - Support multiple classes assigned to renderedValueClass
* [AKU-1153](https://issues.alfresco.com/jira/browse/AKU-1153)         - Include details of 3rd party libs in readme
* [AKU-1154](https://issues.alfresco.com/jira/browse/AKU-1154)         - Update site creation failure error message
* [AKU-1155](https://issues.alfresco.com/jira/browse/AKU-1155)         - Fix InlineEditProperty re-rendering bug

1.0.100:
* [AKU-878](https://issues.alfresco.com/jira/browse/AKU-878)         - Performance test page added
* [AKU-1138](https://issues.alfresco.com/jira/browse/AKU-1138)       - Prevent PDF.js preview horizontal scrollbar clipping
* [AKU-1139](https://issues.alfresco.com/jira/browse/AKU-1139)       - Prevent horizontal scrollar showing on downlad as zip dialog
* [AKU-1140](https://issues.alfresco.com/jira/browse/AKU-1140)       - Scoped Toggle renderer fix
* [AKU-1141](https://issues.alfresco.com/jira/browse/AKU-1141)       - Ensure all search thumbnails have correct tooltip
* [AKU-1143](https://issues.alfresco.com/jira/browse/AKU-1143)       - Add caching to temporalUtils
* [AKU-1145](https://issues.alfresco.com/jira/browse/AKU-1145)       - Added BaseWidget for reducing applyAttributes overhead
* [AKU-1146](https://issues.alfresco.com/jira/browse/AKU-1146)       - Add debug mode check within alfLog
* [AKU-1147](https://issues.alfresco.com/jira/browse/AKU-1147)       - Define pattern for avoiding TemplatedMixin overhead
* [AKU-1149](https://issues.alfresco.com/jira/browse/AKU-1149)       - Improvements to ChildProcessing module
* [AKU-1150](https://issues.alfresco.com/jira/browse/AKU-1150)       - Improve legacy edit site resource loading

1.0.99:
* [AKU-1133](https://issues.alfresco.com/jira/browse/AKU-1133)       - Improve rendering of Create Site dialog opening
* [AKU-1134](https://issues.alfresco.com/jira/browse/AKU-1134)       - Copyright year update
* [AKU-1135](https://issues.alfresco.com/jira/browse/AKU-1135)       - Improve SearchService configuration options for search term highlighting
* [AKU-1136](https://issues.alfresco.com/jira/browse/AKU-1136)       - Improve MoreInfo widget styling
* [AKU-1137](https://issues.alfresco.com/jira/browse/AKU-1137)       - Impove create site validation display

1.0.98:
* [AKU-1130](https://issues.alfresco.com/jira/browse/AKU-1130)       - Improve create/edit site customization options through configuration
* [AKU-1131](https://issues.alfresco.com/jira/browse/AKU-1131)       - Create Link label updated
* [AKU-1132](https://issues.alfresco.com/jira/browse/AKU-1132)       - Ensure site is created on first click of button


1.0.97:
* [AKU-1108](https://issues.alfresco.com/jira/browse/AKU-1108)       - Ensure sites are favourited when created
* [AKU-1130](https://issues.alfresco.com/jira/browse/AKU-1130)       - Improve create/edit site customization options through configuration

1.0.96:
* [AKU-1111](https://issues.alfresco.com/jira/browse/AKU-1111)       - Update AlfSearchList to support additional query parameters
* [AKU-1112](https://issues.alfresco.com/jira/browse/AKU-1112)       - Update FilePicker to properly support required state
* [AKU-1113](https://issues.alfresco.com/jira/browse/AKU-1113)       - Upgrade of CodeMirror to 5.20.2
* [AKU-1125](https://issues.alfresco.com/jira/browse/AKU-1125)       - Update AlfSelectDocumentListItems to disable correctly
* [AKU-1127](https://issues.alfresco.com/jira/browse/AKU-1127)       - Increate Create Site dialog height to prevent jumping on validation
* [AKU-1128](https://issues.alfresco.com/jira/browse/AKU-1128)       - Ensure FilteringSelect and ComboBox only request initial options once
* [AKU-1129](https://issues.alfresco.com/jira/browse/AKU-1129)       - Add support for showing all option in FilteringSelect and ComboBox when drop-down opened

1.0.95:
* [AKU-1108](https://issues.alfresco.com/jira/browse/AKU-1108)       - Ensure new sites are favourited (Firefox fix)
* [AKU-1114](https://issues.alfresco.com/jira/browse/AKU-1114)       - Remove unicode STH delineation from Thumbnail title
* [AKU-1115](https://issues.alfresco.com/jira/browse/AKU-1115)       - Redirect to user dashboard on request to join moderated site
* [AKU-1116](https://issues.alfresco.com/jira/browse/AKU-1116)       - Add support for enter key completing dialog forms (within field)
* [AKU-1117](https://issues.alfresco.com/jira/browse/AKU-1117)       - Update site creation error messages
* [AKU-1118](https://issues.alfresco.com/jira/browse/AKU-1118)       - Support PathTree updates with no "/" prefix
* [AKU-1119](https://issues.alfresco.com/jira/browse/AKU-1119)       - Improve SiteService preset configuration options
* [AKU-1121](https://issues.alfresco.com/jira/browse/AKU-1121)       - Debounce form validation styling changes
* [AKU-1123](https://issues.alfresco.com/jira/browse/AKU-1123)       - OSX fix for dialog form field highlighting clipping

1.0.94:
* [AKU-1107](https://issues.alfresco.com/jira/browse/AKU-1107)       - Ensure spaces are trimmed in site data
* [AKU-1108](https://issues.alfresco.com/jira/browse/AKU-1108)       - Ensure new sites are favourited
* [AKU-1109](https://issues.alfresco.com/jira/browse/AKU-1109)       - Fix Cloud Sync action issues

1.0.93:
* [AKU-1101](https://issues.alfresco.com/jira/browse/AKU-1101)       - Support for click on Row
* [AKU-1105](https://issues.alfresco.com/jira/browse/AKU-1105)       - Remove unicode chars from MoreInfo on search
* [AKU-1106](https://issues.alfresco.com/jira/browse/AKU-1106)       - Ensure edit site redirects to correct URL

1.0.92:
* [AKU-1097](https://issues.alfresco.com/jira/browse/AKU-1097)       - Updates for search term highlighting
* [AKU-1100](https://issues.alfresco.com/jira/browse/AKU-1100)       - DateTextBox keyup validation fix

1.0.91:
* [AKU-1092](https://issues.alfresco.com/jira/browse/AKU-1092)       - Improvements to site edit/creation validation
* [AKU-1094](https://issues.alfresco.com/jira/browse/AKU-1094)       - Updated error message for Copy/Move failures
* [AKU-1098](https://issues.alfresco.com/jira/browse/AKU-1098)       - Hide list error messages when loading
* [AKU-1099](https://issues.alfresco.com/jira/browse/AKU-1099)       - Fixed validationTopic backwards compatibility

1.0.90:
* [AKU-1093](https://issues.alfresco.com/jira/browse/AKU-1093)       - Fixed bug with inverting selection on AlfGalleryView
* [AKU-1094](https://issues.alfresco.com/jira/browse/AKU-1094)       - Updated error message for Copy/Move failures
* [AKU-1095](https://issues.alfresco.com/jira/browse/AKU-1095)       - Ensure copy/move dialog model is properly cloned
* [AKU-1096](https://issues.alfresco.com/jira/browse/AKU-1096)       - Fixed AlfMenuBarToggle URL hash updating

1.0.89:
* [AKU-1092](https://issues.alfresco.com/jira/browse/AKU-1092)       - Updated SiteService to improve site creation and editing
* Added MarkdownWithPreviewEditor widget
* Improvements to Document Library import lib

1.0.88:
* [AKU-1090](https://issues.alfresco.com/jira/browse/AKU-1090)       - Fix copy/move partial success messages
* [AKU-1091](https://issues.alfresco.com/jira/browse/AKU-1091)       - AlfSearchResult styling update

1.0.87:
* [AKU-1087](https://issues.alfresco.com/jira/browse/AKU-1087)       - Update Property to support highlighting
* [AKU-1088](https://issues.alfresco.com/jira/browse/AKU-1088)       - Form setValueTopic scope fix

1.0.86:
* [AKU-1036](https://issues.alfresco.com/jira/browse/AKU-1036)       - Added a User renderer
* [AKU-1014](https://issues.alfresco.com/jira/browse/AKU-1014)       - More FormsRuntimeService updates

1.0.85:
* [AKU-1075](https://issues.alfresco.com/jira/browse/AKU-1075)       - Improve dialog title handling on copy/move action
* [AKU-1084](https://issues.alfresco.com/jira/browse/AKU-1084)       - Ensure ContainerPicker selects recent sites on display
* [AKU-1085](https://issues.alfresco.com/jira/browse/AKU-1085)       - Fix IE10/11 & Edge middle click, right click handling
* [AKU-1086](https://issues.alfresco.com/jira/browse/AKU-1086)       - Support middle click, ctrl click open in new tab on menu items

1.0.84:
* [AKU-1072](https://issues.alfresco.com/jira/browse/AKU-1072)       - Support hiding form control validation indicators
* [AKU-1076](https://issues.alfresco.com/jira/browse/AKU-1076)       - Ensure filteringTopics does not need to be configured on AlfFilteredList
* [AKU-1077](https://issues.alfresco.com/jira/browse/AKU-1077)       - Support label maps on AlfFilteredList summary
* [AKU-1079](https://issues.alfresco.com/jira/browse/AKU-1079)       - Support copy/paste value update trigger in form controls
* [AKU-1080](https://issues.alfresco.com/jira/browse/AKU-1080)       - Clone models for dialogs
* [AKU-1081](https://issues.alfresco.com/jira/browse/AKU-1081)       - Support mix-in values on FormsRuntimeService requests
* [AKU-1082](https://issues.alfresco.com/jira/browse/AKU-1082)       - Ensure DateTextBox value change publication is correct
* [AKU-1083](https://issues.alfresco.com/jira/browse/AKU-1083)       - Support empty value options for Select form control

1.0.83:
* [AKU-1053](https://issues.alfresco.com/jira/browse/AKU-1053)       - Support for grouped form rules
* [AKU-1054](https://issues.alfresco.com/jira/browse/AKU-1054)       - Ensure expanded panels remain expanded on grid resize
* [AKU-1069](https://issues.alfresco.com/jira/browse/AKU-1069)       - Full metadata refresh on InlineEditPropertyLink
* [AKU-1071](https://issues.alfresco.com/jira/browse/AKU-1071)       - PushButton in form dialog layout fix

1.0.82:
* [AKU-1061](https://issues.alfresco.com/jira/browse/AKU-1061)       - Update bulk action filtering to include file type
* [AKU-1063](https://issues.alfresco.com/jira/browse/AKU-1063)       - Ensure that SelectedItemStateMixin publishes empty array for zero-item selection
* [AKU-1064](https://issues.alfresco.com/jira/browse/AKU-1064)       - Disable AlfSelectDocumentListItems when no list items are available
* [AKU-1067](https://issues.alfresco.com/jira/browse/AKU-1067)       - Update GalleryThumbnail to support selection and inverting selection
* [AKU-1068](https://issues.alfresco.com/jira/browse/AKU-1068)       - Update copy/move action messages
* [AKU-1070](https://issues.alfresco.com/jira/browse/AKU-1070)       - Support added/removed values for form controls

1.0.81:
* [AKU-1033](https://issues.alfresco.com/jira/browse/AKU-1033)       - Initial drop of alfresco/forms/controls/FilePicker
* [AKU-1044](https://issues.alfresco.com/jira/browse/AKU-1044)       - Support for excluding form value from additional button payloads
* [AKU-1048](https://issues.alfresco.com/jira/browse/AKU-1048)       - Further update to changes in 1.0.80 to reduce opacity of disabled form fields
* [AKU-1052](https://issues.alfresco.com/jira/browse/AKU-1052)       - Support for mapping of non-truthy values in DynamicPayload

1.0.80:
* [AKU-1047](https://issues.alfresco.com/jira/browse/AKU-1047)       - Ensure PushButtons respect disabled state
* [AKU-1048](https://issues.alfresco.com/jira/browse/AKU-1048)       - Set themeable opacity on disabled form controls
* [AKU-1049](https://issues.alfresco.com/jira/browse/AKU-1049)       - Ensure late registered form controls process rules
* [AKU-1050](https://issues.alfresco.com/jira/browse/AKU-1050)       - Ensure PreferenceService uses correct URL
* [AKU-1051](https://issues.alfresco.com/jira/browse/AKU-1051)       - Support for optional no buttons label on PushButtons

1.0.79:
* [AKU-945](https://issues.alfresco.com/jira/browse/AKU-945)       - Break word on long form control labels in form dialogs
* [AKU-1039](https://issues.alfresco.com/jira/browse/AKU-1039)     - Re-instate border around tabs
* [AKU-1040](https://issues.alfresco.com/jira/browse/AKU-1040)     - Support fixed width on Select form control
* [AKU-1041](https://issues.alfresco.com/jira/browse/AKU-1041)     - Increase gap betwen filter widgets
* [AKU-1042](https://issues.alfresco.com/jira/browse/AKU-1042)     - Brackets in upload file name display fix
* [AKU-1043](https://issues.alfresco.com/jira/browse/AKU-1043)     - Ensure values are set in TabbedControls
* [AKU-1045](https://issues.alfresco.com/jira/browse/AKU-1045)     - Support for generated payloads in AlfButton
* [#1169](https://github.com/Alfresco/Aikau/pull/1169)              - Use site for XHR loading actions and client specific view
* [#1172](https://github.com/Alfresco/Aikau/pull/1172)              - PropertyLink CSS typo fix
* [#1173](https://github.com/Alfresco/Aikau/pull/1173)              - Support for 0-value in Progress
* [#1175](https://github.com/Alfresco/Aikau/pull/1175)              - Page title prefix encoding correction
* [#1176](https://github.com/Alfresco/Aikau/pull/1176)              - TinyMCE locale generalization
* [#1181](https://github.com/Alfresco/Aikau/pull/1181)              - FileSelect updated to filter on MIME type
* [#1182](https://github.com/Alfresco/Aikau/pull/1182)              - Support for empty array in XHR actions

1.0.78:
* [AKU-1037](https://issues.alfresco.com/jira/browse/AKU-1037)     - Improve Dashlet CSS defaults
* [AKU-1038](https://issues.alfresco.com/jira/browse/AKU-1038)     - Revert AKU-945 (form dialog layout changes)

1.0.77.1:
* [AKU-1020](https://issues.alfresco.com/jira/browse/AKU-1020)     - Support for item focus on AlfList load
* [AKU-1023](https://issues.alfresco.com/jira/browse/AKU-1023)     - Set minimum height for dialogs
* [AKU-1026](https://issues.alfresco.com/jira/browse/AKU-1026)     - Update selection/focus colours for PushButtons

1.0.77:
* [AKU-1019](https://issues.alfresco.com/jira/browse/AKU-1019)     - Ensure invertion action works for item selection
* [AKU-1021](https://issues.alfresco.com/jira/browse/AKU-1021)     - Improve focus highlighting on CellContainer
* [AKU-1024](https://issues.alfresco.com/jira/browse/AKU-1024)     - Update form control focus colours
* [AKU-1025](https://issues.alfresco.com/jira/browse/AKU-1025)     - Reduce spacing between buttons in inline forms
* [AKU-1027](https://issues.alfresco.com/jira/browse/AKU-1027)     - Update HeaderCell sort icon display
* [AKU-1029](https://issues.alfresco.com/jira/browse/AKU-1029)     - FormsRuntime - initial workflow and task support
* [AKU-1030](https://issues.alfresco.com/jira/browse/AKU-1030)     - FormsRuntime - improve structure handling
* [AKU-1032](https://issues.alfresco.com/jira/browse/AKU-1032)     - FormsRuntime - "info.ftl" mapping
* [AKU-1034](https://issues.alfresco.com/jira/browse/AKU-1034)     - FormsRuntime - improve MultiSelectInput array value handling

1.0.76:
* [AKU-1010](https://issues.alfresco.com/jira/browse/AKU-1010)     - Ensure failure message is not displayed for lists with pending request
* [AKU-1011](https://issues.alfresco.com/jira/browse/AKU-1011)     - Handle long, unbroken names in SearchBox results
* [AKU-1013](https://issues.alfresco.com/jira/browse/AKU-1013)     - Configurable results height for SearchBox
* [AKU-1015](https://issues.alfresco.com/jira/browse/AKU-1015)     - Provide basic support for Share XML forms runtime
* [AKU-1017](https://issues.alfresco.com/jira/browse/AKU-1017)     - Prevent progress notifications on download actions
* [AKU-1018](https://issues.alfresco.com/jira/browse/AKU-1018)     - Fix Firefox specific handling of PublishAction clicks

1.0.75:
* [AKU-1009](https://issues.alfresco.com/jira/browse/AKU-1003)     - Provide additional sort controls

1.0.74:
* [AKU-1003](https://issues.alfresco.com/jira/browse/AKU-1003)     - Update UserService to work with lists
* [AKU-1004](https://issues.alfresco.com/jira/browse/AKU-1004)     - Update UserService to support filtering, sort and pagination

1.0.73:
* [AKU-996](https://issues.alfresco.com/jira/browse/AKU-996)       - Improvements to menus handling sorting
* [AKU-988](https://issues.alfresco.com/jira/browse/AKU-988)       - Support scoping in visibilityConfig
* [AKU-1000](https://issues.alfresco.com/jira/browse/AKU-1000)     - Support for removing document title prefix via alfresco/header/SetTitle

1.0.72.4:
* [AKU-1010](https://issues.alfresco.com/jira/browse/AKU-1010)       - Ensure AlfList publishes pending load requests

1.0.72.3:
* [AKU-1007](https://issues.alfresco.com/jira/browse/AKU-1007)       - Block infinite scroll page load requests when a request is in progress

1.0.72.2:
* [AKU-1006](https://issues.alfresco.com/jira/browse/AKU-1006)       - Support for group images in AvatarThumbnail

1.0.72.1:
* [AKU-1002](https://issues.alfresco.com/jira/browse/AKU-1002)       - Trigger form control validation on disable state change

1.0.72:
* [AKU-947](https://issues.alfresco.com/jira/browse/AKU-947)       - Added 'simpleLayout' config option to PushButtons
* [AKU-982](https://issues.alfresco.com/jira/browse/AKU-982)       - Added support for disabling actions in Indicators
* [AKU-995](https://issues.alfresco.com/jira/browse/AKU-995)       - Additional layout CSS class for ClassicWindow
* [AKU-997](https://issues.alfresco.com/jira/browse/AKU-997)       - Support for toggling edit mode via topic in InlineEditProperty
* [AKU-998](https://issues.alfresco.com/jira/browse/AKU-998)       - PubQueue fix for pages with neither widgets nor services
* [AKU-1001](https://issues.alfresco.com/jira/browse/AKU-1001)     - Improvements to progress indicator on navigation

1.0.71.1:
* [AKU-998](https://issues.alfresco.com/jira/browse/AKU-998)       - PubQueue release when no widgets or services

1.0.71:
* [AKU-981](https://issues.alfresco.com/jira/browse/AKU-981)       - Support for legacyMode fallback via whitelist validation in alfresco/renderers/Indicators
* [AKU-983](https://issues.alfresco.com/jira/browse/AKU-983)       - Added generic "processing" notification
* [AKU-986](https://issues.alfresco.com/jira/browse/AKU-986)       - Improved alfresco/misc/AlfTooltip orientation options
* [AKU-987](https://issues.alfresco.com/jira/browse/AKU-987)       - Handle variable publication scopes in alfresco/buttons/AlfDynamicPayloadButton
* [AKU-989](https://issues.alfresco.com/jira/browse/AKU-989)       - Added alfresco/forms/CollapsibleSection widget
* [AKU-990](https://issues.alfresco.com/jira/browse/AKU-990)       - Variable pubSubScope form warnings support
* [AKU-991](https://issues.alfresco.com/jira/browse/AKU-991)       - NodeRef attribute fallback in alfresco/services/NodePreviewService
* [AKU-992](https://issues.alfresco.com/jira/browse/AKU-992)       - Support for simple links in alfresco/documentlibrary/AlfBreadcrumbTrail

1.0.70:
* [AKU-945](https://issues.alfresco.com/jira/browse/AKU-945)       - Standardize form control layout
* [AKU-955](https://issues.alfresco.com/jira/browse/AKU-955)       - Handle text mis-alignment in FileUploadService
* [AKU-956](https://issues.alfresco.com/jira/browse/AKU-956)       - Added custom TinyMCE specific empty content validator
* [AKU-959](https://issues.alfresco.com/jira/browse/AKU-959)       - Support for disable state in Selector renderer
* [AKU-963](https://issues.alfresco.com/jira/browse/AKU-963)       - Support for onlyShowOnHover in PublishAction
* [AKU-979](https://issues.alfresco.com/jira/browse/AKU-979)       - Disable isDraggable by default
* [AKU-980](https://issues.alfresco.com/jira/browse/AKU-980)       - Configurable result count message in AlfSearchList

1.0.69:
* [AKU-968](https://issues.alfresco.com/jira/browse/AKU-968)       - Support for preventing click bubbling in PublishOrLinkMixin
* [AKU-970](https://issues.alfresco.com/jira/browse/AKU-970)       - Improve visibilityConfig in forms
* [AKU-972](https://issues.alfresco.com/jira/browse/AKU-972)       - Ensure FilteringSelect option can be preselected
* [AKU-973](https://issues.alfresco.com/jira/browse/AKU-973)       - Improve widgetsForNoDataDisplay rendering in AlfListView
* [AKU-974](https://issues.alfresco.com/jira/browse/AKU-974)       - Support state management in visibilityConfig for all widgets
* [AKU-975](https://issues.alfresco.com/jira/browse/AKU-975)       - Ensure forward slash present in folder link AlfSearchResult
* [AKU-977](https://issues.alfresco.com/jira/browse/AKU-977)       - Fix SimplePicker layout issue

1.0.68:
* [AKU-956](https://issues.alfresco.com/jira/browse/AKU-956)       - Prevent empty comments from being saved
* [AKU-962](https://issues.alfresco.com/jira/browse/AKU-962)       - Fix siteMode in DocumentListPicker
* [AKU-965](https://issues.alfresco.com/jira/browse/AKU-965)       - Support multiple Aikau Surf Component true publication order
* [AKU-966](https://issues.alfresco.com/jira/browse/AKU-966)       - Configurable icon paths in PublishAction
* [AKU-969](https://issues.alfresco.com/jira/browse/AKU-969)       - Internationalization for simple date rendering
* [AKU-971](https://issues.alfresco.com/jira/browse/AKU-971)       - ObjectProcessingMixin improvements

1.0.67:
* [AKU-942](https://issues.alfresco.com/jira/browse/AKU-942)       - Add info for empty AlfDocumentList folder views
* [AKU-949](https://issues.alfresco.com/jira/browse/AKU-949)       - Additinonal local storage access protection
* [AKU-954](https://issues.alfresco.com/jira/browse/AKU-954)       - Ensure DND upload highlighting only shown for appropriate permissions
* [AKU-956](https://issues.alfresco.com/jira/browse/AKU-956)       - Prevent saving empty comments
* [AKU-957](https://issues.alfresco.com/jira/browse/AKU-957)       - Ensure comment edits trigger CommentsList refresh
* [AKU-958](https://issues.alfresco.com/jira/browse/AKU-958)       - Fix archetype Spring config for Surf 6 login
* [ALF-21614](https://issues.alfresco.com/jira/browse/ALF-21614)   - AlfFormDialog fix (and deprecation)

1.0.66:
* [AKU-941](https://issues.alfresco.com/jira/browse/AKU-941)       - Add support for Smart Folders in alfresco/renderers/Thumbnail
* [AKU-944](https://issues.alfresco.com/jira/browse/AKU-944)       - Improve encoding on data typed into MultiSelectInput
* [AKU-946](https://issues.alfresco.com/jira/browse/AKU-946)       - Ensure list loading element does not block pointer events
* [AKU-947](https://issues.alfresco.com/jira/browse/AKU-947)       - Improved rendering of long text on PushButton values
* [AKU-949](https://issues.alfresco.com/jira/browse/AKU-949)       - Improved local storage handling in lists
* [AKU-951](https://issues.alfresco.com/jira/browse/AKU-951)       - Ensure error messages are displayed on form controls without labels
* [AKU-952](https://issues.alfresco.com/jira/browse/AKU-952)       - Improve TinyMCE configuration options
* [AKU-953](https://issues.alfresco.com/jira/browse/AKU-953)       - Improve SelectedItemStateMixin value handling
* [AKU-955](https://issues.alfresco.com/jira/browse/AKU-955)       - Improve rendering of upload display in FileUploadService

1.0.65:
* [AKU-907](https://issues.alfresco.com/jira/browse/AKU-907)       - Supoort line item removal from UploadMonitor
* [AKU-929](https://issues.alfresco.com/jira/browse/AKU-929)       - Support close Notification by published topic
* [AKU-932](https://issues.alfresco.com/jira/browse/AKU-932)       - Ensure localization of menu item tooltips
* [AKU-933](https://issues.alfresco.com/jira/browse/AKU-933)       - Optional view model processing in list views
* [AKU-934](https://issues.alfresco.com/jira/browse/AKU-934)       - Better rendering in Date for deleted users
* [AKU-937](https://issues.alfresco.com/jira/browse/AKU-937)       - Fix scoping issue in DocumentPicker
* [AKU-938](https://issues.alfresco.com/jira/browse/AKU-938)       - Ensure form value initialization consistency
* [AKU-940](https://issues.alfresco.com/jira/browse/AKU-940)       - Fixed drop-down arrow alignment issue in menus
* [AKU-943](https://issues.alfresco.com/jira/browse/AKU-943)       - Fixed SelectList item selection on list rendering
* [AKU-948](https://issues.alfresco.com/jira/browse/AKU-948)       - Support deselect in non-multiMode PushButton

1.0.64:
* [AKU-883](https://issues.alfresco.com/jira/browse/AKU-883)       - Added ToggleStateActions widget
* [AKU-893](https://issues.alfresco.com/jira/browse/AKU-893)       - Improved configuration options for Paginator
* [AKU-924](https://issues.alfresco.com/jira/browse/AKU-924)       - Ensure page back/forward works with infinite scrolling Document Library
* [AKU-926](https://issues.alfresco.com/jira/browse/AKU-926)       - Ensure empty string itemsAttribute property works with OptionsService
* [AKU-927](https://issues.alfresco.com/jira/browse/AKU-927)       - Fixed scoping issue with CommentsList
* [AKU-928](https://issues.alfresco.com/jira/browse/AKU-928)       - Improved content creation failure experience
* [AKU-930](https://issues.alfresco.com/jira/browse/AKU-930)       - Fixed edit site details behaviour

1.0.63:
* [AKU-411](https://issues.alfresco.com/jira/browse/AKU-411)       - Versionable lib file support
* [AKU-777](https://issues.alfresco.com/jira/browse/AKU-777)       - Prevent MultiSelectInput opening when deleting item (IE only)
* [AKU-913](https://issues.alfresco.com/jira/browse/AKU-913)       - Ensure upload button works
* [AKU-914](https://issues.alfresco.com/jira/browse/AKU-914)       - Notifications support nested widgets
* [AKU-916](https://issues.alfresco.com/jira/browse/AKU-916)       - Prevent page scrolling on dialog open
* [AKU-921](https://issues.alfresco.com/jira/browse/AKU-921)       - Support cursor key use in forms in views
* [AKU-922](https://issues.alfresco.com/jira/browse/AKU-922)       - Ensure service exception at startup doesn't cause widgets to render before services
* [AKU-923](https://issues.alfresco.com/jira/browse/AKU-923)       - Prevent XSS injection in leave site action

1.0.62:
* [AKU-842](https://issues.alfresco.com/jira/browse/AKU-842)       - Ensure infinite scrolling Document Library can be sorted via menu
* [AKU-898](https://issues.alfresco.com/jira/browse/AKU-898)       - Support for UploadMonitor completed upload actions
* [AKU-904](https://issues.alfresco.com/jira/browse/AKU-904)       - Added support for additional form config in form dialogs
* [AKU-908](https://issues.alfresco.com/jira/browse/AKU-908)       - Inline edit renderers use buttons rather than labels for save/cancel
* [AKU-912](https://issues.alfresco.com/jira/browse/AKU-912)       - Removal of hardcoded "Relevance" sorting from SearchBox links

1.0.61:
* [AKU-757](https://issues.alfresco.com/jira/browse/AKU-757)       - Prevent browser popup blocker on download requests
* [AKU-903](https://issues.alfresco.com/jira/browse/AKU-903)       - Prevent click bubbling on PublishAction
* [AKU-910](https://issues.alfresco.com/jira/browse/AKU-910)       - Success actions on UploadMonitor

1.0.60:
* [AKU-879](https://issues.alfresco.com/jira/browse/AKU-879)       - Ensure drag and drop overlay fits to visible area
* [AKU-884](https://issues.alfresco.com/jira/browse/AKU-884)       - OptionsService improvements
* [AKU-885](https://issues.alfresco.com/jira/browse/AKU-885)       - Ensure correct Accept-Language header in IE
* [AKU-887](https://issues.alfresco.com/jira/browse/AKU-887)       - Ensure upload works on Safari
* [AKU-888](https://issues.alfresco.com/jira/browse/AKU-888)       - Improvements to create site dialog
* [AKU-889](https://issues.alfresco.com/jira/browse/AKU-889)       - Upload display customization improvements
* [AKU-891](https://issues.alfresco.com/jira/browse/AKU-891)       - Prevent browser rendering dropped files
* [AKU-895](https://issues.alfresco.com/jira/browse/AKU-895)       - Ensure AlfBreadcrumbTrail reflects initial path
* [AKU-897](https://issues.alfresco.com/jira/browse/AKU-897)       - Ensure it is possible to cancel unstarted upload

1.0.59:
* [AKU-869](https://issues.alfresco.com/jira/browse/AKU-866)       - Added alfresco/services/NodePreviewService
* [AKU-870](https://issues.alfresco.com/jira/browse/AKU-870)       - Ensure HeaderCell sorting works with AlfFilteredList
* [AKU-871](https://issues.alfresco.com/jira/browse/AKU-871)       - Accessibility updates to AlfMenuBarSelectItems
* [AKU-872](https://issues.alfresco.com/jira/browse/AKU-872)       - Accessibility updates to AlfCheckableMenuItem
* [AKU-873](https://issues.alfresco.com/jira/browse/AKU-873)       - Accessibility updates to AlfMenuBarSelect
* [AKU-874](https://issues.alfresco.com/jira/browse/AKU-874)       - Support alternate true/false values on Checkbox
* [AKU-882](https://issues.alfresco.com/jira/browse/AKU-882)       - Added alfresco/forms/controls/SelectedListItems
* [AKU-896](https://issues.alfresco.com/jira/browse/AKU-896)       - Update clickable button area

1.0.58:
* [AKU-207](https://issues.alfresco.com/jira/browse/AKU-207)       - Add support for change type action
* [AKU-820](https://issues.alfresco.com/jira/browse/AKU-820)       - Added visual progress indicator to UploadMonitor
* [AKU-832](https://issues.alfresco.com/jira/browse/AKU-832)       - Update min/max actions on StickyPanel
* [AKU-838](https://issues.alfresco.com/jira/browse/AKU-838)       - Test selectors for BaseFormControl
* [AKU-839](https://issues.alfresco.com/jira/browse/AKU-839)       - Test selectors for AlfTabContainer
* [AKU-846](https://issues.alfresco.com/jira/browse/AKU-846)       - Form dialog disable button behaviour
* [AKU-852](https://issues.alfresco.com/jira/browse/AKU-852)       - Add fail icon to UploadMonitor
* [AKU-860](https://issues.alfresco.com/jira/browse/AKU-860)       - Support for cancel request to join site
* [AKU-862](https://issues.alfresco.com/jira/browse/AKU-862)       - Improve DND file upload highlighting behaviour
* [AKU-864](https://issues.alfresco.com/jira/browse/AKU-864)       - UploadContainer style changes
* [AKU-865](https://issues.alfresco.com/jira/browse/AKU-865)       - Prevent notification interaction blocking
* [AKU-867](https://issues.alfresco.com/jira/browse/AKU-867)       - Improve error handling output
* [AKU-875](https://issues.alfresco.com/jira/browse/AKU-875)       - Defensive coding around list loading message hiding

1.0.57:
* [AKU-834](https://issues.alfresco.com/jira/browse/AKU-834)       - Ensure FileSelect does not fire change event on selection of same file
* [AKU-837](https://issues.alfresco.com/jira/browse/AKU-837)       - Externalise MultiSelectInput selectors for testing
* [AKU-844](https://issues.alfresco.com/jira/browse/AKU-844)       - Added requestAnimationFrame shim for IE9 (for list fix)
* [AKU-851](https://issues.alfresco.com/jira/browse/AKU-851)       - Ensure widgetsForUploadDisplay can be customized for upload services
* [AKU-853](https://issues.alfresco.com/jira/browse/AKU-853)       - Improve customization options for upload dialogs
* [AKU-855](https://issues.alfresco.com/jira/browse/AKU-855)       - Support warnIfNotAvailable message for Date renderer
* [AKU-859](https://issues.alfresco.com/jira/browse/AKU-859)       - Ensure compactMode option on Paginator works correctly
* [AKU-863](https://issues.alfresco.com/jira/browse/AKU-863)       - Support for renderFilter client properties for models defined within widgets with currentItem

1.0.56:
* [AKU-795](https://issues.alfresco.com/jira/browse/AKU-795)       - Cancel in-progress uploads from UploadMonitor
* [AKU-796](https://issues.alfresco.com/jira/browse/AKU-796)       - Configurable action suppport in UploadMonitor
* [AKU-840](https://issues.alfresco.com/jira/browse/AKU-840)       - Updates to preview MIME type conditions for video
* [AKU-842](https://issues.alfresco.com/jira/browse/AKU-842)       - Added missing localization to dialog close icon
* [AKU-843](https://issues.alfresco.com/jira/browse/AKU-843)       - Improve StickPanel overlay click handling
* [AKU-847](https://issues.alfresco.com/jira/browse/AKU-847)       - Update PublishAction to support label config

1.0.55:
* [AKU-817](https://issues.alfresco.com/jira/browse/AKU-817)       - Prevent double encoding of tooltips on menu items
* [AKU-819](https://issues.alfresco.com/jira/browse/AKU-819)       - Added non-Share create/edit site behaviour
* [AKU-821](https://issues.alfresco.com/jira/browse/AKU-821)       - Upload monitor tooltip removal
* [AKU-822](https://issues.alfresco.com/jira/browse/AKU-822)       - Upload monitor content scrolling
* [AKU-823](https://issues.alfresco.com/jira/browse/AKU-823)       - Ensure minimized upload monitor restores on new uploads
* [AKU-824](https://issues.alfresco.com/jira/browse/AKU-824)       - Added support for named targets via NavigationService
* [AKU-825](https://issues.alfresco.com/jira/browse/AKU-825)       - Ensure upload monitor never displays NaN as percentage complete
* [AKU-827](https://issues.alfresco.com/jira/browse/AKU-827)       - Prevent double encoding of DragAndDropItems
* [AKU-829](https://issues.alfresco.com/jira/browse/AKU-829)       - Added support for custom indicator icons
* [AKU-830](https://issues.alfresco.com/jira/browse/AKU-830)       - Added configurable support for forthcoming upload API
* [AKU-831](https://issues.alfresco.com/jira/browse/AKU-831)       - Updates to AlfHashList hash trigger processing
* [AKU-833](https://issues.alfresco.com/jira/browse/AKU-833)       - Improved handling of upload failures
* [AKU-836](https://issues.alfresco.com/jira/browse/AKU-836)       - Fixed property spelling error in Grid.js

1.0.54:
* [AKU-785](https://issues.alfresco.com/jira/browse/AKU-785)       - Update video preview plugin to play H264 proxy when available
* [AKU-794](https://issues.alfresco.com/jira/browse/AKU-794)       - Disable UploadMonitor close during file upload
* [AKU-805](https://issues.alfresco.com/jira/browse/AKU-805)       - Prevent double rendering off model previews
* [AKU-807](https://issues.alfresco.com/jira/browse/AKU-807)       - Resolved NumberSpinner validation on focus
* [AKU-808](https://issues.alfresco.com/jira/browse/AKU-808)       - Supprt permitEmpty with min/max in NumberSpinner
* [AKU-809](https://issues.alfresco.com/jira/browse/AKU-809)       - Ensure lists can be scrolled horizontally
* [AKU-812](https://issues.alfresco.com/jira/browse/AKU-812)       - Ensure NumberSpinner supports "," as decimal place in appropriate locales
* [AKU-813](https://issues.alfresco.com/jira/browse/AKU-813)       - Ensure renderFilter can be used with form children
* [AKU-814](https://issues.alfresco.com/jira/browse/AKU-814)       - Added alfresco/lists/utilities/FilterSummary widget
* [AKU-818](https://issues.alfresco.com/jira/browse/AKU-818)       - Improve LoggingService filtering configuration

1.0.53:
* [AKU-763](https://issues.alfresco.com/jira/browse/AKU-763)       - Add LESS variables to StickyPanel and UploadMonitor
* [AKU-791](https://issues.alfresco.com/jira/browse/AKU-791)       - Resolved AlfDialog scrolling issues (in Share)
* [AKU-792](https://issues.alfresco.com/jira/browse/AKU-792)       - Improve list loading/rendering message handling
* [AKU-797](https://issues.alfresco.com/jira/browse/AKU-797)       - Fixed zoom tooltip text in PDF.js preview plugin
* [AKU-799](https://issues.alfresco.com/jira/browse/AKU-799)       - Resolved form dialog margins regression
* [AKU-802](https://issues.alfresco.com/jira/browse/AKU-802)       - Resolved list margin regression

1.0.52:
* [AKU-676](https://issues.alfresco.com/jira/browse/AKU-676)       - Added alfresco/buttons/DropDownButton
* [AKU-747](https://issues.alfresco.com/jira/browse/AKU-747)       - Added alfresco/services/FileUploadService
* [AKU-769](https://issues.alfresco.com/jira/browse/AKU-769)       - Support Mac cmd-click to open new tab
* [AKU-787](https://issues.alfresco.com/jira/browse/AKU-787)       - Added label node to InlineEditPropery template
* [AKU-788](https://issues.alfresco.com/jira/browse/AKU-788)       - Ensure arrow is visible on ellipsis displayed AlfMenuBarPopup
* [AKU-789](https://issues.alfresco.com/jira/browse/AKU-789)       - Support page reload option on become site manager

1.0.51:
* [AKU-775](https://issues.alfresco.com/jira/browse/AKU-775)       - Improve auto-resizing TinyMCE improvements
* [AKU-777](https://issues.alfresco.com/jira/browse/AKU-777)       - Fixed MultiSelect options list expansion
* [AKU-778](https://issues.alfresco.com/jira/browse/AKU-778)       - Fixed MultiSelect options filtering
* [AKU-779](https://issues.alfresco.com/jira/browse/AKU-779)       - Ensure non-focused filmstrip view previews are paused
* [AKU-780](https://issues.alfresco.com/jira/browse/AKU-780)       - Ensure videos in filmstrip view can be replayed
* [AKU-781](https://issues.alfresco.com/jira/browse/AKU-781)       - Support client-side propety evaluation in renderFilter
* [AKU-782](https://issues.alfresco.com/jira/browse/AKU-782)       - Prevent selection of facet filters when search in progress
* [AKU-784](https://issues.alfresco.com/jira/browse/AKU-784)       - Fix drag-and-drop file upload
* [AKU-786](https://issues.alfresco.com/jira/browse/AKU-786)       - Allow thumbnail preview of cm:content sub-type

1.0.50:
* [AKU-764](https://issues.alfresco.com/jira/browse/AKU-764)       - Added warnings for scoped form controls
* [AKU-766](https://issues.alfresco.com/jira/browse/AKU-766)       - Resolve Firefox iframe rendering issues
* [AKU-768](https://issues.alfresco.com/jira/browse/AKU-768)       - Added alfresco/upload/UploadMonitor widget
* [AKU-769](https://issues.alfresco.com/jira/browse/AKU-769)       - Add mouse middle/control click support for search links
* [AKU-770](https://issues.alfresco.com/jira/browse/AKU-770)       - PathTree refresh on root node additions
* [AKU-771](https://issues.alfresco.com/jira/browse/AKU-771)       - InlineEditProperty edit value encoding correction
* [AKU-774](https://issues.alfresco.com/jira/browse/AKU-774)       - Fixed DebugLog filtering issue
* [AKU-775](https://issues.alfresco.com/jira/browse/AKU-775)       - Ensure TinyMCE editor resizes correctly on first use
* [AKU-776](https://issues.alfresco.com/jira/browse/AKU-776)       - Ensure "No Data" message is not displayed in lists when loading data

1.0.49:
* [AKU-750](https://issues.alfresco.com/jira/browse/AKU-750)       - Support for form submission from textbox on enter key
* [AKU-751](https://issues.alfresco.com/jira/browse/AKU-751)       - Support to configure forms to focus first field
* [AKU-752](https://issues.alfresco.com/jira/browse/AKU-752)       - Support for title on AlfButton
* [AKU-761](https://issues.alfresco.com/jira/browse/AKU-761)       - Support showValidationErrorsImmediately for form fields within ControlRow
* [AKU-765](https://issues.alfresco.com/jira/browse/AKU-765)       - Update shims to support textContent use in IE8

1.0.48:
* [AKU-687](https://issues.alfresco.com/jira/browse/AKU-687)       - Add "primary-call-to-action" CSS class for AlfButton
* [AKU-700](https://issues.alfresco.com/jira/browse/AKU-700)       - Improve list loading to make "smoother"
* [AKU-732](https://issues.alfresco.com/jira/browse/AKU-732)       - Add hash update support for AlfBreadcrumbTrail
* [AKU-739](https://issues.alfresco.com/jira/browse/AKU-739)       - Make PathTree respond to creation/deletion
* [AKU-742](https://issues.alfresco.com/jira/browse/AKU-742)       - Placeholder support for ComboBox
* [AKU-744](https://issues.alfresco.com/jira/browse/AKU-744)       - Height config support for FilmStripViewSearchResult
* [AKU-745](https://issues.alfresco.com/jira/browse/AKU-745)       - Escaping of variables in AlfBreadcrumbTrail
* [AKU-747](https://issues.alfresco.com/jira/browse/AKU-747)       - Created StickyPanel widget
* [AKU-749](https://issues.alfresco.com/jira/browse/AKU-749)       - Removed HTML from search count label
* [AKU-754](https://issues.alfresco.com/jira/browse/AKU-754)       - Dutch date format correction
* [AKU-759](https://issues.alfresco.com/jira/browse/AKU-759)       - AlfShareFooter copyright correction

1.0.47:
* [AKU-679](https://issues.alfresco.com/jira/browse/AKU-679)       - Ensure form elementrs pass Wave accessibility checks
* [AKU-703](https://issues.alfresco.com/jira/browse/AKU-703)       - Added config option for full-width FacetFilters
* [AKU-715](https://issues.alfresco.com/jira/browse/AKU-715)       - Added config option to hide Save/Cancel links in Tag renderer
* [AKU-717](https://issues.alfresco.com/jira/browse/AKU-717)       - Added config option to auto-resize TinyMCE editor
* [AKU-723](https://issues.alfresco.com/jira/browse/AKU-723)       - Prevent double encoding in InlineEditProperty
* [AKU-725](https://issues.alfresco.com/jira/browse/AKU-725)       - Fix TypeError in ActionService (Edit Offline action)
* [AKU-734](https://issues.alfresco.com/jira/browse/AKU-734)       - Ensure selected items retained on sort order change
* [AKU-736](https://issues.alfresco.com/jira/browse/AKU-736)       - Prevent double encoding in SearchBox results
* [AKU-737](https://issues.alfresco.com/jira/browse/AKU-737)       - Fix NavigationService page relative site handling
* [AKU-738](https://issues.alfresco.com/jira/browse/AKU-738)       - Fix scoping on ContentService requests
* [AKU-743](https://issues.alfresco.com/jira/browse/AKU-743)       - Tooltip delegates resize requests

1.0.46:
* [AKU-692](https://issues.alfresco.com/jira/browse/AKU-692)       - Resolved iframe in Firefox issues
* [AKU-706](https://issues.alfresco.com/jira/browse/AKU-706)       - Ensure actions menu items are visible
* [AKU-707](https://issues.alfresco.com/jira/browse/AKU-707)       - Improve AlfSideBarContainer height calculations
* [AKU-711](https://issues.alfresco.com/jira/browse/AKU-711)       - Ensure carat appears in TinyMCE editor in dialogs
* [AKU-713](https://issues.alfresco.com/jira/browse/AKU-713)       - Fix thumbnail height/width issues
* [AKU-714](https://issues.alfresco.com/jira/browse/AKU-714)       - Verify thumbnail margin configuration
* [AKU-719](https://issues.alfresco.com/jira/browse/AKU-719)       - Update preferences key for CommentsList
* [AKU-721](https://issues.alfresco.com/jira/browse/AKU-721)       - Prevent double encoding in AlfDocumentFilters
* [AKU-727](https://issues.alfresco.com/jira/browse/AKU-727)       - Hide IE10/11 "X" in input fields
* [AKU-731](https://issues.alfresco.com/jira/browse/AKU-731)       - Prevent double-escaping of hash by updateHash function

1.0.45:
* [AKU-665](https://issues.alfresco.com/jira/browse/AKU-665)       - Clean Aikau internal attributes from payload before XHR requests
* [AKU-694](https://issues.alfresco.com/jira/browse/AKU-694)       - Ensure that generation of download zip can be cancelled
* [AKU-695](https://issues.alfresco.com/jira/browse/AKU-695)       - Ensure list is refreshed on partial upload
* [AKU-696](https://issues.alfresco.com/jira/browse/AKU-696)       - Ensure page cannot be scrolled when dialogs are displayed
* [AKU-698](https://issues.alfresco.com/jira/browse/AKU-698)       - Ensure placeholder text is not shown with auto-complete
* [AKU-701](https://issues.alfresco.com/jira/browse/AKU-701)       - Allow TextBox to configure "autocomplete" attribute
* [AKU-704](https://issues.alfresco.com/jira/browse/AKU-704)       - Grid should only resize root widgets
* [AKU-718](https://issues.alfresco.com/jira/browse/AKU-718)       - Ensure long dialogs can be scrolled in IE8/IE9
* [AKU-724](https://issues.alfresco.com/jira/browse/AKU-724)       - Correction to function name

1.0.44:
* [AKU-670](https://issues.alfresco.com/jira/browse/AKU-670)       - Ensure twister supports resizing
* [AKU-674](https://issues.alfresco.com/jira/browse/AKU-674)       - Appendix support for AlfListView
* [AKU-675](https://issues.alfresco.com/jira/browse/AKU-675)       - Support for expandable panel in grids
* [AKU-682](https://issues.alfresco.com/jira/browse/AKU-682)       - Added alfresco/forms/controls/PushButtons widget
* [AKU-683](https://issues.alfresco.com/jira/browse/AKU-683)       - Support for disabling/re-labelling button on form submit
* [AKU-689](https://issues.alfresco.com/jira/browse/AKU-689)       - Gallery view cell resizing fix
* [AKU-693](https://issues.alfresco.com/jira/browse/AKU-693)       - Fixed suggestions scoping in SearchService
* [AKU-697](https://issues.alfresco.com/jira/browse/AKU-697)       - Ensure consistent preview heigh in SearchFilmStripView

1.0.43:
* [AKU-416](https://issues.alfresco.com/jira/browse/AKU-416)       - Added download action definition
* [AKU-663](https://issues.alfresco.com/jira/browse/AKU-663)       - Updated PathTree to highlight current path
* [AKU-664](https://issues.alfresco.com/jira/browse/AKU-664)       - Updated SearchService to support non-hash based sorting
* [AKU-668](https://issues.alfresco.com/jira/browse/AKU-668)       - Updated UploadService to use dialog with single, label changing button
* [AKU-671](https://issues.alfresco.com/jira/browse/AKU-671)       - Re-center dialogs on dimension change
* [AKU-672](https://issues.alfresco.com/jira/browse/AKU-672)       - Fit TinyMCE form control into comment dialog
* [AKU-673](https://issues.alfresco.com/jira/browse/AKU-673)       - Support full screen dialogs in CommentsList
* [AKU-677](https://issues.alfresco.com/jira/browse/AKU-677)       - Added "smart" download capabilities
* [AKU-678](https://issues.alfresco.com/jira/browse/AKU-678)       - Fixed AlfButton accessibility issues
* [AKU-680](https://issues.alfresco.com/jira/browse/AKU-680)       - Support encoded facet filter selection
* [AKU-681](https://issues.alfresco.com/jira/browse/AKU-681)       - Update renderFilter config to support token substitution
* [AKU-685](https://issues.alfresco.com/jira/browse/AKU-685)       - Prevent encoding display error when setting browser title bar
* [AKU-690](https://issues.alfresco.com/jira/browse/AKU-690)       - Keyboard navigation support for widgets in grid with no focus function

1.0.42:
* [AKU-647](https://issues.alfresco.com/jira/browse/AKU-647)       - AlfDocumentList extends AlfFilteredList
* [AKU-652](https://issues.alfresco.com/jira/browse/AKU-652)       - Ensure Logo title generates correctly
* [AKU-653](https://issues.alfresco.com/jira/browse/AKU-653)       - Row mixes _AlfDndDocumentUploadMixin
* [AKU-654](https://issues.alfresco.com/jira/browse/AKU-654)       - Added alfresco/layout/UploadContainer
* [AKU-655](https://issues.alfresco.com/jira/browse/AKU-655)       - Ensure delete actions triggers reload
* [AKU-657](https://issues.alfresco.com/jira/browse/AKU-657)       - Resize detection moved to ResizeMixin
* [AKU-658](https://issues.alfresco.com/jira/browse/AKU-658)       - Ensure CrudService uses responseScope
* [AKU-659](https://issues.alfresco.com/jira/browse/AKU-659)       - Ensure full screen dialogs have fixed position
* [AKU-660](https://issues.alfresco.com/jira/browse/AKU-660)       - Ensure MultiSelectInput supports fixed options
* [AKU-661](https://issues.alfresco.com/jira/browse/AKU-661)       - Encode username on leave site
* [AKU-662](https://issues.alfresco.com/jira/browse/AKU-662)       - Ensure Logo uses either class or image source
* [AKU-666](https://issues.alfresco.com/jira/browse/AKU-666)       - Ensure upload file selection is required
* [AKU-667](https://issues.alfresco.com/jira/browse/AKU-667)       - Ensure UploadService cancel aborts requests
* [AKU-679](https://issues.alfresco.com/jira/browse/AKU-679)       - Remove superfluous title attributes from BaseFormControl

1.0.41:
* [AKU-632](https://issues.alfresco.com/jira/browse/AKU-632)       - Support configurable images in Carousel
* [AKU-637](https://issues.alfresco.com/jira/browse/AKU-637)       - Disable draggable thumbnails in AlfFilmStripView
* [AKU-638](https://issues.alfresco.com/jira/browse/AKU-638)       - Support configurable height in AlfFilmStripView
* [AKU-642](https://issues.alfresco.com/jira/browse/AKU-642)       - Updated drag-and-drop upload highlighting
* [AKU-643](https://issues.alfresco.com/jira/browse/AKU-643)       - Added simple clickable icon widget
* [AKU-644](https://issues.alfresco.com/jira/browse/AKU-644)       - Prevent ClassicWindow overflowing content
* [AKU-646](https://issues.alfresco.com/jira/browse/AKU-646)       - Capture resize events in FixedHeaderFooter
* [AKU-648](https://issues.alfresco.com/jira/browse/AKU-648)       - Override default itemKeyProperty in AlfSearchList

1.0.40:
* [AKU-626](https://issues.alfresco.com/jira/browse/AKU-626)       - Thumbnail highlighting on selection
* [AKU-627](https://issues.alfresco.com/jira/browse/AKU-627)       - Thumbnail click to select support
* [AKU-628](https://issues.alfresco.com/jira/browse/AKU-628)       - Gallery view thumbnail resizing
* [AKU-629](https://issues.alfresco.com/jira/browse/AKU-629)       - Gallery view layout fixes
* [AKU-630](https://issues.alfresco.com/jira/browse/AKU-630)       - Truncate display name on GalleryThumbnail
* [AKU-631](https://issues.alfresco.com/jira/browse/AKU-631)       - Configurable Thumbnail rendering
* [AKU-633](https://issues.alfresco.com/jira/browse/AKU-633)       - Link support for Logo
* [AKU-634](https://issues.alfresco.com/jira/browse/AKU-634)       - Disable resizing in sidebar

1.0.39:
* [AKU-548](https://issues.alfresco.com/jira/browse/AKU-548)       - New bulk action support (sync to cloud)
* [AKU-605](https://issues.alfresco.com/jira/browse/AKU-605)       - Fix horizontal scrollbars in IE and possibly address dialog width-change on hover issue (IE only)
* [AKU-610](https://issues.alfresco.com/jira/browse/AKU-610)       - AlfFilteredList hash ignored on load in non-English locales
* [AKU-611](https://issues.alfresco.com/jira/browse/AKU-611)       - Navigation target/type now configurable in _SearchResultLinkMixin
* [AKU-612](https://issues.alfresco.com/jira/browse/AKU-612)       - Send Accept-Language header with all XHR requests
* [AKU-614](https://issues.alfresco.com/jira/browse/AKU-614)       - Dialogs should now resize larger on browser resize, where apropriate
* [AKU-615](https://issues.alfresco.com/jira/browse/AKU-615)       - Selection now retained when changing number of displayed columns in search results
* [AKU-617](https://issues.alfresco.com/jira/browse/AKU-617)       - Request to join a site now correctly returns user to their home page (defaults to their dashboard)
* [AKU-619](https://issues.alfresco.com/jira/browse/AKU-619)       - "Advanced Search with name, title or description is not working"
* [AKU-622](https://issues.alfresco.com/jira/browse/AKU-622)       - Remove default drag/drop capability within faceted search results
* [AKU-623](https://issues.alfresco.com/jira/browse/AKU-623)       - Make user home page configurable in SiteService and default to /dashboard

1.0.38:
* [AKU-559](https://issues.alfresco.com/jira/browse/AKU-559)       - Widget instantiation order different in non English languages
* [AKU-590](https://issues.alfresco.com/jira/browse/AKU-590)       - Correct Dojo locale initialisation problems
* [AKU-598](https://issues.alfresco.com/jira/browse/AKU-598)       - Properly handle ALF_DOCUMENT_TAGGED topic
* [AKU-600](https://issues.alfresco.com/jira/browse/AKU-600)       - Resize FixedHeaderFooter widget when header/footer children visibility is altered
* [AKU-604](https://issues.alfresco.com/jira/browse/AKU-604)       - Field focus order incorrect in non English languages
* [AKU-606](https://issues.alfresco.com/jira/browse/AKU-606)       - Site landing page now configurable (still defaults to /dashboard)
* [AKU-607](https://issues.alfresco.com/jira/browse/AKU-607)       - Aikau actions now work properly in a search result list
* [AKU-608](https://issues.alfresco.com/jira/browse/AKU-608)       - XhrActions now supports widgetsForActions
* [AKU-609](https://issues.alfresco.com/jira/browse/AKU-609)       - Support multiple nodes when adding/removing favourites

1.0.37:
* [AKU-586](https://issues.alfresco.com/jira/browse/AKU-586)       - Ensure AlfTagFilters publish to correct scope
* [AKU-591](https://issues.alfresco.com/jira/browse/AKU-591)       - Ensure delete action issues reload request on completion
* [AKU-545](https://issues.alfresco.com/jira/browse/AKU-545)       - Support Move in bulk actions
* [AKU-554](https://issues.alfresco.com/jira/browse/AKU-554)       - Support configurable URIs in SearchBox
* [AKU-555](https://issues.alfresco.com/jira/browse/AKU-555)       - Externalise LiveSearchItem creation in SearchBox
* [AKU-583](https://issues.alfresco.com/jira/browse/AKU-583)       - Support publishOnAdd for AlfTabContainer
* [AKU-467](https://issues.alfresco.com/jira/browse/AKU-467)       - Support for truncated text in Select form control
* [AKU-596](https://issues.alfresco.com/jira/browse/AKU-596)       - Defend against corrupt thumbnail rendition artifacts

1.0.36.3:
* [AKU-597](https://issues.alfresco.com/jira/browse/AKU-597)       - Ensure AlfSearchList respects initial URL hash parameters
* [AKU-599](https://issues.alfresco.com/jira/browse/AKU-599)       - Prevent search terms from being truncated

1.0.36.2:
* [AKU-595](https://issues.alfresco.com/jira/browse/AKU-595)       - Ensure LeftAndRight ordering is correct

1.0.36.1:
* [AKU-592](https://issues.alfresco.com/jira/browse/AKU-592)       - Ensure PublishingDropDown cancellation behaves correctly
* [AKU-593](https://issues.alfresco.com/jira/browse/AKU-593)       - Ensure dialog height is sized correctly for content
* [AKU-588](https://issues.alfresco.com/jira/browse/AKU-588)       - Ensure GalleryView renders correctly on initial load

1.0.36:
* [AKU-464](https://issues.alfresco.com/jira/browse/AKU-464)       - DateTextBox support current date config
* [AKU-465](https://issues.alfresco.com/jira/browse/AKU-465)       - Added place holder support in DateTextBox
* [AKU-468](https://issues.alfresco.com/jira/browse/AKU-468)       - Use consistent font in TextArea
* [AKU-544](https://issues.alfresco.com/jira/browse/AKU-544)       - Bulk action support for copy
* [AKU-547](https://issues.alfresco.com/jira/browse/AKU-547)       - Bulk action support for start workflow
* [AKU-559](https://issues.alfresco.com/jira/browse/AKU-559)       - Async dependency handling
* [AKU-568](https://issues.alfresco.com/jira/browse/AKU-568)       - Added alfresco/layout/DynamicWidgets
* [AKU-571](https://issues.alfresco.com/jira/browse/AKU-571)       - Prevent form control cropping in dialogs
* [AKU-573](https://issues.alfresco.com/jira/browse/AKU-573)       - Prevent creating tabs with duplicate IDs in AlfTabContainer
* [AKU-574](https://issues.alfresco.com/jira/browse/AKU-574)       - Ensure AlfSideBarContainer can be re-opened
* [AKU-578](https://issues.alfresco.com/jira/browse/AKU-578)       - Suppress user preferences in LoggingService
* [AKU-579](https://issues.alfresco.com/jira/browse/AKU-579)       - Pervent nnnecessary scrollbar showing in form dialog
* [AKU-580](https://issues.alfresco.com/jira/browse/AKU-580)       - PublishingDropDown cancel subscription updates
* [AKU-584](https://issues.alfresco.com/jira/browse/AKU-584)       - SearchService scoping fix

1.0.35:
* [AKU-551](https://issues.alfresco.com/jira/browse/AKU-551)       - Retain item selection when switching views
* [AKU-557](https://issues.alfresco.com/jira/browse/AKU-557)       - Added support for "full screen" dialogs
* [AKU-558](https://issues.alfresco.com/jira/browse/AKU-558)       - Remove text-decoration from menu item links
* [AKU-559](https://issues.alfresco.com/jira/browse/AKU-559)       - Address non-default locale AlfFilteredList rendering
* [AKU-563](https://issues.alfresco.com/jira/browse/AKU-563)       - Improve InlineEditProperty re-rendering on updates
* [AKU-565](https://issues.alfresco.com/jira/browse/AKU-565)       - Added 20x20 delete icon
* [AKU-567](https://issues.alfresco.com/jira/browse/AKU-567)       - Defensive code against reference error in DebugLog
* [AKU-569](https://issues.alfresco.com/jira/browse/AKU-569)       - Support disable in PublishingDropDownMenu
* [AKU-572](https://issues.alfresco.com/jira/browse/AKU-572)       - FixedHeaderFooter height calculations
* [AKU-575](https://issues.alfresco.com/jira/browse/AKU-575)       - ComboBox on change event handling updates
* [AKU-576](https://issues.alfresco.com/jira/browse/AKU-576)       - AlfGalleryViewSlider default column handling updates
* [AKU-577](https://issues.alfresco.com/jira/browse/AKU-577)       - IE9 keyboard navigation fix in menu items
* [AKU-581](https://issues.alfresco.com/jira/browse/AKU-581)       - Ensure form control labels are visible

1.0.34:
* [AKU-507](https://issues.alfresco.com/jira/browse/AKU-507)       - Ensure clearing filters for AlfFilteredList loads data
* [AKU-538](https://issues.alfresco.com/jira/browse/AKU-538)       - Updated AlfFilmStripView carousel to set height appropriately
* [AKU-541](https://issues.alfresco.com/jira/browse/AKU-541)       - Added support for OR in forms rule engine
* [AKU-543](https://issues.alfresco.com/jira/browse/AKU-543)       - Reset new style buttons not have bold text
* [AKU-546](https://issues.alfresco.com/jira/browse/AKU-546)       - Added support for bulk delete on selected items
* [AKU-550](https://issues.alfresco.com/jira/browse/AKU-550)       - Upload widgets
* [AKU-556](https://issues.alfresco.com/jira/browse/AKU-556)       - Ensure "In folder" links on search results work
* [AKU-559](https://issues.alfresco.com/jira/browse/AKU-559)       - Resolved missing dependency issue from non en locales

1.0.33:
* [AKU-478](https://issues.alfresco.com/jira/browse/AKU-478)       - Dynamic visibility width calculations in HorizontalWidgets
* [AKU-516](https://issues.alfresco.com/jira/browse/AKU-516)       - Reduce options calls to server from MultiSelectInput
* [AKU-518](https://issues.alfresco.com/jira/browse/AKU-518)       - Add default primary button to certain dialogs
* [AKU-532](https://issues.alfresco.com/jira/browse/AKU-532)       - Multi-select download as zip in search support
* [AKU-534](https://issues.alfresco.com/jira/browse/AKU-534)       - Changed default search style in FilteringSelect
* [AKU-536](https://issues.alfresco.com/jira/browse/AKU-536)       - Remove encoding from AlfShareFooter
* [AKU-537](https://issues.alfresco.com/jira/browse/AKU-537)       - Take AlfGalleryViewSlider columns configuration from AlfGalleryView
* [AKU-539](https://issues.alfresco.com/jira/browse/AKU-539)       - Fix SingleTextFieldForm layout (also in 1.0.32.1)
* [AKU-540](https://issues.alfresco.com/jira/browse/AKU-540)       - Fix default InlinedEditProperty permissions (also in 1.0.31.1 and 1.0.32.2)
* [AKU-542](https://issues.alfresco.com/jira/browse/AKU-542)       - Remove animation from dialog fade in/out (now configurable)
* [AKU-549](https://issues.alfresco.com/jira/browse/AKU-549)       - Remove default facets from SearchService

1.0.32:
* [AKU-460](https://issues.alfresco.com/jira/browse/AKU-460)       - Improved handling of hidden terms in alfresco/headers/SearchBox
* [AKU-515](https://issues.alfresco.com/jira/browse/AKU-515)       - Fixed pubSubScope handling in alfresco/renderers/Thumbnail
* [AKU-521](https://issues.alfresco.com/jira/browse/AKU-521)       - Improved change event handling in alfresco/forms/controls/DateTextBox
* [AKU-523](https://issues.alfresco.com/jira/browse/AKU-523)       - Added support for dynamic warning configuration in forms
* [AKU-526](https://issues.alfresco.com/jira/browse/AKU-526)       - Updated alfresco/documentlibrary/views/AlfFilmStripView to support infinite scrolling mode
* [AKU-528](https://issues.alfresco.com/jira/browse/AKU-528)       - LESS support for global link colour and decoration
* [AKU-529](https://issues.alfresco.com/jira/browse/AKU-529)       - Fixed alfresco/layout/FixedHeaderFooter resizing issue
* [AKU-531](https://issues.alfresco.com/jira/browse/AKU-531)       - Created service registry to prevent duplicate service subscriptions

1.0.31:
* [AKU-290](https://issues.alfresco.com/jira/browse/AKU-290)       - Added configurable support for alfresco/lists/Paginator to hide when list data is requested
* [AKU-483](https://issues.alfresco.com/jira/browse/AKU-483)       - Update alfresco/layout/FixedHeaderFooter to assume numeric height is intended to be pixels
* [AKU-492](https://issues.alfresco.com/jira/browse/AKU-492)       - Improved undefined variable handling by widgets used by doclib.lib.js
* [AKU-494](https://issues.alfresco.com/jira/browse/AKU-494)       - Updated alfresco/navigation/PathTree to support useHash configuration
* [AKU-498](https://issues.alfresco.com/jira/browse/AKU-498)       - Added support to enable list item focus highlighting
* [AKU-499](https://issues.alfresco.com/jira/browse/AKU-499)       - Correction of search icon placement in alfresco/header/SearchBox
* [AKU-502](https://issues.alfresco.com/jira/browse/AKU-502)       - Improved alt text for alfresco/renderers/InlineEditProperty with missing propertyToRender
* [AKU-503](https://issues.alfresco.com/jira/browse/AKU-503)       - Updated default views and alfresco/renderers/MoreInfo to have a consistent approach to inline editing title and description
* [AKU-504](https://issues.alfresco.com/jira/browse/AKU-504)       - Ensure cross-browser tag creation via keyboard in alfresco/renderers/Tags
* [AKU-505](https://issues.alfresco.com/jira/browse/AKU-505)       - Ensure browser back button re-applies filters for alfresco/lists/AlfFilteredList
* [AKU-506](https://issues.alfresco.com/jira/browse/AKU-506)       - Improved resizing behaviour in alfresco/layout/AlfSideBarContainer, alfresco/layout/AlfTabContainer and alfresco/layout/FixedHeaderFooter
* [AKU-507](https://issues.alfresco.com/jira/browse/AKU-507)       - Resolved alfresco/lists/AlfFilteredList regressions
* [AKU-508](https://issues.alfresco.com/jira/browse/AKU-508)       - Ensure that lists don't reload when dialogs are displayed
* [AKU-509](https://issues.alfresco.com/jira/browse/AKU-509)       - Ensure alfresco/renderers/AvatarThumbnail uses correct URL for user names containing %
* [AKU-510](https://issues.alfresco.com/jira/browse/AKU-510)       - Ensure alfresco/accessibility/AccessibilityMenu focues on items accessed via skip links
* [AKU-514](https://issues.alfresco.com/jira/browse/AKU-514)       - Updates to alfresco/layout/AlfSideBarContainer layout to prevent resizer overlapping content
* [AKU-520](https://issues.alfresco.com/jira/browse/AKU-520)       - Accessibilitt contrast correction on button colours
* [AKU-522](https://issues.alfresco.com/jira/browse/AKU-522)       - Added configuration option to prevent lists automatically requesting data when created
* [AKU-527](https://issues.alfresco.com/jira/browse/AKU-527)       - Update to make alfresco/services/SearchService APIs configurable

1.0.30:
* [AKU-452](https://issues.alfresco.com/jira/browse/AKU-452)       - Button re-styling and LESS updates
* [AKU-472](https://issues.alfresco.com/jira/browse/AKU-472)       - Support search without URL hashing
* [AKU-475](https://issues.alfresco.com/jira/browse/AKU-475)       - AlfCheckableMenuItem hashName fix
* [AKU-476](https://issues.alfresco.com/jira/browse/AKU-476)       - Improved local storage fallbacks in lists
* [AKU-477](https://issues.alfresco.com/jira/browse/AKU-477)       - Publish ALF_PAGE_WIGETS_READY when dynamically creating widgets
* [AKU-488](https://issues.alfresco.com/jira/browse/AKU-488)       - Ensure AlfSearchList honours selectedScope configuration
* [AKU-489](https://issues.alfresco.com/jira/browse/AKU-489)       - Improved initial height calculations for AlfSideBarContainer and AlfTabContainer
* [AKU-490](https://issues.alfresco.com/jira/browse/AKU-490)       - Ensure pending form validation errors are cleared on valid data entry
* [AKU-491](https://issues.alfresco.com/jira/browse/AKU-491)       - Ensure NumberSpinner can accept empty value
* [AKU-493](https://issues.alfresco.com/jira/browse/AKU-493)       - Prevent duplicates in MultiSelectInput
* [AKU-495](https://issues.alfresco.com/jira/browse/AKU-495)       - Fixed filter display in AlfBreadcrumbTrail
* [AKU-496](https://issues.alfresco.com/jira/browse/AKU-496)       - All documents filter message update
* [AKU-497](https://issues.alfresco.com/jira/browse/AKU-497)       - Fixed list paging with hash enabled
* [AKU-500](https://issues.alfresco.com/jira/browse/AKU-500)       - Fixed alfResponseScope issues with global scope logic processing

1.0.29:
* [AKU-405](https://issues.alfresco.com/jira/browse/AKU-405)       - Added alfresco/forms/TabbedControls
* [AKU-421](https://issues.alfresco.com/jira/browse/AKU-421)       - Updates to alfresco/renderers/InlineEditPropertyLink publications
* [AKU-422](https://issues.alfresco.com/jira/browse/AKU-422)       - Fixed alfresco/documentlibrary/AlfBreadcrumbTrail scoping issues
* [AKU-424](https://issues.alfresco.com/jira/browse/AKU-428)       - Ensure gallery views render correct column count initially
* [AKU-447](https://issues.alfresco.com/jira/browse/AKU-447)       - Updates to action handling to support multiple scoped Document Library instances
* [AKU-448](https://issues.alfresco.com/jira/browse/AKU-448)       - Long dialog layout tweaks
* [AKU-449](https://issues.alfresco.com/jira/browse/AKU-449)       - Updated ESC key handling for dialogs
* [AKU-450](https://issues.alfresco.com/jira/browse/AKU-450)       - Updated alfresco/search/AlfSearchResult to make it more configurable/extendable
* [AKU-453](https://issues.alfresco.com/jira/browse/AKU-453)       - Encode search result folder name characters for navigation purposes
* [AKU-455](https://issues.alfresco.com/jira/browse/AKU-455)       - Hide Dojo error display in alfresco/forms/controls/NumberSpinner
* [AKU-456](https://issues.alfresco.com/jira/browse/AKU-456)       - Allow menu bar popups to open on hover
* [AKU-457](https://issues.alfresco.com/jira/browse/AKU-457)       - Decimal place support in alfresco/forms/controls/NumberSpinner
* [AKU-458](https://issues.alfresco.com/jira/browse/AKU-458)       - Support read only mode for alfresco/forms/controls/MultiSelectInput
* [AKU-466](https://issues.alfresco.com/jira/browse/AKU-466)       - Ensure alfresco/layout/AlfTabContainer will render in dialogs
* [AKU-479](https://issues.alfresco.com/jira/browse/AKU-479)       - Support accented characters in facet filters
* [AKU-480](https://issues.alfresco.com/jira/browse/AKU-480)       - Further updates to alfresco/renderers/InlineEditPropertyLink publications
* [AKU-487](https://issues.alfresco.com/jira/browse/AKU-487)       - Further alfresco/documentlibrary/AlfBreadcrumbTrail updates
* [AKU-462](https://issues.alfresco.com/jira/browse/AKU-462)       - General Document Library tweaks

1.0.28:
* [AKU-415](https://issues.alfresco.com/jira/browse/AKU-415)       - Add hash support to [`AlfFilteredList`](src/main/resources/alfresco/lists/AlfFilteredList.js)
* [AKU-437](https://issues.alfresco.com/jira/browse/AKU-437)       - It is now possible to initialise a [`Picker`](src/main/resources/alfresco/forms/controls/Picker.js) with the `currentItem` as its value, by specifying `useCurrentItemAsValue: true` in the Picker config
* [AKU-451](https://issues.alfresco.com/jira/browse/AKU-451)       - Ensure form controls can be displayed (events are now setup correctly) on tabs
* [AKU-459](https://issues.alfresco.com/jira/browse/AKU-459)       - Ability to set user home page preference (`org.alfresco.share.user.homePage`) via a publish to the [`UserService`](src/main/resources/alfresco/services/UserService.js) on the topic `ALF_SET_USER_HOME_PAGE`

1.0.27:
* [AKU-420](https://issues.alfresco.com/jira/browse/AKU-420)       - `currentPageSize` being reset by [`AlfSortablePaginatedList`](src/main/resources/alfresco/lists/AlfSortablePaginatedList.js) in `postMixInProperties()` because of hardcoded preference name (fixed by making configurable property)
* [AKU-423](https://issues.alfresco.com/jira/browse/AKU-423)       - `formSubmissionGlobal` and `formSubmissionScope` properties added to [`DialogService`](src/main/resources/alfresco/services/DialogService.js) `publishPayload` config property, to give greater control over resultant dialog-form submission
* [AKU-425](https://issues.alfresco.com/jira/browse/AKU-425)       - Resolve all Blocker and Critical issues on Sonar raised by the SQALE plugin
* [AKU-430](https://issues.alfresco.com/jira/browse/AKU-430)       - [`DateTextBox`](src/main/resources/alfresco/forms/controls/DateTextBox.js) does not handle empty values very well (converts it to "epoch" date, i.e. 1/1/1970)
* [AKU-431](https://issues.alfresco.com/jira/browse/AKU-431)       - [`NumberSpinner`](src/main/resources/alfresco/forms/controls/NumberSpinner.js) cannot be submitted with empty value (fixed by adding optional `permitEmpty` property)
* [AKU-436](https://issues.alfresco.com/jira/browse/AKU-436)       - [`NotificationService`](src/main/resources/alfresco/services/NotificationService.js) notifications could be scrolled or even appear off screen (fixed) and also added new close button for manual closing of long-lasting notifications

1.0.26:
* [AKU-18](https://issues.alfresco.com/jira/browse/AKU-18)         - Update [`DebugLog`](src/main/resources/alfresco/logging/DebugLog.js) to make it more useful for testing
* [AKU-267](https://issues.alfresco.com/jira/browse/AKU-267)       - Add a mechanism to allow a "Create Another" pattern for dialogs
* [AKU-403](https://issues.alfresco.com/jira/browse/AKU-403)       - [`Dashlet`](src/main/resources/alfresco/dashlets/Dashlet.js) does not support LESS theming
* [AKU-407](https://issues.alfresco.com/jira/browse/AKU-407)       - Add support for publishing when clicking on an [`AvatarThumbnail`](src/main/resources/alfresco/renderers/AvatarThumbnail.js)
* [AKU-409](https://issues.alfresco.com/jira/browse/AKU-409)       - Fix [`DateTextBox`](src/main/resources/alfresco/forms/controls/DateTextBox.js) to handle invalid initial values better
* [AKU-410](https://issues.alfresco.com/jira/browse/AKU-410)       - Create prototype [`Dashlet`](src/main/resources/alfresco/dashlets/Dashlet.js) for displaying _Favorites_ and _Recents_
* [AKU-412](https://issues.alfresco.com/jira/browse/AKU-412)       - Fix intermittent unit test failures
* [AKU-413](https://issues.alfresco.com/jira/browse/AKU-413)       - Fix "dragging an item containing nested items causes single-use palette to empty"
* [AKU-414](https://issues.alfresco.com/jira/browse/AKU-414)       - [`AlfSearchList`](src/main/resources/alfresco/search/AlfSearchList.js) does not work with [`Paginator`](src/main/resources/alfresco/lists/Paginator.js)

1.0.25:
* [AKU-367](https://issues.alfresco.com/jira/browse/AKU-367)       - Added alfresco/html/HR widget
* [AKU-377](https://issues.alfresco.com/jira/browse/AKU-377)       - Update alfresco/layout/InfiniteScrollArea to request more list data when vertical space is available
* [AKU-378](https://issues.alfresco.com/jira/browse/AKU-378)       - Update form to provide option to not validate on load
* [AKU-390](https://issues.alfresco.com/jira/browse/AKU-390)       - Drag and drop nested item re-ordering fixes
* [AKU-396](https://issues.alfresco.com/jira/browse/AKU-396)       - Update alfresco/search/AlfSearchResult to include manage aspects in filtered actions
* [AKU-397](https://issues.alfresco.com/jira/browse/AKU-397)       - Refactor of alfresco/core/UrlUtils and including abstraction of addQueryParam from alfresco/services/CrudService
* [AKU-398](https://issues.alfresco.com/jira/browse/AKU-398)       - Added alfresco/forms/controls/SitePicker
* [AKU-399](https://issues.alfresco.com/jira/browse/AKU-399)       - Drag amd drop nested acceptance type verification handling
* [AKU-400](https://issues.alfresco.com/jira/browse/AKU-400)       - Update alfresco/core/NotificationUtils to fix displayPrompt function regression

1.0.24:
* [AKU-337](https://issues.alfresco.com/jira/browse/AKU-337)       - Remove Share dependencies from alfresco/dashlets/Dashlet
* [AKU-375](https://issues.alfresco.com/jira/browse/AKU-375)       - Improvements to alfresco/layout/Twister
* [AKU-376](https://issues.alfresco.com/jira/browse/AKU-376)       - Improvements to alfresco/services/InfiniteScrollService
* [AKU-379](https://issues.alfresco.com/jira/browse/AKU-379)       - Prevent single use DND times being added via keyboard actions
* [AKU-380](https://issues.alfresco.com/jira/browse/AKU-380)       - Support for DND nested accept types 
* [AKU-382](https://issues.alfresco.com/jira/browse/AKU-382)       - Fixes for alfresco/forms/Form useHash behaviour
* [AKU-383](https://issues.alfresco.com/jira/browse/AKU-383)       - Fixes for alfresco/forms/Form auto-save behaviour
* [AKU-385](https://issues.alfresco.com/jira/browse/AKU-385)       - Apply logging filters to pub/sub console output
* [AKU-388](https://issues.alfresco.com/jira/browse/AKU-388)       - Ensure alfresco/menus/AlfMenuItem supports PROCESS payload type
* [AKU-392](https://issues.alfresco.com/jira/browse/AKU-392)       - Fix reload behaviour on infinite scroll lists
* [AKU-395](https://issues.alfresco.com/jira/browse/AKU-395)       - Ensure dashlet supports alfresco/layout/InfiniteScrollArea

1.0.23.2:
* [AKU-394](https://issues.alfresco.com/jira/browse/AKU-394)       - Revert URI encoding back to false on alfresco/core/CoreXhr

1.0.23.1:
* [AKU-393](https://issues.alfresco.com/jira/browse/AKU-393)       - Added service-filtering.lib.js

1.0.23:
* [AKU-66](https://issues.alfresco.com/jira/browse/AKU-66)       - Improved concurrent request handling in alfresco/lists/AlfList and alfresco/search/AlfSearchList
* [AKU-353](https://issues.alfresco.com/jira/browse/AKU-353)       - Improved testability of alfresco/renderers/PublishingDropDownMenu
* [AKU-359](https://issues.alfresco.com/jira/browse/AKU-359)       - Added alfresco/node/MetdataGroups widget for node metadata rendering
* [AKU-360](https://issues.alfresco.com/jira/browse/AKU-360)       - Further improvements to alfresco/header/SeachBox configurability
* [AKU-361](https://issues.alfresco.com/jira/browse/AKU-361)       - Support ability to merge REST API and custom  actions in alfresco/renderers/Actions
* [AKU-362](https://issues.alfresco.com/jira/browse/AKU-362)       - Ensure that alfresco/documentlibrary/AlfBreadcrumbList supports useHash false
* [AKU-366](https://issues.alfresco.com/jira/browse/AKU-366)       - Added support for zebra striping using LESS variables in lists 
* [AKU-368](https://issues.alfresco.com/jira/browse/AKU-368)       - Ensure that text only content in dialogs is centered
* [AKU-370](https://issues.alfresco.com/jira/browse/AKU-370)       - Fixed issues with ManageAspects action
* [AKU-381](https://issues.alfresco.com/jira/browse/AKU-381)       - Remove unnecessary whitespace from dialog without buttons


1.0.22:
* [AKU-299](https://issues.alfresco.com/jira/browse/AKU-299)       - Add support for clearing alfresco/forms/controls/DragAndDropTargetControl via pub/sub
* [AKU-332](https://issues.alfresco.com/jira/browse/AKU-332)       - Added classes to improve testing for list state
* [AKU-354](https://issues.alfresco.com/jira/browse/AKU-354)       - Ensure consistency in favourites display in alfresco/header/AlfSitesMenu
* [AKU-356](https://issues.alfresco.com/jira/browse/AKU-356)       - Added support for auto-save in forms
* [AKU-364](https://issues.alfresco.com/jira/browse/AKU-364)       - Added alfresco/layout/InfiniteScrollArea
* [AKU-365](https://issues.alfresco.com/jira/browse/AKU-365)       - Improvements to alfresco/misc/AlfTooltip

1.0.21:
* [AKU-331](https://issues.alfresco.com/jira/browse/AKU-331)       - Updated alfresco/services/CoreXhr to support configurable encoding of URLs
* [AKU-336](https://issues.alfresco.com/jira/browse/AKU-336)       - Began to annotate modules with support status
* [AKU-341](https://issues.alfresco.com/jira/browse/AKU-341)       - Ensure alfresco/forms/controls/NumberSpinner can be initialised with value over 999 without initial validation error
* [AKU-343](https://issues.alfresco.com/jira/browse/AKU-343)       - Improved alfresco/lists/Paginator preference handling
* [AKU-344](https://issues.alfresco.com/jira/browse/AKU-344)       - Improved cancellation handling in alfresco/renderers/PublishingDropDownMenu
* [AKU-347](https://issues.alfresco.com/jira/browse/AKU-347)       - Ensure alfresco/documentlibrary/AlfBreadcrumbTrail can be wrapped
* [AKU-350](https://issues.alfresco.com/jira/browse/AKU-350)       - Improved default config rendering of alfresco/layout/FixedHeaderFooter
* [AKU-352](https://issues.alfresco.com/jira/browse/AKU-352)       - Improved alfresco/lists/Paginator control visibility handling on invalid data
 

1.0.20:
* [AKU-298](https://issues.alfresco.com/jira/browse/AKU-298)       - Global support for "additionalCssClasses" attribute
* [AKU-301](https://issues.alfresco.com/jira/browse/AKU-301)       - Configurable edit publication for drag and dropped items
* [AKU-316](https://issues.alfresco.com/jira/browse/AKU-316)       - Added support for "hashVarsForUpdate" to alfresco/forms/Form
* [AKU-317](https://issues.alfresco.com/jira/browse/AKU-317)       - Added support for automatic cache busting to alfresco/core/CoreXhr
* [AKU-318](https://issues.alfresco.com/jira/browse/AKU-318)       - Ensure nested drag and dropped item label data is retained when editing parent item
* [AKU-321](https://issues.alfresco.com/jira/browse/AKU-321)       - Added alfresco/lists/views/HtmlListView
* [AKU-322](https://issues.alfresco.com/jira/browse/AKU-322)       - Ensure form controls nested within alfresco/forms/ControlRow publish initial value
* [AKU-328](https://issues.alfresco.com/jira/browse/AKU-328)       - Prevent event bubbling on alfresco/debug/WidgetInfo image click
* [AKU-330](https://issues.alfresco.com/jira/browse/AKU-330)       - Added support for automatic scroll to item in list
* [AKU-342](https://issues.alfresco.com/jira/browse/AKU-342)       - Infinite scroll support in all paginated lists
* [AKU-345](https://issues.alfresco.com/jira/browse/AKU-345)       - Improvements to logging in alfresco/services/NavigationService
* [AKU-346](https://issues.alfresco.com/jira/browse/AKU-346)       - Ensure assign workflow URL is generated correctly

1.0.19:
* [AKU-290](https://issues.alfresco.com/jira/browse/AKU-290)       - Prevent menu items opening on hover
* [AKU-293](https://issues.alfresco.com/jira/browse/AKU-293)       - Fix URL hash sorting/pagination support
* [AKU-296](https://issues.alfresco.com/jira/browse/AKU-296)       - Dialog CSS tweaks
* [AKU-297](https://issues.alfresco.com/jira/browse/AKU-297)       - Remove "flutter" on DND, set explicit target
* [AKU-300](https://issues.alfresco.com/jira/browse/AKU-300)       - Improved search result calendar links
* [AKU-302](https://issues.alfresco.com/jira/browse/AKU-302)       - Page size URL hash attribute fix
* [AKU-307](https://issues.alfresco.com/jira/browse/AKU-307)       - Fix potential memory leak in ResizeMixin
* [AKU-313](https://issues.alfresco.com/jira/browse/AKU-313)       - Added configurable display for "alfresco/dnd/DroppedItem" widget
* [AKU-314](https://issues.alfresco.com/jira/browse/AKU-314)       - Improved JSDoc on "alfresco/forms/controls/HiddenValue"
* [AKU-319](https://issues.alfresco.com/jira/browse/AKU-319)       - "alfresco/services/ActionService" createLinkContent fix
* [AKU-323](https://issues.alfresco.com/jira/browse/AKU-323)       - "alfresco/services/DocumentService" fixes
* [AKU-325](https://issues.alfresco.com/jira/browse/AKU-325)       - "alfresco/forms/controls/MultiSelectInput" keyboard navigation fixes

1.0.18: 
* [AKU-204](https://issues.alfresco.com/jira/browse/AKU-204)       - Add support for "document-upload-new-version" action
* [AKU-281](https://issues.alfresco.com/jira/browse/AKU-281)       - NavigationService postToPage ignores target
* [AKU-282](https://issues.alfresco.com/jira/browse/AKU-282)       - ActionService is ignoring the currentTarget config value for action type "link"
* [AKU-283](https://issues.alfresco.com/jira/browse/AKU-283)       - MultiSelectInput: Loading... message is not replaced by results
* [AKU-284](https://issues.alfresco.com/jira/browse/AKU-284)       - Pub/sub logging goes directly to console when client-debug is enabled
* [AKU-285](https://issues.alfresco.com/jira/browse/AKU-285)       - Create activity summary widget
* [AKU-286](https://issues.alfresco.com/jira/browse/AKU-286)       - Update alfresco/header package widgets to use LESS variables
* [AKU-289](https://issues.alfresco.com/jira/browse/AKU-289)       - PublishingDropDownMenu does not always render options if loaded within a List
* [AKU-291](https://issues.alfresco.com/jira/browse/AKU-291)       - Update tutorial 1 to include instructions on using remote Repo
* [AKU-294](https://issues.alfresco.com/jira/browse/AKU-294)       - Fixed header and footer
* [AKU-295](https://issues.alfresco.com/jira/browse/AKU-295)       - PublishingDropDownMenu does not support aborted change requests.
* [AKU-305](https://issues.alfresco.com/jira/browse/AKU-305)       - Right Click on header menu issue
* [AKU-306](https://issues.alfresco.com/jira/browse/AKU-306)       - Keyboard navigation for the multi select input widget does not work with IE11
* [AKU-312](https://issues.alfresco.com/jira/browse/AKU-312)       - MultiSelectInput: Dropdown list not populated fully if previous item was selected using keyboard.

1.0.17.1:
* [AKU-304](https://issues.alfresco.com/jira/browse/AKU-304)       - The confirmation dialog is not displayed correctly

1.0.17:
* [AKU-19](https://issues.alfresco.com/jira/browse/AKU-19)         - Upgrade to use Dojo 1.10.4
* [AKU-203](https://issues.alfresco.com/jira/browse/AKU-203)       - Added support for document-locate action
* [AKU-244](https://issues.alfresco.com/jira/browse/AKU-244)       - Added HTML sanitizing proxy WebScript
* [AKU-262](https://issues.alfresco.com/jira/browse/AKU-262)       - Made alfresco/documentlibrary/AlfBreadcrumbTrail more abstract
* [AKU-275](https://issues.alfresco.com/jira/browse/AKU-275)       - Ensure form button disabled HTML attribute is set correctly
* [AKU-277](https://issues.alfresco.com/jira/browse/AKU-277)       - Fix keybord navigation of MultiSelectInput form control
* [AKU-278](https://issues.alfresco.com/jira/browse/AKU-278)       - Added "alfresco/layout/StripedContent" widget
* [AKU-279](https://issues.alfresco.com/jira/browse/AKU-279)       - Support for add tab in "alfresco/layout/AlfTabContainer"
* [AKU-280](https://issues.alfresco.com/jira/browse/AKU-280)       - Improved handling of long text in MultiSelectInput

1.0.16:
* [AKU-247](https://issues.alfresco.com/jira/browse/AKU-247)       - Ensure value is retained when options updated
* [AKU-248](https://issues.alfresco.com/jira/browse/AKU-248)       - Ensure filter selection resets pagination
* [AKU-249](https://issues.alfresco.com/jira/browse/AKU-249)       - Fix to tag render filter selection publication
* [AKU-250](https://issues.alfresco.com/jira/browse/AKU-250)       - Ensure initially rendered view is marked as selected
* [AKU-251](https://issues.alfresco.com/jira/browse/AKU-251)       - Fix favouriting and PreferenceService for use in standalone clients
* [AKU-252](https://issues.alfresco.com/jira/browse/AKU-252)       - Make create content dialog wider
* [AKU-253](https://issues.alfresco.com/jira/browse/AKU-253)       - Improve sidebar defaults and preference handling
* [AKU-254](https://issues.alfresco.com/jira/browse/AKU-254)       - Ensure templated content can be created on standalone clients
* [AKU-257](https://issues.alfresco.com/jira/browse/AKU-257)       - Ensure Gallery View folder thumbnail can be selected
* [AKU-266](https://issues.alfresco.com/jira/browse/AKU-266)       - Create tooltip that supports widget models
* [AKU-268](https://issues.alfresco.com/jira/browse/AKU-268)       - Update renderFilter to support array data
* [AKU-271](https://issues.alfresco.com/jira/browse/AKU-271)       - Ensure required NumberSpinner can have 0 as a valid value
* [AKU-272](https://issues.alfresco.com/jira/browse/AKU-272)       - NumberSpinner validation handling improvements
* [AKU-273](https://issues.alfresco.com/jira/browse/AKU-273)       - Add scroll bar to dialog body as content grows

1.0.15:
* [AKU-195](https://issues.alfresco.com/jira/browse/AKU-195)       - Basic support for edit document properties
* [AKU-220](https://issues.alfresco.com/jira/browse/AKU-220)       - PubSub options handling improvements
* [AKU-232](https://issues.alfresco.com/jira/browse/AKU-232)       - ActionService updates for deleting content
* [AKU-234](https://issues.alfresco.com/jira/browse/AKU-234)       - Added alfresco/renderers/AvatarThumbnail
* [AKU-235](https://issues.alfresco.com/jira/browse/AKU-235)       - Update test app and archetype to not use Maven snapshots
* [AKU-238](https://issues.alfresco.com/jira/browse/AKU-238)       - Ensure MultiSelectInput options are not clipped in dialog
* [AKU-239](https://issues.alfresco.com/jira/browse/AKU-239)       - Include empty array data as missing required value
* [AKU-242](https://issues.alfresco.com/jira/browse/AKU-242)       - Support configurable page sizes in alfresco/lists/Paginator
* [AKU-243](https://issues.alfresco.com/jira/browse/AKU-243)       - Added pagination and sorting to alfresco/renderers/CommentsList

1.0.14:
* [AKU-158](https://issues.alfresco.com/jira/browse/AKU-158)       - Improved publication/subscription log
* [AKU-219](https://issues.alfresco.com/jira/browse/AKU-219)       - Nested "use-once" items returned to palette
* [AKU-220](https://issues.alfresco.com/jira/browse/AKU-220)       - PubSub options on form controls honour previous value
* [AKU-221](https://issues.alfresco.com/jira/browse/AKU-221)       - Prevent dropped items being added to palette
* [AKU-227](https://issues.alfresco.com/jira/browse/AKU-227)       - CommentsList widget improvements
* [AKU-229](https://issues.alfresco.com/jira/browse/AKU-229)       - Support nested drop targets
* [AKU-230](https://issues.alfresco.com/jira/browse/AKU-230)       - InlineEditProperty with renderOnNewLine enabled layout fix
* [AKU-231](https://issues.alfresco.com/jira/browse/AKU-231)       - Simple mode for alfresco/renderers/Date
* [AKU-233](https://issues.alfresco.com/jira/browse/AKU-233)       - alfresco/renderers/Thumbnail enhancements
* [AKU-236](https://issues.alfresco.com/jira/browse/AKU-236)       - Updates to alfresco/dnd/DragAndDropItemsListView widget
* [AKU-245](https://issues.alfresco.com/jira/browse/AKU-245)       - Localize alfresco/services/CrudService messages

1.0.13:
* [AKU-163](https://issues.alfresco.com/jira/browse/AKU-163)       - alfresco/lists/AlfHashList can update load payload from hash parameters
* [AKU-178](https://issues.alfresco.com/jira/browse/AKU-178)       - New alfresco/forms/controls/MultiSelectInput widget
* [AKU-191](https://issues.alfresco.com/jira/browse/AKU-191)       - New alfresco/dnd/DragAndDropItemsListView widget
* [AKU-196](https://issues.alfresco.com/jira/browse/AKU-196)       - Added support for "document-approve" action
* [AKU-197](https://issues.alfresco.com/jira/browse/AKU-197)       - Added support for "document-reject" action
* [AKU-216](https://issues.alfresco.com/jira/browse/AKU-216)       - Updated ContainerPicker to support configurable repository root node.
* [AKU-218](https://issues.alfresco.com/jira/browse/AKU-218)       - Added modelling service config creator

1.0.12:
* [AKU-14](https://issues.alfresco.com/jira/browse/AKU-14)       - Code Mirror form control updates
* [AKU-150](https://issues.alfresco.com/jira/browse/AKU-150)     - CSS updates to support Share title bar
* [AKU-188](https://issues.alfresco.com/jira/browse/AKU-188)     - Hide edit button on DND items by default
* [AKU-189](https://issues.alfresco.com/jira/browse/AKU-189)     - Use-once DND items
* [AKU-190](https://issues.alfresco.com/jira/browse/AKU-190)     - Multiple DND source keyboard control fix
* [AKU-192](https://issues.alfresco.com/jira/browse/AKU-192)     - Added alfresco/lists/AlfFilteredList widget
* [AKU-193](https://issues.alfresco.com/jira/browse/AKU-193)     - Form control options localization fix
* [AKU-217](https://issues.alfresco.com/jira/browse/AKU-217)     - CSS correction for Logo

1.0.11:
* [AKU-3](https://issues.alfresco.com/jira/browse/AKU-3)     - Updated tests to work against Selenium Grid
* [AKU-37](https://issues.alfresco.com/jira/browse/AKU-37)   - Added folder view preference handling
* [AKU-159](https://issues.alfresco.com/jira/browse/AKU-159) - Support for truncated property rendering
* [AKU-175](https://issues.alfresco.com/jira/browse/AKU-175) - Improved image source logo width handling
* [AKU-177](https://issues.alfresco.com/jira/browse/AKU-177) - Fixed scoping on AlfDetailedViewItem
* [AKU-180](https://issues.alfresco.com/jira/browse/AKU-180) - PDF.js preview faults test fix
* [AKU-182](https://issues.alfresco.com/jira/browse/AKU-182) - Update archetype to include repo connection config
* [AKU-183](https://issues.alfresco.com/jira/browse/AKU-183) - Index page for unit test application
* [AKU-184](https://issues.alfresco.com/jira/browse/AKU-184) - DND item label localization

1.0.10:
* [AKU-133](https://issues.alfresco.com/jira/browse/AKU-133)     - FileType configurable images
* [AKU-157](https://issues.alfresco.com/jira/browse/AKU-157)     - Ensure HiddenValue form control can be set
* [AKU-170](https://issues.alfresco.com/jira/browse/AKU-170)     - Improvements to test reporter
* [AKU-172](https://issues.alfresco.com/jira/browse/AKU-172)     - SearchBox configurability updates
* [AKU-176](https://issues.alfresco.com/jira/browse/AKU-176)     - Form dialog width setting updates

1.0.9:
* [AKU-33](https://issues.alfresco.com/jira/browse/AKU-33)     - Add dedicated Detailed View result widget for performance
* [AKU-115](https://issues.alfresco.com/jira/browse/AKU-115)   - Use keyboard to add DND items
* [AKU-116](https://issues.alfresco.com/jira/browse/AKU-116)   - Re-order DND items using keyboard navigation
* [AKU-148](https://issues.alfresco.com/jira/browse/AKU-148)   - Alias AlfDocumentListPaginator
* [AKU-149](https://issues.alfresco.com/jira/browse/AKU-149)   - When a publishPayloadType 'BUILD' updates
* [AKU-150](https://issues.alfresco.com/jira/browse/AKU-150)   - Title overflow handling
* [AKU-155](https://issues.alfresco.com/jira/browse/AKU-155)   - Improved form dialog submission failures
* [AKU-160](https://issues.alfresco.com/jira/browse/AKU-160)   - Duplicate BaseFormControlfunctions
* [AKU-161](https://issues.alfresco.com/jira/browse/AKU-161)   - Fix noValueUpdateWhenHiddenOrDisabled
* [AKU-164](https://issues.alfresco.com/jira/browse/AKU-164)   - SearchBox styling
* [AKU-168](https://issues.alfresco.com/jira/browse/AKU-168)   - PickedItem fails in singleItemMode

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

