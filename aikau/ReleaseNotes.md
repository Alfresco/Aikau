Aikau 1.0.20 Release Notes
==========================

New deprecations:
-----------------
* alfresco/documentlibrary/AlfDocumentListInfiniteScroll.js      (use: alfresco/services/InfiniteScrollService)

Previous deprecations:
---------------------
* alfresco/core/NotificationUtils.js                             (use alfresco/services/NotificationService)
* alfresco/documentlibrary/AlfDocumentListPaginator              (use: alfresco/lists/Paginator)
* alfresco/documentlibrary/AlfResultsPerPageGroup                (use: alfresco/lists/ResultsPerPageGroup)
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

Resolved issues (see https://issues.alfresco.com/jira/browse/<issue-number> ):
----------------
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

