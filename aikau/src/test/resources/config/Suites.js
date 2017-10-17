/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * This provides the configuration for test suites.
 *
 * @author Richard Smith
 * @author Martin Doyle
 */
define(function() {

   // Whether to run all tests or just a few
   var runAllTests = true;
   // runAllTests = false; // Comment/uncomment this line to toggle

   // This is the collection to change when only some tests are required
   var someTests = [
      "alfresco/renderers/ToggleTest"

      // THESE TESTS REGULARLY, BUT INTERMITTENTLY, FAIL WHEN RUNNING FULL SUITES - INVESTIGATE
      // "alfresco/preview/PdfJsPreviewFaultsTest",
      // "alfresco/documentlibrary/views/FilmStripViewTest",
      // "alfresco/documentlibrary/views/MediaFilmStripViewTest",
      // "alfresco/forms/controls/ContainerPickerTest",
      // "alfresco/forms/controls/SitePickerTest",
      // "alfresco/renderers/CommentsListTest",
      // "alfresco/services/DialogServiceTest"
   ];

   // This is the superset collection of all tests
   var allTests = [
      "alfresco/CodeCoverageBalancer",

      "alfresco/accessibility/AccessibilityMenuTest",
      "alfresco/accessibility/SemanticWrapperMixinTest",

      "alfresco/buttons/ButtonsTest",
      "alfresco/buttons/DropDownButtonTest",
      "alfresco/buttons/DynamicPayloadButtonTest",

      "alfresco/charts/ccc/PieChartTest",

      "alfresco/core/AdvancedVisibilityConfigTest",
      "alfresco/core/ClientPropRenderFilterTest",
      "alfresco/core/CoreRwdTest",
      "alfresco/core/CoreXhrTest",
      "alfresco/core/NotificationUtilsTest",
      "alfresco/core/ObjectProcessingMixinTest",
      "alfresco/core/PageTest",
      "alfresco/core/PublishPayloadMixinTest",
      "alfresco/core/RenderFilterTest",
      "alfresco/core/ResponseScopeTest",
      "alfresco/core/TemporalUtilsTest",
      "alfresco/core/VisibilityConfigTest",
      "alfresco/core/WidgetCreationTest",

      "alfresco/creation/WidgetConfigTest",

      "alfresco/debug/WidgetInfoTest",

      "alfresco/dashlets/DashletTest",
      "alfresco/dashlets/InfiniteScrollDashletTest",

      "alfresco/dnd/AlternateEditorTest",
      "alfresco/dnd/DndTest",
      "alfresco/dnd/FormCreationTest",
      "alfresco/dnd/ModelCreationServiceTest",
      "alfresco/dnd/MultiSourceTest",
      "alfresco/dnd/NestedConfigurationTest",
      "alfresco/dnd/NestedReorderTest",

      "alfresco/documentlibrary/AlfDocumentActionMenuItemTest",
      "alfresco/documentlibrary/AlfDocumentTest",
      "alfresco/documentlibrary/AlfDocumentFiltersTest",
      "alfresco/documentlibrary/AlfDocumentListTest",
      "alfresco/documentlibrary/AlfGalleryViewSliderTest",
      "alfresco/documentlibrary/BreadcrumbTrailTest",
      "alfresco/documentlibrary/CreateContentTest",
      "alfresco/documentlibrary/DocumentLibraryTest",
      "alfresco/documentlibrary/DocumentListTest",
      "alfresco/documentlibrary/DocumentSelectorTest",
      "alfresco/documentlibrary/FilteredDocumentListTest",
      "alfresco/documentlibrary/InfiniteScrollDocumentListTest",
      "alfresco/documentlibrary/PaginationTest",
      "alfresco/documentlibrary/SearchListScrollTest",
      "alfresco/documentlibrary/SearchListTest",
      "alfresco/documentlibrary/SelectedItemsMenuTest",
      "alfresco/documentlibrary/SitesListTest",
      "alfresco/documentlibrary/TagFiltersTest",
      "alfresco/documentlibrary/ViewPreferencesGroupTest",
      "alfresco/documentlibrary/views/AlfDetailedViewTest",
      "alfresco/documentlibrary/views/AlfDocumentListWithHeaderTest",
      "alfresco/documentlibrary/views/FilmStripViewTest",
      "alfresco/documentlibrary/views/MediaFilmStripViewTest",
      "alfresco/documentlibrary/views/GalleryViewTest",
      "alfresco/documentlibrary/views/GalleryViewThumbnailSizingTest",

      "alfresco/footer/FooterTest",

      "alfresco/forms/AutoSaveFormsTest",
      "alfresco/forms/CollapsibleSectionTest",
      "alfresco/forms/ControlRowTest",
      "alfresco/forms/CrudFormTest",
      "alfresco/forms/DynamicFormTest",
      "alfresco/forms/FormFieldFocusOrderTest",
      "alfresco/forms/FormWarningsTest",
      "alfresco/forms/FormsTest",
      "alfresco/forms/FormValidationTest",
      "alfresco/forms/HashFormTest",
      "alfresco/forms/InitialValuesTest",
      "alfresco/forms/LateFieldRegistrationTest",
      "alfresco/forms/LayoutRulesTest",
      "alfresco/forms/SingleTextFieldFormTest",
      "alfresco/forms/TabsInFormsTest",

      "alfresco/forms/controls/AsyncFormControlLoadingTest",
      "alfresco/forms/controls/AutoSetTest",
      "alfresco/forms/controls/BaseFormTest",
      "alfresco/forms/controls/CheckBoxTest",
      "alfresco/forms/controls/CodeMirrorTest",
      "alfresco/forms/controls/ComboBoxTest",
      "alfresco/forms/controls/ContainerPickerTest",
      "alfresco/forms/controls/DateTextBoxTest",
      "alfresco/forms/controls/DateRangeTest",
      "alfresco/forms/controls/DisablingSubmitFormTest",
      "alfresco/forms/controls/DocumentPickerTest",
      "alfresco/forms/controls/DocumentPickerSingleItemTest",
      "alfresco/forms/controls/FilePickerTest",
      "alfresco/forms/controls/FilteringSelectTest",
      "alfresco/forms/controls/FormButtonDialogTest",
      "alfresco/forms/controls/MarkdownWithPreviewEditorTest",
      "alfresco/forms/controls/MultipleEntryFormControlTest",
      "alfresco/forms/controls/MultiSelectInputTest",
      "alfresco/forms/controls/NumberSpinnerTest",
      "alfresco/forms/controls/PushButtonsTest",
      "alfresco/forms/controls/RadioButtonsTest",
      "alfresco/forms/controls/SelectedListItemsTest",
      "alfresco/forms/controls/SelectTest",
      "alfresco/forms/controls/SimplePickerTest",
      "alfresco/forms/controls/SitePickerTest",
      "alfresco/forms/controls/TextAreaTest",
      "alfresco/forms/controls/TextBoxTest",
      "alfresco/forms/controls/TreeTest",
      "alfresco/forms/controls/TinyMCETest",
      "alfresco/forms/controls/ValidationTest",
      "alfresco/forms/controls/XssPreventionTest",

      "alfresco/forms/controls/utilities/RulesEngineTest",

      "alfresco/header/HeaderWidgetsTest",
      "alfresco/header/SearchBoxTest",
      "alfresco/header/WarningTest",

      "alfresco/html/HeadingTest",
      "alfresco/html/ImageTest",
      "alfresco/html/LabelTest",
      "alfresco/html/MarkdownTest",
      "alfresco/html/SVGImageTest",

      "alfresco/layout/AlfSideBarContainerTest",
      "alfresco/layout/AlfStackContainerTest",
      "alfresco/layout/AlfTabContainerTest",
      "alfresco/layout/BasicLayoutTest",
      "alfresco/layout/ClassicWindowTest",
      "alfresco/layout/DynamicHorizontalLayoutTest",
      "alfresco/layout/DynamicWidgetsTest",
      "alfresco/layout/FixedHeaderFooterTest",
      "alfresco/layout/FullScreenWidgetsTest",
      "alfresco/layout/HeightMixinTest",
      "alfresco/layout/IFramedTabContainerTest",
      "alfresco/layout/StickyPanelTest",
      "alfresco/layout/StripedContentTest",
      "alfresco/layout/TwisterTest",
      "alfresco/layout/VerticalRevealTest",

      "alfresco/login/LoginFormTest",

      "alfresco/lists/AlfHashListTest",
      "alfresco/lists/AlfSortablePaginatedListTest",
      "alfresco/lists/FilteredListTest",
      "alfresco/lists/FilteredListUseCaseTest",
      "alfresco/lists/InfiniteScrollTest",
      "alfresco/lists/ListItemFocusTest",
      "alfresco/lists/LocalStorageFallbackTest",
      "alfresco/lists/PaginatorVisibilityTest",
      "alfresco/lists/SortControlsTest",
      "alfresco/lists/views/AddableViewTest",
      "alfresco/lists/views/AlfListViewTest",
      "alfresco/lists/views/AlfListViewCaptionTest",
      "alfresco/lists/views/ExpandableGalleryTest",
      "alfresco/lists/views/GalleryViewFocusTest",
      "alfresco/lists/views/GalleryViewInfiniteScrollTest",
      "alfresco/lists/views/HtmlListViewTest",
      "alfresco/lists/views/ViewNoDataWidgetsTest",
      "alfresco/lists/views/layouts/EditableRowTest",
      "alfresco/lists/views/layouts/RowModelProcessingTest",
      "alfresco/lists/views/layouts/RowTest",

      "alfresco/logging/DebugLogTest",

      "alfresco/logo/LogoTest",

      "alfresco/menus/AlfCheckableMenuItemTest",
      "alfresco/menus/AlfContextMenuTest",
      "alfresco/menus/AlfFormDialogMenuItemTest",
      "alfresco/menus/AlfMenuBarSelectItemsTest",
      "alfresco/menus/AlfMenuBarSelectTest",
      "alfresco/menus/AlfMenuBarToggleTest",
      "alfresco/menus/AlfMenuItemTest",
      "alfresco/menus/AlfMenuItemWrapperTest",
      "alfresco/menus/AlfMenuTextForClipboardTest",
      "alfresco/menus/AlfVerticalMenuBarTest",
      "alfresco/menus/DisableMenuItemTest",
      "alfresco/menus/MenuBarOrientationTest",
      "alfresco/menus/MenuTests",

      "alfresco/misc/AlfTooltipTest",
      "alfresco/misc/TableAndFormDialogTest",

      "alfresco/navigation/PathTreeTest",

      "alfresco/node/MetadataGroupsTest",

      "alfresco/preview/H264ProxyTest",
      "alfresco/preview/ImagePreviewTest",
      "alfresco/preview/PdfJsPreviewFaultsTest",
      "alfresco/preview/PdfJsPreviewTest",
      "alfresco/preview/PreviewerTests",

      "alfresco/prototyping/PreviewTest",

      "alfresco/renderers/ActionsTest",
      "alfresco/renderers/ActivitySummaryTest",
      "alfresco/renderers/AvatarThumbnailTest",
      "alfresco/renderers/BannerTest",
      "alfresco/renderers/BooleanTest",
      "alfresco/renderers/CategoryTest",
      "alfresco/renderers/CommentsListTest",
      "alfresco/renderers/DateLinkTest",
      "alfresco/renderers/DateTest",
      "alfresco/renderers/FileTypeTest",
      "alfresco/renderers/IndicatorsTest",
      "alfresco/renderers/InlineEditPropertyLinkTest",
      "alfresco/renderers/InlineEditPropertyTest",
      "alfresco/renderers/MultiFavouriteTest",
      "alfresco/renderers/ProgressTest",
      "alfresco/renderers/PropertyLinkTest",
      "alfresco/renderers/PropertyTest",
      "alfresco/renderers/PublishActionTest",
      "alfresco/renderers/PublishingDropDownMenuTest",
      "alfresco/renderers/PublishPayloadMixinOnActionsTest",
      "alfresco/renderers/ReorderTest",
      "alfresco/renderers/SearchResultPropertyLinkTest",
      "alfresco/renderers/SelectorTest",
      "alfresco/renderers/SocialRenderersTest",
      "alfresco/renderers/TagsTest",
      "alfresco/renderers/ThumbnailTest",
      "alfresco/renderers/ThumbnailAspectAndSizeTest",
      "alfresco/renderers/ToggleStateActionsTest",
      "alfresco/renderers/ToggleTest",
      "alfresco/renderers/UserTest",
      "alfresco/renderers/XhrActionsTest",

      "alfresco/renderers/actions/CopyToActionTest",
      "alfresco/renderers/actions/DeleteActionTest",
      "alfresco/renderers/actions/ManageAspectsActionTest",
      "alfresco/renderers/actions/MoveToActionTest",
      "alfresco/renderers/actions/UploadNewVersionActionTest",

      "alfresco/search/AlfSearchResultTest",
      "alfresco/search/CustomSearchResultTest",
      "alfresco/search/FacetFiltersTest",
      "alfresco/search/NoHashSearchingTest",
      "alfresco/search/SearchFilmStripViewTest",
      "alfresco/search/SearchSuggestionsTest",

      "alfresco/services/ActionServiceTest",
      "alfresco/services/CloudSyncServiceTest",
      "alfresco/services/ContentServiceTest",
      "alfresco/services/CrudServiceTest",
      "alfresco/services/DeleteSiteTest",
      "alfresco/services/DialogServiceTest",
      "alfresco/services/DocumentServiceTest",
      "alfresco/services/FileUploadServiceTest",
      "alfresco/services/FormsRuntimeServiceTest",
      "alfresco/services/FullScreenDialogTest",
      "alfresco/services/LoggingServiceTest",
      "alfresco/services/NavigationServiceTest",
      "alfresco/services/NodePreviewServiceTest",
      "alfresco/services/NotificationServiceTest",
      "alfresco/services/OptionsServiceTest",
      "alfresco/services/SearchServiceTest",
      "alfresco/services/ServiceFilteringTest",
      "alfresco/services/ServiceRegistryTest",

      "alfresco/services/SiteServiceTest",
      "alfresco/services/UserServiceTest",
      "alfresco/services/UserServiceListsTest",

      "alfresco/services/actions/ChangeTypeTest",
      "alfresco/services/actions/CopyMoveTest",
      "alfresco/services/actions/DownloadTest",
      "alfresco/services/actions/DownloadAsZipTest",
      "alfresco/services/actions/ManageAspectsTest",
      "alfresco/services/actions/NodeLocationTest",
      "alfresco/services/actions/WorkflowTest",

      "alfresco/upload/DndUploadTest",
      "alfresco/upload/UploadMonitorTest",
      "alfresco/upload/UploadTest",
      "alfresco/upload/UploadTargetTest",

      "alfresco/util/functionUtilsTest",
      "alfresco/util/hashUtilsTest",
      "alfresco/util/urlUtilsTest"
   ];

   // Pass back the tests
   return runAllTests ? allTests : someTests;
});
