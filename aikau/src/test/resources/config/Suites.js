/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
 */
define({

   /**
    * This is the base array of non-functional test suites
    *
    * @instance
    * @type [string]
    */
   // Uncomment and add specific tests as necessary during development!
   // baseFunctionalSuites: ['src/test/resources/alfresco/layout/AlfSideBarContainerTest'],

   /**
    * This is the base array of functional test suites
    *
    * @instance
    * @type [string]
    */
   baseFunctionalSuites: [
      'src/test/resources/alfresco/accessibility/AccessibilityMenuTest',
      'src/test/resources/alfresco/accessibility/SemanticWrapperMixinTest',

      'src/test/resources/alfresco/charts/ccc/PieChartTest',

      'src/test/resources/alfresco/core/CoreRwdTest',
      'src/test/resources/alfresco/core/PublishPayloadMixinTest',
      'src/test/resources/alfresco/core/RenderFilterTest',
      'src/test/resources/alfresco/core/TemporalUtilsTest',
      'src/test/resources/alfresco/core/VisibilityConfigTest',
      'src/test/resources/alfresco/core/WidgetCreationTest',

      'src/test/resources/alfresco/creation/WidgetConfigTest',

      'src/test/resources/alfresco/documentlibrary/BreadcrumbTrailTest',
      'src/test/resources/alfresco/documentlibrary/CreateContentTest',
      'src/test/resources/alfresco/documentlibrary/DocumentListTest',
      'src/test/resources/alfresco/documentlibrary/DocumentSelectorTest',
      'src/test/resources/alfresco/documentlibrary/PaginationTest',
      'src/test/resources/alfresco/documentlibrary/SearchListTest',
      'src/test/resources/alfresco/documentlibrary/SearchListScrollTest',
      'src/test/resources/alfresco/documentlibrary/SelectedItemsMenuTest',
      'src/test/resources/alfresco/documentlibrary/SitesListTest',
      'src/test/resources/alfresco/documentlibrary/views/AlfDocumentListWithHeaderTest',
      'src/test/resources/alfresco/documentlibrary/views/FilmStripViewTest',
      'src/test/resources/alfresco/documentlibrary/views/GalleryViewTest',

      'src/test/resources/alfresco/footer/FooterTest',

      'src/test/resources/alfresco/forms/CrudFormTest',
      'src/test/resources/alfresco/forms/DynamicFormTest',
      'src/test/resources/alfresco/forms/FormsTest',
      'src/test/resources/alfresco/forms/SingleTextFieldFormTest',
      'src/test/resources/alfresco/forms/controls/AutoSetTest',
      'src/test/resources/alfresco/forms/controls/BaseFormTest',
      'src/test/resources/alfresco/forms/controls/ComboBoxTest',
      'src/test/resources/alfresco/forms/controls/DocumentPickerTest',
      'src/test/resources/alfresco/forms/controls/DateTextBoxTest',  // TODO: NEEDS FIXING
      'src/test/resources/alfresco/forms/controls/FormButtonDialogTest',
      'src/test/resources/alfresco/forms/controls/MultipleEntryFormControlTest',
      'src/test/resources/alfresco/forms/controls/SelectTest',
      'src/test/resources/alfresco/forms/controls/TextBoxTest',
      'src/test/resources/alfresco/forms/controls/ValidationTest', 

      'src/test/resources/alfresco/header/HeaderWidgetsTest',
      'src/test/resources/alfresco/header/WarningTest',

      'src/test/resources/alfresco/html/LabelTest',

      'src/test/resources/alfresco/layout/AlfSideBarContainerTest',
      'src/test/resources/alfresco/layout/AlfTabContainerTest',
      'src/test/resources/alfresco/layout/BasicLayoutTest',
      'src/test/resources/alfresco/layout/FullScreenWidgetsTest',
      'src/test/resources/alfresco/layout/TwisterTest',

      'src/test/resources/alfresco/menus/AlfCheckableMenuItemTest',
      'src/test/resources/alfresco/menus/AlfContextMenuTest',
      'src/test/resources/alfresco/menus/AlfFormDialogMenuItemTest',
      'src/test/resources/alfresco/menus/AlfMenuBarSelectItemsTest',
      'src/test/resources/alfresco/menus/AlfMenuBarSelectTest',
      'src/test/resources/alfresco/menus/AlfMenuBarToggleTest',
      'src/test/resources/alfresco/menus/AlfMenuItemWrapperTest',
      'src/test/resources/alfresco/menus/AlfMenuTextForClipboardTest',
      'src/test/resources/alfresco/menus/AlfVerticalMenuBarTest',
      'src/test/resources/alfresco/menus/DisableMenuItemTest',
      'src/test/resources/alfresco/menus/MenuTests',

      // 'src/test/resources/alfresco/misc/AlfTooltipTest', - COMMENTED OUT - THE TOOLTIP ITSELF NEEDS REWRITING
      'src/test/resources/alfresco/misc/TableAndFormDialogTest',

      'src/test/resources/alfresco/preview/ImagePreviewTest',
      'src/test/resources/alfresco/preview/PreviewerTests',
      'src/test/resources/alfresco/preview/PdfJsPreviewFaultsTest',
      'src/test/resources/alfresco/preview/PdfJsPreviewTest',

      'src/test/resources/alfresco/renderers/BannerTest',
      'src/test/resources/alfresco/renderers/BooleanTest',
      'src/test/resources/alfresco/renderers/CategoryTest',
      'src/test/resources/alfresco/renderers/DateTest',
      'src/test/resources/alfresco/renderers/DateLinkTest',
      'src/test/resources/alfresco/renderers/FileTypeTest',
      'src/test/resources/alfresco/renderers/IndicatorsTest',
      'src/test/resources/alfresco/renderers/InlineEditPropertyTest',
      'src/test/resources/alfresco/renderers/ProgressTest',
      'src/test/resources/alfresco/renderers/PropertyTest',
      'src/test/resources/alfresco/renderers/PropertyLinkTest',
      'src/test/resources/alfresco/renderers/PublishingDropDownMenuTest',
      'src/test/resources/alfresco/renderers/PublishPayloadMixinOnActionsTest',
      'src/test/resources/alfresco/renderers/ReorderTest',
      'src/test/resources/alfresco/renderers/SearchResultPropertyLinkTest',
      'src/test/resources/alfresco/renderers/SocialRenderersTest',
      'src/test/resources/alfresco/renderers/TagsTest',
      'src/test/resources/alfresco/renderers/ThumbnailTest',
      'src/test/resources/alfresco/renderers/XhrActionsTest',

      'src/test/resources/alfresco/services/SearchServiceTest',
      'src/test/resources/alfresco/services/SiteServiceTest',
      'src/test/resources/alfresco/services/UserServiceTest',

      'src/test/resources/alfresco/search/AlfSearchResultTest',
      'src/test/resources/alfresco/search/FacetFiltersTest',
      'src/test/resources/alfresco/search/SearchSuggestionsTest',

      'src/test/resources/alfresco/upload/UploadTest'
   ],

   /**
    * This is the array of functional test suites that should only be applied to local tests
    *
    * @instance
    * @type [string]
    */
   localOnlyFunctionalSuites: ['src/test/resources/alfresco/CodeCoverageBalancer'],

   /**
    * This is the full array of functional test suites for local tests
    *
    * @instance
    * @type [string]
    */
   localFunctionalSuites: function localFunctionalSuites(){
      return this.setupFunctionalSuites.concat(
         this.baseFunctionalSuites.concat(
            this.localOnlyFunctionalSuites.concat(
               this.teardownFunctionalSuites
            )
         )
      );
   },

   /**
    * This is the array of functional test suites that should only be applied to virtual machine tests
    *
    * @instance
    * @type [string]
    */
   vmOnlyFunctionalSuites: ['src/test/resources/alfresco/CodeCoverageBalancer'],

   /**
    * This is the full array of functional test suites for virtual machine tests
    *
    * @instance
    * @type [string]
    */
   vmFunctionalSuites: function vmFunctionalSuites(){
      return this.setupFunctionalSuites.concat(
         this.baseFunctionalSuites.concat(
            this.vmOnlyFunctionalSuites.concat(
               this.teardownFunctionalSuites
            )
         )
      );
   },

   /**
    * This is the array of functional test suites that should only be applied to sauce labs tests
    *
    * @instance
    * @type [string]
    */
   slOnlyFunctionalSuites: [],

   /**
    * This is the full array of functional test suites for sauce labs tests
    *
    * @instance
    * @type [string]
    */
   slFunctionalSuites: function slFunctionalSuites(){
      return this.setupFunctionalSuites.concat(
         this.baseFunctionalSuites.concat(
            this.slOnlyFunctionalSuites.concat(
               this.teardownFunctionalSuites
            )
         )
      );
   },

   /**
    * This is the array of functional test suites that should only be applied to selenium grid tests
    *
    * @instance
    * @type [string]
    */
   gridOnlyFunctionalSuites: [],

   /**
    * This is the full array of functional test suites for selenium grid tests
    *
    * @instance
    * @type [string]
    */
   gridFunctionalSuites: function gridFunctionalSuites(){
      return this.setupFunctionalSuites.concat(
         this.baseFunctionalSuites.concat(
            this.gridOnlyFunctionalSuites.concat(
               this.teardownFunctionalSuites
            )
         )
      );
   },

   /**
    * This is the array of functional test suites for setup purposes
    *
    * @instance
    * @type [string]
    */
   setupFunctionalSuites: [],//['src/test/resources/alfresco/DebugEnable'],

   /**
    * This is the array of functional test suites for teardown purposes
    *
    * @instance
    * @type [string]
    */
   teardownFunctionalSuites: []//['src/test/resources/alfresco/DebugDisable']

});