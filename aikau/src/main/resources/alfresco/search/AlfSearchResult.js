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
 * This is used as the standard search result template used to control the layout of search results.
 * It is more efficient to use a single widget to control the layout than to build a complex model
 * control the layout than to build a complex model out of smaller widgets,
 * out of smaller widgets, however this widget can still be easily replaced by other widgets to
 * provide a completely custom rendering.
 *
 * @module alfresco/search/AlfSearchResult
 * @extends alfresco/lists/views/layouts/Row
 * @author Dave Draper
 * @author David Webster
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/layouts/Row",
        "dojo/text!./templates/AlfSearchResult.html",
        "alfresco/search/SearchThumbnail",
        "alfresco/search/SearchResultPropertyLink",
        "alfresco/renderers/PropertyLink",
        "alfresco/renderers/Property",
        "alfresco/renderers/DateLink",
        "alfresco/renderers/XhrActions",
        "dojo/_base/lang",
        "dojo/dom-class",
        "alfresco/renderers/XhrContextActions",
        "alfresco/renderers/Selector",
        "alfresco/renderers/Size",
        "alfresco/renderers/MoreInfo",
        "alfresco/enums/urlTypes"],
        function(declare, Row, template, SearchThumbnail, SearchResultPropertyLink, PropertyLink, Property,
                 DateLink, XhrActions, lang, domClass, XhrContextActions, Selector, Size, MoreInfo, urlTypes) {

   return declare([Row], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfSearchResult.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfSearchResult.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfSearchResult.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfSearchResult.css"}],

      /**
       * The HTML template to use for the widget.
       *
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * This allows additional action filters to be added (as opposed to defining a new array of 
       * action filters in the 
       * [documentAndFolderActions]{@link module:alfresco/search/AlfSearchResult#documentAndFolderActions}
       * attribute.) Any actions defined in this attribute will be added to the original filtered list.
       *
       * @instance
       * @type {string}
       * @default
       */
      additionalDocumentAndFolderActions: null,

      /**
       * This allows additional action filters to be added (as opposed to defining a new array of 
       * action filters in the 
       * [documentAndFolderActions]{@link module:alfresco/search/AlfSearchResult#otherNodeActions}
       * attribute.) Any actions defined in this attribute will be added to the original filtered list.
       *
       * @instance
       * @type {string}
       * @default
       */
      additionalOtherNodeActions: null,

      /**
       * The [customActions]{@link module:alfresco/renderers/_ActionsMixin#customActions} to apply to the
       * configuration of the enclosed [XhrActions]{@link module:alfresco/renderers/XhrActions} widget.
       *
       * @instance
       * @type {object[]}
       * @default
       * @since 1.0.38
       */
      customActions: null,

      /**
       * This can be configured to override the default filter for the actions that are applicable to 
       * folder and document nodes. Actions need to be filtered as Aikau does not currently support all
       * of the actions that can be configured in Alfresco Share. However, if custom actions are provided
       * by an extension or further filtering is required then they can be configured using this attribute.
       *
       * @instance
       * @type {string[]}
       * @default
       */
      documentAndFolderActions: null,

      /**
       * Indicates whether or not to enable the context menu to show the actions with a right-click.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      enableContextMenu: false,

      /**
       * The prefix string that indicates the start of text to highlight.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.92
       */
      highlightPrefix: "\u0000",

      /**
       * This is the property within the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#highlightProperty}
       * that should be used to identify the content with in the 
       * [renderedValue]{@link module:alfresco/renderers/Property#renderedValue} to highlight.
       * 
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.92
       */
      highlightPostfix: "\u0003",

      /**
       * This is the property within the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#highlightProperty}
       * that should be used to identify the content with.
       * 
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.87
       * @deprecated Since 1.0.92 - use [highlightPrefix]{@link module:alfresco/search/AlfSearchResult#highlightPrefix}
       * and [highlightPostfix]{@link module:alfresco/search/AlfSearchResult#highlightPostfix}
       */
      highlightProperty: null,

      /**
       * This is initialised to the [highlightProperty]{@link module:alfresco/search/AlfSearchResult#highlightProperty}
       * property within the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#highlightProperty} when the
       * [showSearchTermHighlights]{@link module:alfresco/search/AlfSearchResult#showSearchTermHighlights} is 
       * configured to be true.
       * 
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.87
       * @deprecated Since 1.0.92 - use [highlightPrefix]{@link module:alfresco/search/AlfSearchResult#highlightPrefix}
       * and [highlightPostfix]{@link module:alfresco/search/AlfSearchResult#highlightPostfix}
       */
      highlightValue: null,

      /**
       * Indicates whether or not the standard actions (e.g. those derived from Document Library XML configuration)
       * should be merged with any [customActions]{@link module:alfresco/renderers/_ActionsMixin#customActions} and
       * [widgetsForActions]{@link module:alfresco/renderers/_ActionsMixin#widgetsForActions}. This is applied to 
       * the configuration of the enclosed [XhrActions]{@link module:alfresco/renderers/XhrActions} widget.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.38
       */
      mergeActions: false,

      /**
       * The navigation target for links. By default this will result in links being opened in the current window/tab
       * but this can be configured to be "NEW" so that links are opened in a new window/tab.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.39
       */
      navigationTarget: "CURRENT",

      /**
       * Indicates whether or not a middle-button mouse click (or left click with the control key depressed)
       * on the link should result in links being opened in a new browser tab. If this is configured to be true 
       * then the a "target" attribute of "NEW" will be configured on the payload.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.50
       */
      newTabOnMiddleOrCtrlClick: true,

      /**
       * This can be configured to override the default filter for the actions that are applicable to 
       * all nodes that are neither folders nor documents. Actions need to be filtered as Aikau does not 
       * currently support all of the actions that can be configured in Alfresco Share. However, if custom 
       * actions are provided by an extension or further filtering is required then they can be configured 
       * using this attribute.
       *
       * @instance
       * @type {string[]}
       * @default
       */
      otherNodeActions: null,

      /**
       * The standard landing page for a site
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.38
       */
      siteLandingPage: "/dashboard",

      /**
       * Indicates whether or not a [MoreInfo]{@link module:alfresco/renderers/MoreInfo} widget should
       * be rendered with the search result.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      showMoreInfo: true,

      /**
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.87
       */
      showSearchTermHighlights: false,

      /**
       * Indicates whether or not a [Selector]{@link module:alfresco/renderers/Selector} widget should
       * be rendered with the search result.
       * @instance
       * @type {boolean}
       * @default 
       * @since 1.0.33
       */
      showSelector: false,

      /**
       * This can be configured to be an array of renderer widgets to place above the central column
       * of result properties. It should be a standard widget model array.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgetsAbove: null,

      /**
       * This can be configured to be an array of renderer widgets to place below the central column
       * of result properties. It should be a standard widget model array.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgetsBelow: null,

      /**
       * The [customActions]{@link module:alfresco/renderers/_ActionsMixin#widgetsForActions} to apply to the
       * configuration of the enclosed [XhrActions]{@link module:alfresco/renderers/XhrActions} widget.
       * 
       * @instance
       * @type {object[]}
       * @default
       * @since 1.0.38
       */
      widgetsForActions: null,

      /**
       * Creates the renderers to display for a search result and adds them into the template. Renderers
       * will only be created if there is data for them. This is done to further improve the performance
       * of the search rendering.
       *
       * @instance postCreate
       */
      postCreate: function alfresco_search_AlfSearchResult__postCreate() {
         if (this.showSearchTermHighlights && this.highlightProperty)
         {
            this.highlightValue = lang.getObject(this.highlightProperty, false, this.currentItem);
         }

         this.generateActionFilters();
         this.createSelectorRenderer();
         this.createThumbnailRenderer();
         this.createWidgetsAbove();
         this.createDisplayNameRenderer();
         this.createTitleRenderer();
         this.createMoreInfoRenderer();
         this.createDateRenderer();
         this.createDescriptionRenderer();
         this.createSiteRenderer();
         this.createPathRenderer();
         this.createSizeRenderer();
         this.createContentSnippet();
         this.createWidgetsBelow();
         this.createActionsRenderer();
         this.createContextActionsWidget();
      },

      /**
       * This function is called to create an [XhrActions widget]{@link module:alfresco/renderers/XhrActions}. 
       * It can be overridden to replace the default widget with a reconfigured version.
       * 
       * @instance
       */
      createActionsRenderer: function alfresco_search_AlfSearchResult__createActionsRenderer() {
         // jshint nonew:false
         new XhrActions({
            id: this.id + "_ACTIONS",
            onlyShowOnHover: true,
            currentItem: this.currentItem,
            pubSubScope: this.pubSubScope,
            customActions: this.customActions,
            filterActions: true,
            mergeActions: this.mergeActions,
            allowedActions: (this.currentItem.type === "document" || this.currentItem.type === "folder") ? this.documentAndFolderActions : this.otherNodeActions,
            widgetsForActions: this.widgetsForActions
         }, this.actionsNode);
      },

      /**
       * 
       * @instance
       * @since 1.0.92
       */
      createContentSnippet: function alfresco_search_AlfSearchResult__createContentSnippet() {
         if (this.showSearchTermHighlights)
         {
            var content = lang.getObject("highlighting.content", false, this.currentItem);
            if (content)
            {
               // jshint nonew:false
               new Property({
                  id: this.id + "_CONTENT_SNIPPET",
                  currentItem: this.currentItem,
                  pubSubScope: this.pubSubScope,
                  propertyToRender: "highlighting.content",
                  renderedValuePrefix: "\"",
                  renderedValueSuffix: "...\"",
                  highlightValue: this.highlightValue,
                  highlightPrefix: this.showSearchTermHighlights ? this.highlightPrefix : null,
                  highlightPostfix: this.showSearchTermHighlights ? this.highlightPostfix : null,
                  trimValue: true
               }, this.contentNode);
            }
         }

      },

      /**
       * This function is called to create an [XhrContextActions widget]{@link module:alfresco/renderers/XhrContextActions}. 
       * It can be overridden to replace the default widget with a reconfigured version. This function is only called when
       * [enableContextMenu]{@link module:alfresco/search/AlfSearchResult#enableContextMenu} is configured to be true.
       * 
       * @instance
       */
      createContextActionsWidget: function alfresco_search_AlfSearchResult__createContextActionsWidget() {
         if (this.enableContextMenu)
         {
            try
            {
               // jshint nonew:false
               new XhrContextActions({
                  targetNodeIds: [this.domNode],
                  currentItem: this.currentItem,
                  pubSubScope: this.pubSubScope,
                  filterActions: true,
                  allowedActions: (this.currentItem.type === "document" || this.currentItem.type === "folder") ? this.documentAndFolderActions : this.otherNodeActions
               });
            }
            catch (e)
            {
               this.alfLog("error", "An error occurred creating context menu", e);
            }
         }
      },

      /**
       * This function is called to create a [Property widget]{@link module:alfresco/renderers/Property}
       * to render the description of the result. It can be overridden to replace the default widget 
       * with a reconfigured version. 
       * 
       * @instance
       */
      createDescriptionRenderer: function alfresco_search_AlfSearchResult__createDescriptionRenderer() {
         // Render a description if available...
         if (this.currentItem.description === null || this.currentItem.description === "")
         {
            domClass.add(this.descriptionRow, "hidden");
         }
         else
         {
            // jshint nonew:false
            new Property({
               id: this.id + "_DESCRIPTION",
               currentItem: this.currentItem,
               pubSubScope: this.pubSubScope,
               propertyToRender: "description",
               renderSize: "small",
               highlightValue: this.highlightValue,
               highlightPrefix: this.showSearchTermHighlights ? this.highlightPrefix : null,
               highlightPostfix: this.showSearchTermHighlights ? this.highlightPostfix : null
            }, this.descriptionNode);
         }
      },

      /**
       * This function is called to create a [DateLink widget]{@link module:alfresco/renderers/DateLink}
       * to render the date that the result was created or last modified. It can be overridden to 
       * replace the default widget with a reconfigured version. 
       * 
       * @instance
       */
      createDateRenderer: function alfresco_search_AlfSearchResult__createDateRenderer() {
         // jshint nonew:false
         new DateLink({
            id: this.id + "_DATE",
            renderedValueClass: "alfresco-renderers-Property pointer",
            renderSize: "small",
            deemphasized: true,
            pubSubScope: this.pubSubScope,
            currentItem: this.currentItem,
            modifiedDateProperty: "modifiedOn",
            modifiedByProperty: "modifiedBy",
            publishTopic: "ALF_NAVIGATE_TO_PAGE",
            useCurrentItemAsPayload: false,
            publishPayloadType: "PROCESS",
            publishPayloadModifiers: ["processCurrentItemTokens"],
            publishPayload: {
               url: "user/{modifiedByUser}/profile",
               type: urlTypes.PAGE_RELATIVE,
               target: this.navigationTarget
            },
            newTabOnMiddleOrCtrlClick: this.newTabOnMiddleOrCtrlClick,
            defaultNavigationTarget: this.navigationTarget
         }, this.dateNode);
      },

      /**
       * This function is called to create a 
       * [SearchResultPropertyLink]{@link module:alfresco/renderers/SearchResultPropertyLink} widget
       * to render the displayName of the result. It can be overridden to replace the default widget 
       * with a reconfigured version. 
       * 
       * @instance
       */
      createDisplayNameRenderer: function alfresco_search_AlfSearchResult__createDisplayNameRenderer() {
         // jshint nonew:false
         var config = {
            id: this.id + "_DISPLAY_NAME",
            currentItem: this.currentItem,
            pubSubScope: this.pubSubScope,
            propertyToRender: "displayName",
            renderSize: "large",
            newTabOnMiddleOrCtrlClick: this.newTabOnMiddleOrCtrlClick,
            defaultNavigationTarget: this.navigationTarget,
            highlightValue: this.highlightValue,
            highlightPrefix: this.showSearchTermHighlights ? this.highlightPrefix : null,
            highlightPostfix: this.showSearchTermHighlights ? this.highlightPostfix : null
         };
         if (this.navigationTarget)
         {
            config.navigationTarget = this.navigationTarget;
         }
         new SearchResultPropertyLink(config, this.nameNode);
      },

      /**
       * This function is called to create a [MoreInfo widget]{@link module:alfresco/renderers/MoreInfo}
       * that can be used to retrieve the full metadata for the result and display it in a dialog. 
       * It can be overridden to replace the default widget with a reconfigured version. It will only
       * be rendered if [showMoreInfo]{@link module:alfresco/search/AlfSearchResult#showMoreInfo} is 
       * configured to be true.
       * 
       * @instance
       */
      createMoreInfoRenderer: function alfresco_search_AlfSearchResult__createMoreInfoRenderer() {
         if (this.showMoreInfo === true)
         {
            var moreInfoConfig = {
               id: this.id + "_MORE_INFO",
               currentItem: this.currentItem,
               pubSubScope: this.pubSubScope,
               xhrRequired: true,
               filterActions: true,
               darkIcon: true,
               highlightPrefix: this.showSearchTermHighlights ? this.highlightPrefix : null,
               highlightPostfix: this.showSearchTermHighlights ? this.highlightPostfix : null
            };
            if (this.currentItem.type === "document" || this.currentItem.type === "folder")
            {
               // Leave default actions...
            }
            else
            {
               // Replace with just the delete action...
               moreInfoConfig.allowedActionsString = "[\"document-delete\"]";
            }
            // jshint nonew:false
            new MoreInfo(moreInfoConfig, this.moreInfoNode);
         }
      },

      /**
       * This function is called to create a [PropertyLink widget]{@link module:alfresco/renderers/PropertyLink}
       * to render the path to the result. It can be overridden to replace the default widget with a reconfigured 
       * version. 
       * 
       * @instance
       */
      createPathRenderer: function alfresco_search_AlfSearchResult__createPathRenderer() {
         if (!this.currentItem.path)
         {
            domClass.add(this.pathRow, "hidden");
         }
         else
         {
            if (this.currentItem.path[0] !== "/")
            {
               this.currentItem.path = "/" + this.currentItem.path;
            }

            // Create processed path as pathLink on this.currentItem
            var isRepo = !lang.exists("site.title", this.currentItem);
            this.currentItem.pathLink = isRepo ?
               encodeURIComponent("/" + this.currentItem.path.split("/").slice(2).join("/")) :
               encodeURIComponent(this.currentItem.path);

            // jshint nonew:false
            new PropertyLink({
               id: this.id + "_PATH",
               renderedValueClass: "alfresco-renderers-Property pointer",
               pubSubScope : this.pubSubScope,
               currentItem : this.currentItem,
               propertyToRender : "path",
               renderSize: "small",
               label : this.message("faceted-search.doc-lib.value-prefix.path"),
               publishTopic: "ALF_NAVIGATE_TO_PAGE",
               useCurrentItemAsPayload: false,
               publishPayloadType: "PROCESS",
               publishPayloadModifiers: ["processCurrentItemTokens"],
               publishPayload: {
                  url: isRepo ? "repository?path={pathLink}" : "site/{site.shortName}/documentlibrary?path={pathLink}",
                  type: urlTypes.PAGE_RELATIVE,
                  target: this.navigationTarget
               },
               newTabOnMiddleOrCtrlClick: this.newTabOnMiddleOrCtrlClick,
               defaultNavigationTarget: this.navigationTarget,
               highlightValue: this.highlightValue,
               highlightPrefix: this.showSearchTermHighlights ? this.highlightPrefix : null,
               highlightPostfix: this.showSearchTermHighlights ? this.highlightPostfix : null
            }, this.pathNode);
         }
      },

      /**
       * This function is called to create a [Selector widget]{@link module:alfresco/renderers/Selector}.
       * It will only be rendered if [showSelector]{@link module:alfresco/search/AlfSearchResult#showSelector} is 
       * configured to be true.
       * 
       * @instance
       * @since 1.0.33
       */
      createSelectorRenderer: function alfresco_search_AlfSearchResult__createSelectorRenderer() {
         // We only show the size if it's not empty and at least one byte
         if (!this.showSelector)
         {
            domClass.add(this.selectorCell, "hidden");
         }
         else
         {
            // jshint nonew:false
            new Selector({
               id: this.id + "_SELECTOR",
               currentItem : this.currentItem,
               pubSubScope : this.pubSubScope
            }, this.selectorNode);
         }
      },

      /**
       * This function is called to create a [PropertyLink widget]{@link module:alfresco/renderers/PropertyLink}
       * to render the name of the site in which the result can be found (if applicable). It can be overridden to 
       * replace the default widget with a reconfigured version. 
       * 
       * @instance
       */
      createSiteRenderer: function alfresco_search_AlfSearchResult__createSiteRenderer() {
         // Check to see if the result exists within a site and create a renderer to display the site
         // title if appropriate...
         var site = lang.getObject("site.title", false, this.currentItem);
         if (!site)
         {
            domClass.add(this.siteNode, "hidden");
            domClass.add(this.siteSeparatorNode, "hidden");
         }
         else
         {
            // jshint nonew:false
            new PropertyLink({
               id: this.id + "_SITE",
               renderedValueClass: "alfresco-renderers-Property pointer alfresco-search-AlfSearchResult__site",
               deemphasized: true,
               renderSize: "small",
               pubSubScope: this.pubSubScope,
               currentItem: this.currentItem,
               propertyToRender: "site.title",
               label: this.message("faceted-search.doc-lib.value-prefix.site"),
               publishTopic: "ALF_NAVIGATE_TO_PAGE",
               publishGlobal: true,
               useCurrentItemAsPayload: false,
               publishPayloadType: "PROCESS",
               publishPayloadModifiers: ["processCurrentItemTokens"],
               publishPayload: {
                  url: "site/{site.shortName}" + this.siteLandingPage.replace(/^\/*/, "/"),
                  type: urlTypes.PAGE_RELATIVE,
                  target: this.navigationTarget
               },
               newTabOnMiddleOrCtrlClick: this.newTabOnMiddleOrCtrlClick,
               defaultNavigationTarget: this.navigationTarget,
               highlightValue: this.highlightValue,
               highlightPrefix: this.showSearchTermHighlights ? this.highlightPrefix : null,
               highlightPostfix: this.showSearchTermHighlights ? this.highlightPostfix : null
            }, this.siteNode);
         }
      },

      /**
       * This function is called to create a [Size widget]{@link module:alfresco/renderers/Size}. 
       * It can be overridden to replace the default widget with a reconfigured version. 
       * 
       * @instance
       */
      createSizeRenderer: function alfresco_search_AlfSearchResult__createSizeRenderer() {
         // We only show the size if it's not empty and at least one byte
         if (!this.currentItem.size || this.currentItem.size < 0)
         {
            domClass.add(this.sizeNode, "hidden");
            domClass.add(this.sizeSeparatorNode, "hidden");
         }
         else
         {
            // jshint nonew:false
            new Size({
               id: this.id + "_SIZE",
               currentItem : this.currentItem,
               pubSubScope : this.pubSubScope,
               label : this.message("faceted-search.doc-lib.value-prefix.size"),
               deemphasized: true,
               renderSize: "small",
               sizeProperty : "size"
            }, this.sizeNode);
         }
      },

      /**
       * This function is called to create a [SearchThumbnail widget]{@link module:alfresco/renderers/SearchThumbnail}. 
       * It can be overridden to replace the default widget with a reconfigured version. 
       * 
       * @instance
       */
      createThumbnailRenderer: function alfresco_search_AlfSearchResult__createThumbnailRenderer() {
         // jshint nonew:false
         var config = {
            id: this.id + "_THUMBNAIL",
            currentItem: this.currentItem,
            pubSubScope: this.pubSubScope,
            showDocumentPreview: true,
            newTabOnMiddleOrCtrlClick: this.newTabOnMiddleOrCtrlClick,
            defaultNavigationTarget: this.navigationTarget,
            highlightPrefix: this.showSearchTermHighlights ? this.highlightPrefix : null,
            highlightPostfix: this.showSearchTermHighlights ? this.highlightPostfix : null
         };
         if (this.navigationTarget)
         {
            config.navigationTarget = this.navigationTarget;
         }
         new SearchThumbnail(config, this.thumbnailNode);
      },

      /**
       * Creates any additional widgets defined through configuration directly above the main column
       * of result properties.
       *
       * @instance
       */
      createWidgetsAbove: function alfresco_search_AlfSearchResult__createWidgetsAbove() {
         if (this.widgetsAbove)
         {
            this.processWidgets(this.widgetsAbove, this.aboveNode);
         }
         else
         {
            domClass.add(this.aboveNode, "hidden");
         }
      },

      /**
       * Creates any additional widgets defined through configuration directly above the main column
       * of result properties.
       *
       * @instance
       */
      createWidgetsBelow: function alfresco_search_AlfSearchResult__createWidgetsBelow() {
         if (this.widgetsBelow)
         {
            this.processWidgets(this.widgetsBelow, this.belowNode);
         }
         else
         {
            domClass.add(this.belowNode, "hidden");
         }
      },

      /**
       * This function is called to create a [Property widget]{@link module:alfresco/renderers/Property}
       * to render the title of the result (if it has one). It can be overridden to replace the default 
       * widget with a reconfigured version. 
       * 
       * @instance
       */
      createTitleRenderer: function alfresco_search_AlfSearchResult__createTitleRenderer() {
         // jshint nonew:false
         if (!this.currentItem.title)
         {
            domClass.add(this.titleNode, "hidden");
         }
         else
         {
            new Property({
               id: this.id + "_TITLE",
               currentItem: this.currentItem,
               pubSubScope: this.pubSubScope,
               propertyToRender: "title",
               renderSize: "small",
               renderedValuePrefix: "(",
               renderedValueSuffix: ")",
               highlightValue: this.highlightValue,
               highlightPrefix: this.showSearchTermHighlights ? this.highlightPrefix : null,
               highlightPostfix: this.showSearchTermHighlights ? this.highlightPostfix : null
            }, this.titleNode);
         }
      },

      /**
       * This function is used to generate the action filters that are used for filtering the actions to
       * show for documents and folders and for any other type of node.
       * 
       * @instance
       */
      generateActionFilters: function alfresco_search_AlfSearchResult__generateActionFilters() {
         // Define the filter for document and folder actions, this filter is initially
         // based on what actions are currently supported by the Aikau action service
         // rather than the actions that the user has permission to carry out on the node.
         if (!this.documentAndFolderActions)
         {
            this.documentAndFolderActions = [
               "document-download",
               "document-view-content",
               "document-view-details",
               "folder-view-details",
               "document-edit-metadata",
               "document-inline-edit",
               "document-manage-granular-permissions",
               "document-manage-repo-permissions",
               "document-view-original",
               "document-view-working-copy",
               "folder-manage-rules",
               "document-view-googlemaps",
               "document-view-in-source-repository",
               "document-view-in-cloud",
               "document-delete",
               "document-edit-offline",
               "folder-download",
               "document-copy-to",
               "document-move-to",
               "document-locate",
               "document-assign-workflow",
               "document-cancel-editing",
               "document-approve",
               "document-reject",
               "document-manage-aspects"
   //            TODO: Needs to use forms runtime or equiv.
   //            "document-edit-properties",
   //
   //            TODO: Not implemented yet.
   //            "document-upload-new-version",
   //            "folder-view-details"
   //            
   //            "document-cloud-sync"
   //            "document-cloud-unsync"
   //            "document-view-in-cloud"
   //            "document-request-sync"
   //            "document-edit-online"
   //            "document-checkout-to-googledocs"
   //            "document-checkin-from-googledocs"
   //            "document-assign-workflow"
   //            "document-cancel-editing-unlock"
            ];
         }

         // Append any additional actions for documents and folders...
         if (this.additionalDocumentAndFolderActions)
         {
            this.documentAndFolderActions = this.documentAndFolderActions.concat(this.additionalDocumentAndFolderActions);
         }

         // For actions other than folders and documents we want to further restrict what are displayed
         // at the moment this is restricted purely to deletion.
         if (!this.otherNodeActions)
         {
            this.otherNodeActions = [
               "document-delete"
            ];
         }

         // Append any additional actions for other types of node...
         if (this.additionalOtherNodeActions)
         {
            this.otherNodeActions = this.otherNodeActions.concat(this.additionalOtherNodeActions);
         }
      }
   });
});