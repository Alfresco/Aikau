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
 * <p>This widget provides multiple ways in which search requests can be made. As well as supporting the basic ability
 * to allow the user to enter a search term and hit the return key to go to a 
 * [configurable search results page]{@link module:alfresco/header/SearchBox#searchResultsPage} it also supports the ability
 * to immediately show search results for documents, sites and users as characters are entered. These "live search" results
 * can be [completely disabled]{@link module:alfresco/header/SearchBox#liveSearch} or individually disabled for any combination
 * of [documents]{@link module:alfresco/header/SearchBox#showDocumentResults}, [sites]{@link module:alfresco/header/SearchBox#showSiteResults}
 * and [users]{@link module:alfresco/header/SearchBox#showPeopleResults}.</p>
 * <p>It's possible to override [placeholder]{@link module:alfresco/header/SearchBox#placeholder} text as well as the 
 * live search result titles for [documents]{@link module:alfresco/header/SearchBox#documentsTitle}, 
 * [sites]{@link module:alfresco/header/SearchBox#sitesTitle} and [users]{@link module:alfresco/header/SearchBox#peopleTitle}. Links 
 * for individual results can also be configured and it is also possible to include
 * [hidden search terms]{@link module:alfresco/header/SearchBox#hiddenSearchTerms} in the search queries to tailor the
 * results.</p>
 * 
 * @module alfresco/header/SearchBox
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @author Dave Draper
 * @author Kevin Roast
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "alfresco/core/TemporalUtils",
        "alfresco/core/FileSizeMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "dojo/text!./templates/SearchBox.html",
        "dojo/text!./templates/LiveSearch.html",
        "dojo/text!./templates/LiveSearchItem.html",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "alfresco/enums/urlTypes",
        "alfresco/header/AlfMenuBar",
        "alfresco/util/urlUtils",
        "service/constants/Default",
        "dojo/json",
        "dojo/dom-attr",
        "dojo/dom-style",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/date/stamp",
        "dojo/on"], 
        function(declare, lang, array, _Widget, _Templated, TemporalUtils, FileSizeMixin, _PublishPayloadMixin,
                 SearchBoxTemplate, LiveSearchTemplate, LiveSearchItemTemplate, AlfCore, CoreXhr, urlTypes, AlfMenuBar, 
                 urlUtils, AlfConstants, JSON, domAttr, domStyle, domClass, domConstruct, Stamp, on) {

   /**
    * LiveSearch widget
    */
   var LiveSearch = declare([_Widget, _Templated, AlfCore], {
      
      /**
       * The scope to use for i18n messages.
       * 
       * @instance
       * @type {string}
       */
      i18nScope: "org.alfresco.SearchBox",
      
      /**
       * @instance
       * @type {object}
       * @default
       */
      searchBox: null,
      
      /**
       * DOM element container for Documents
       * 
       * @instance
       * @type {object}
       */
      containerNodeDocs: null,
      
      /**
       * DOM element container for Sites
       * 
       * @instance
       * @type {object}
       */
      containerNodeSites: null,
      
      /**
       * DOM element container for People
       * 
       * @instance
       * @type {object}
       */
      containerNodePeople: null,
      
      /**
       * An optional height that can be configured for the live search results. Without this being set 
       * the available space will be used (and may cause the page to grow). When a height is set it will 
       * prevent the results box growing beyond that size and will add scrollbars to alllow access to all 
       * the results.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.76
       */
      height: null,

      /**
       * @instance
       * @type {string}
       * @default
       */
      label: null,
      
      /**
       * @instance
       * @type {string}
       */
      templateString: LiveSearchTemplate,
      
      /**
       * @instance
       */
      postMixInProperties: function alfresco_header_LiveSearch__postMixInProperties() {
         // construct our I18N labels ready for template
         this.label = {};
         this.label.documents = this.message(this.searchBox.documentsTitle);
         this.label.sites = this.message(this.searchBox.sitesTitle);
         this.label.people = this.message(this.searchBox.peopleTitle);
         this.label.more = this.message(this.searchBox.moreTitle);
         this.label.contextRespository = this.message(this.searchBox.contextRepositoryLabel);
         var site = this.searchBox.siteName ? this.searchBox.siteName : this.searchBox.site;
         this.label.contextSite = this.message(this.searchBox.contextSiteLabel, site);
         this.label.repositoryTooltip = this.message(this.searchBox.repositoryTitle);
         this.label.siteTooltip = this.message(this.searchBox.siteTitle);
      },

      /**
       * 
       * @instance
       * @default 1.0.76
       */
      postCreate: function alfresco_header_LiveSearch__postCreate() {
         var site = this.searchBox.site;
         if (this.searchBox.enableContextLiveSearch === false || !site) {
            domStyle.set(this.contextNode, "display", "none"); 
         }
         
         if (this.height) {
            domStyle.set(this.domNode, {
               maxHeight: this.height,
               overflowX: "hidden",
               overflowY: "auto"
            });
         }
      },
      
      /**
       * @instance
       */
      onSearchDocsMoreClick: function alfresco_header_LiveSearch__onSearchDocsMoreClick(evt) {
         this.searchBox.liveSearchDocuments(this.searchBox.lastSearchText, this.searchBox.resultsCounts.docs);
         evt.preventDefault();
      }
   });
   
   /**
    * LiveSearchItem widget
    */
   var LiveSearchItem = declare([_Widget, _Templated, AlfCore, _PublishPayloadMixin], {

      /**
       * @instance
       * @type {object}
       */
      searchBox: null,
      
      /**
       * @instance
       * @type {string}
       */
      templateString: LiveSearchItemTemplate,

      /**
       * Run after widget created
       *
       * @instance
       * @override
       * @since 1.0.47
       */
      postCreate: function alfresco_header_LiveSearchItem__postCreate() {
         this.inherited(arguments);

         // Do safe insertion of user data
         this.linkNode.appendChild(document.createTextNode(this.label));
         this.linkNode.setAttribute("title", this.title);
         this.previewImgNode.setAttribute("alt", this.alt);
         this.previewLinkNode.setAttribute("title", this.label);
      },
      
      /**
       * Handle storing of a "last" user search in local storage list
       *
       * @instance
       * @param {object} evt The click event
       */
      onResultClick: function alfresco_header_LiveSearchItem__onResultClick(evt) {
         this.searchBox.onSaveLastUserSearch();

         if (this.publishTopic)
         {
            var payload = this.getGeneratedPayload(true);
            this.alfPublish(this.publishTopic, payload, this.publishGlobal, this.publishToParent);
         }
         else
         {
            this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
               type: "FULL_PATH",
               url: this.link
            });
         }
         
         evt && evt.preventDefault();
         evt && evt.stopPropagation();
      },

      /**
       * Handles any clicks on the meta information containing in the link (e.g. links
       * to specific sites that documents are found in).
       *
       * @instance
       * @param {object} evt The click event
       */
      onMetaClick: function alfresco_header_LiveSearchItem__onMetaClick(evt) {
         if (evt.target && evt.target.href)
         {
            if (this.publishTopic)
            {
               var payload = this.getGeneratedPayload(true);
               this.alfPublish(this.publishTopic, payload, this.publishGlobal, this.publishToParent);
            }
            else
            {
               this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
                  type: "FULL_PATH",
                  url: evt.target.href
               });
            }
         }

         evt.preventDefault();
         evt.stopPropagation();
      }
   });

   /**
    * alfresco/header/SearchBox widget
    */ 
   return declare([_Widget, _Templated, CoreXhr, TemporalUtils, FileSizeMixin], {

      /**
       * The scope to use for i18n messages.
       * 
       * @instance
       * @type {string}
       */
      i18nScope: "org.alfresco.SearchBox",

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/SearchBox.css"}]
       */
      cssRequirements: [{cssFile: "./css/SearchBox.css"}],

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/SearchBox.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/SearchBox.properties"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: SearchBoxTemplate,

      /**
       * @instance
       * @type {object}
       * @default
       */
      _LiveSearch: null,
      
      /**
       * @instance
       * @type {number}
       * @default
       */
      _keyRepeatWait: 250,
      
      /**
       * @instance
       * @type {number}
       * @default
       */
      _lastSearchIndex: 0,
      
      /**
       * @instance
       * @type {number}
       * @default
       */
      _minimumSearchLength: 2,
      
      /**
       * @instance
       * @type {object}
       * @default
       */
      _requests: null,
      
      /**
       * @instance
       * @type {number}
       * @default
       */
      _resultPageSize: 5,
      
      /**
       * @instance
       * @type {object}
       * @default
       */
      _searchMenu: null,

      /**
       * The text to use for the accessibility instruction on the input field.
       *
       * @instance
       * @type {string}
       * @default
       */
      accessibilityInstruction: "search.label",

      /**
       * @instance
       * @type {boolean}
       * @default
       */
      advancedSearch: true,
      
      /**
       * This indicates whether or not the live search popup should be aligned to the
       * right or left of the search box. It defaults to true as this is the expected
       * location of the search box in Alfresco Share.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      alignment: "right",

      /**
       * @instance
       * @type {boolean}
       * @default
       */
      allsites: false,
      
      /**
       * This is the page to navigate to for blog post links. It defaults to 
       * "blog-postview" (as this is the standard blog post page in 
       * Alfresco Share) but it can be configured to go to a custom page.
       *
       * @instance
       * @type {string}
       * @default
       */
      blogPage: "blog-postview",

      /**
       * The label to display for selection of searching in Repository context in the live search results panel.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.78
       */
      contextRepositoryLabel: "search.in-repository",

      /**
       * The label to display for selection of searching in Site context in the live search results panel.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.78
       */
      contextSiteLabel: "search.in-site",

      /**
       * The default scope to use when requesting a search.
       *
       * @instance
       * @type {string}
       * @default
       */
      defaultSearchScope: "repo",

      /**
       * This is the page to navigate to for document container links. It defaults
       * to the "documentlibrary" (as this is the standard document library page in
       * Alfresco Share) but it can be configured to go to a custom page.
       *
       * @instance
       * @type {string}
       * @default
       */
      documentLibraryPage: "documentlibrary",

      /**
       * This is the page to navigate to for document links. It defaults to 
       * "document-details" (as this is the standard document details page in 
       * Alfresco Share) but it can be configured to go to a custom page.
       *
       * @instance
       * @type {string}
       * @default
       */
      documentPage: "document-details",

      /**
       * The title to use as above document results in the live search results panel.
       * 
       * @instance
       * @type {string}
       * @default
       */
      documentsTitle: "search.documents",

      /**
       * Eanble the context switching feature of live search.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.78
       */
      enableContextLiveSearch: false,

      /**
       * An optional height that can be configured for the live search results. Without this being set 
       * the available space will be used (and may cause the page to grow). When a height is set it will 
       * prevent the results box growing beyond that size and will add scrollbars to alllow access to all 
       * the results.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.76
       */
      liveSearchHeight: null,

      /**
       * Some additional search terms to include in search requests that will not be displayed to the
       * user. Setting this can tailor the results that are shown in both the search results page and
       * the live search results.
       *
       * @instance
       * @type {string}
       * @default
       */
      hiddenSearchTerms: "",

      /**
       * @instance
       * @type {string}
       * @default
       */
      lastSearchText: null,
      
      /**
       * This indicated whether or not the search box should link to the faceted search page or not. It is used by the
       * [generateSearchPageLink fuction]{@link module:alfresco/header/SearchBox#generateSearchPageLink} to determine
       * the URL to generate for displaying search results. By default it will be the faceted search page.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      linkToFacetedSearch: true,

      /**
       * @instance
       * @type {boolean}
       * @default
       */
      liveSearch: true,
      
      /**
       * The URI to use performing the live search for documents. If the default is re-configured then REST API
       * to be used is expected to be able to handle the request parameter of "t" for the search term,
       * "maxResults" for the page size and "startIndex" for the first result in the page. The REST API is expected
       * to be a Repository based WebScript supporting the GET method.
       *
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.37
       */
      liveSearchDocumentsUri: "slingshot/live-search-docs",

      /**
       * The URI to use performing the live search for people. If the default is re-configured then REST API
       * to be used is expected to be able to handle the request parameter of "t" for the search term,
       * "maxResults" for the page size and "startIndex" for the first result in the page. The REST API is expected
       * to be a Repository based WebScript supporting the GET method.
       *
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.37
       */
      liveSearchPeopleUri: "slingshot/live-search-people",

      /**
       * The URI to use performing the live search for sites. If the default is re-configured then REST API
       * to be used is expected to be able to handle the request parameter of "t" for the search term,
       * "maxResults" for the page size and "startIndex" for the first result in the page. The REST API is expected
       * to be a Repository based WebScript supporting the GET method.
       *
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.37
       */
      liveSearchSitesUri: "slingshot/live-search-sites",

      /**
       * The title to use on the button for retrieving more document results.
       * 
       * @instance
       * @type {string}
       * @default
       */
      moreTitle: "search.more",

      /**
       * This is the page to navigate to for user links. It defaults to 
       * "profile" (as this is the standard profile page in 
       * Alfresco Share) but it can be configured to go to a custom page. The page
       * will be prefixed with the standard user URI token mapping (e.g. user/<user-id>/)
       *
       * @instance
       * @type {string}
       * @default
       */
      peoplePage: "profile",

      /**
       * The title to use as above people results in the live search results panel.
       * 
       * @instance
       * @type {string}
       * @default
       */
      peopleTitle: "search.people",

      /**
       * The placeholder text to set in the main input field.
       *
       * @instance
       * @type {string}
       * @default
       */
      placeholder: "search.instruction",

      /**
       * This is an optional topic to publish on when a results is clicked. Configuring a publishTopic
       * means that clicking on any results (e.g. wiki, blog, document, site, person, etc) will result
       * in that topic being published. The [payload]{@link module:alfresco/header/SearchBox#publishPayload}
       * can be configured using a combination of the 
       * [publishPayloadType]{@link module:alfresco/header/SearchBox#publishPayloadType},
       * [publishPayloadModifiers]{@link module:alfresco/header/SearchBox#publishPayloadModifiers} and
       * [publishPayloadItemMixin]{@link module:alfresco/header/SearchBox#publishPayloadItemMixin} attributes.
       * 
       * @instance
       * @type {string}
       * @default
       */
      publishTopic: null,

      /**
       * This is an optional payload to publish when a results is clicked. This is only used when
       * [publishTopic]{@link module:alfresco/header/SearchBox#publishTopic} is configured to be a topic
       * string.
       * 
       * @instance
       * @type {object}
       * @default
       */
      publishPayload: null,

      /**
       * Indicates whether publications made when clicking on a result are published
       * globally or not
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      publishGlobal: false,

      /**
       * Indicates whether publications made when clicking on a result are published
       * on the parent pub/sub scope or not.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      publishToParent: false,

      /**
       * The type of payload to use when clicking on results. This can be set to one of 
       * "CONFIGURED", "CURRENT_ITEM", "PROCESS" or "BUILD" depending on how the payload
       * should be generated.
       * 
       * @instance
       * @type {object}
       * @default
       */
      publishPayloadType: null,

      /**
       * Modifiers to use when processing the payload published when clicking on a result.
       * This is only used when the [publishPayloadType]{@link module:alfresco/header/SearchBox#publishPayloadType}
       * is configured to be "PROCESS".
       * 
       * @instance
       * @type {string[]}
       * @default
       */
      publishPayloadModifiers: null,

      /**
       * Indicates whether or not to include the current item in the payload published when clicking on
       * a result. By default this is configured to be true so that the details of the result that has been
       * clicked on will be included in the payload.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      publishPayloadItemMixin: true,

      /**
       * @instance
       * @type {string}
       * @default
       */
      resultsCounts: null,

      /**
       * The title to use on the repository search toggle.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.78
       */
      repositoryTitle: "search.in-repository.tooltip",

      /**
       * The search results page to use. If this is left as the default of null then it is assumed that
       * the widget is being used within Alfresco Share and the standard search page or faceted search
       * page will be used (depending upon the configuration of 
       * [linkToFacetedSearch]{@link module:alfresco/header/SearchBox#linkToFacetedSearch}). Alternatively
       * this can be configured to be a custom page.
       *
       * @instance
       * @type {string}
       * @default
       */
      searchResultsPage: null,

      /**
       * @instance
       * @type {string}
       * @default
       */
      site: null,

      /**
       * True if the current site ID context should be passed to the document search API
       * 
       * @instance
       * @type {boolean}
       * @default false
       * @since 1.0.78
       */
      siteContext: false,

      /**
       * This is the page to navigate to for site home links. It defaults to 
       * "dashboard" (as this is the standard dashboard page in 
       * Alfresco Share) but it can be configured to go to a custom page. The page
       * will be prefixed with the standard site URI token mapping (e.g. site/<site>/)
       *
       * @instance
       * @type {string}
       * @default
       */
      sitePage: "dashboard",

      /**
       * The optional display name label for the current site.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.78
       */
      siteName: null,

      /**
       * The title to use on the site search toggle.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.78
       */
      siteTitle: "search.in-site.tooltip",

      /**
       * Indicates whether or not document results should be displayed in the live search pane.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      showDocumentResults: true,

      /**
       * Indicates whether or not people results should be displayed in the live search pane.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      showPeopleResults: true,

      /**
       * Indicates whether or not site results should be displayed in the live search pane.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      showSiteResults: true,

      /**
       * The title to use as above site results in the live search results panel.
       * 
       * @instance
       * @type {string}
       * @default
       */
      sitesTitle: "search.sites",

      /**
       * If this is overridden to be true then hitting the enter key will not trigger a redirect
       * to a search results page.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      suppressRedirect: false,

      /**
       * This is the width of the search input field (in pixels).
       * 
       * @instance
       * @type {integer}
       * @default
       */
      width: "180",

      /**
       * This is the page to navigate to for wiki page links. It defaults to 
       * "wiki-page" (as this is the standard Wiki page in 
       * Alfresco Share) but it can be configured to go to a custom page.
       *
       * @instance
       * @type {string}
       * @default
       */
      wikiPage: "wiki-page",

      /**
       * @instance
       */
      postMixInProperties: function alfresco_header_SearchBox__postMixInProperties() {
         // construct our I18N labels ready for template
         this.label = {};
         array.forEach(["clear"], lang.hitch(this, function(msg) {
            this.label[msg] = this.message("search." + msg);
         }));

         // Make sure that the inner width is a valid number...
         // Set the outer width (based on the requested inner width of the input field)...
         var w = parseInt(this.width, 10);
         if (isNaN(w))
         {
            this.width = "180";
            this._outerWidth = "250";
         }
         else
         {
            this._outerWidth = (w + 70) + "";
         }
      },

      /**
       * @instance
       */
      postCreate: function alfresco_header_SearchBox__postCreate() {

         this._requests = [];
         this.resultsCounts = {};
         
         domAttr.set(this._searchTextNode, "id", "HEADER_SEARCHBOX_FORM_FIELD");
         domAttr.set(this._searchTextNode, "placeholder", this.message(this.placeholder));
         
         on(this._searchTextNode, "keyup", lang.hitch(this, function(evt) {
            this.onSearchBoxKeyUp(evt);
         }));
         on(this._searchTextNode, "keydown", lang.hitch(this, function(evt) {
            this.onSearchBoxKeyDown(evt);
         }));
         // Paste event is called before the pasted value is applied to the source element - we use a setTimeout
         // to catch the value on the next time around the browser event loop. This is a little messy but works
         // consistently on all supported browsers.
         on(this._searchTextNode, "paste", lang.hitch(this, function() {
            setTimeout(lang.hitch(this, function() {
               this.onSearchBoxKeyUp({keyCode:0});
            }), 0);
         }));
         
         // construct the optional advanced search menu
         if (this.advancedSearch)
         {
            this._searchMenu = new AlfMenuBar({
               widgets: [
                  {
                     name: "alfresco/header/AlfMenuBarPopup",
                     config: {
                        id: this.id + "_DROPDOWN_MENU",
                        showArrow: false,
                        label: "",
                        iconSrc: require.toUrl("alfresco/header/css/images/search-16-gray.png"),
                        iconClass: "alf-search-icon",
                        widgets: [
                           {
                              name: "alfresco/menus/AlfMenuItem",
                              config: {
                                 id: this.id + "_ADVANCED_SEARCH",
                                 i18nScope: "org.alfresco.SearchBox",
                                 label: "search.advanced",
                                 targetUrl: (this.site ? "site/" + this.site + "/" : "") + "advsearch"
                              }
                           }
                        ]
                     }
                  }
               ]
            });
            this._searchMenu.placeAt(this._searchMenuNode);
            this._searchMenu.startup();
         }
         else
         {
            // When not including the advanced search menu, we'll just include an element that indicates
            // that indicates the control is still related to search. It's purely for decoration though.
            domConstruct.create("span", {
               "class": "alfresco-header-SearchBox-menu--hideAdvancedSearch"
            }, this._searchMenuNode);
         }

         if (this.liveSearch)
         {
            // construct the live search panel
            this._LiveSearch = new LiveSearch({
               searchBox: this,
               height: this.liveSearchHeight
            });

            if (this.alignment)
            {
               domClass.add(this._LiveSearch.domNode, this.alignment);
            }

            this._LiveSearch.placeAt(this._searchLiveNode);
            
            // event handlers to change the search context
            on(this._LiveSearch.contextRepositoryNode, "click", lang.hitch(this, function(evt) {
               // change context to repository
               domClass.add(this._LiveSearch.contextRepositoryNode, "alf-livesearch-context--active");
               domClass.remove(this._LiveSearch.contextSiteNode, "alf-livesearch-context--active");
               this.siteContext = false;
               this.lastSearchText = "";
               this.onSearchBoxKeyUp(evt);
               evt.preventDefault();
            }));
            on(this._LiveSearch.contextSiteNode, "click", lang.hitch(this, function(evt) {
               // change context to site
               domClass.add(this._LiveSearch.contextSiteNode, "alf-livesearch-context--active");
               domClass.remove(this._LiveSearch.contextRepositoryNode, "alf-livesearch-context--active");
               this.siteContext = true;
               this.lastSearchText = "";
               this.onSearchBoxKeyUp(evt);
               evt.preventDefault();
            }));

            // event handlers to hide/show the panel
            on(window, "click", lang.hitch(this, function() {
               domStyle.set(this._LiveSearch.containerNode, "display", "none");
            }));
            on(this._searchTextNode, "click", lang.hitch(this, function(evt) {
               this.updateResults();
               evt.stopPropagation();
            }));
            on(this._LiveSearch, "click", function(evt) {
               evt.stopPropagation();
            });
         }
         
         this.addAccessibilityLabel();
      },

      /**
       * This function is used to construct the search terms that are passed to a search service. The
       * terms provided by the user (e.g. the text that the user has typed) is parenthesized and concatonated
       * with any [hiddenSearchTerms]{@link module:alfresco/header/SearchBox#hiddenSearchTerms} so that the scope
       * of the user search request is not lost.
       * 
       * @instance
       * @since 1.0.31
       * @overrideable
       */
      generateSearchTerm: function alfresco_header_SearchBox__generateSearchTerm(terms) {
         var searchTerm = terms;
         if (this.hiddenSearchTerms)
         {
            searchTerm = "(" + terms + ") " + this.hiddenSearchTerms;
         }
         return encodeURIComponent(searchTerm);
      },

      /**
       * This function is called from the [onSearchBoxKeyUp function]{@link module:alfresco/header/SearchBox#onSearchBoxKeyUp}
       * when the enter key is pressed and will generate a link to either the faceted search page or the old search page
       * based on the value of [linkToFacetedSearch]{@link module:alfresco/header/SearchBox#linkToFacetedSearch}. This function
       * can also be overridden by extending modules to link to an entirely new search page.
       *
       * @instance
       * @param {string} terms The search terms to use
       * @returns {string} The URL for the search page.
       */
      generateSearchPageLink: function alfresco_header_SearchBox__generateSearchPageLink(terms) {
         var url;
         var scope = (this.siteContext === true && this.site) ? this.site : this.defaultSearchScope;
         if (this.searchResultsPage)
         {
            // Generate custom search page link...
            url = this.searchResultsPage + "#searchTerm=" + this.generateSearchTerm(terms) + "&scope=" + scope;
         }
         else if (this.linkToFacetedSearch === true)
         {
            // Generate faceted search page link...
            url = "dp/ws/faceted-search#searchTerm=" + this.generateSearchTerm(terms) + "&scope=" + scope;
         }
         else
         {
            // Generate old search page link...
            url = "search?t=" + this.generateSearchTerm(terms) + (this.allsites ? "&a=true&r=false" : "&a=false&r=true");
         }
         if (this.site)
         {
            url = "site/" + this.site + "/" + url;
         }
         this.alfLog("log", "Generated search page link", url, this);
         return url;
      },
      
      /**
       * Check if the web browser supports HTML5 local storage
       * 
       * @returns {boolean} true if local storage is available, false otherwise
       */
      _supportsLocalStorage : function alfresco_header_SearchBox__supportsLocalStorage() {
         try {
            return "localStorage" in window && window.localStorage !== null;
         }
         catch (e) {
            return false;
         }
      },
      
      /**
       * @instance
       */
      onSaveLastUserSearch: function alfresco_header_SearchBox__onSaveLastUserSearch() {
         var terms = lang.trim(this._searchTextNode.value);
         if (terms.length !== 0)
         {
            if (this._supportsLocalStorage())
            {
               var searches = JSON.parse(localStorage.getItem("ALF_SEARCHBOX_HISTORY")) || [];
               if (searches.length === 0 || searches[searches.length - 1] !== terms)
               {
                  searches.push(terms);
                  if (searches.length > 16)
                  {
                     searches = searches.slice(searches.length - 16);
                  }
                  localStorage.setItem("ALF_SEARCHBOX_HISTORY", JSON.stringify(searches));
               }
            }
         }
      },
      
      /**
       * Handles keydown events that occur on the <input> element. Used to page through last user searches
       * and ensure no other components handle the cursor key events.
       * 
       * @instance
       * @param {object} evt The keydown event
       */
      onSearchBoxKeyDown: function alfresco_header_SearchBox__onSearchBoxKeyDown(evt) {
         // jshint maxcomplexity:false
         var searches;
         switch (evt.keyCode)
         {
            // Ensure left/right arrow key events are handled only by this component
            case 37:
            case 39:
               evt && evt.stopPropagation();
               break;
            
            // Up Arrow press
            case 38:
               evt && evt.stopPropagation();
               if (this._supportsLocalStorage())
               {
                  searches = JSON.parse(localStorage.getItem("ALF_SEARCHBOX_HISTORY"));
                  if (searches)
                  {
                     if (this._lastSearchIndex === 0)
                     {
                        this._lastSearchIndex = searches.length - 1;
                     }
                     else
                     {
                        this._lastSearchIndex--;
                     }
                     this._searchTextNode.value = searches[this._lastSearchIndex];
                     this.onSearchBoxKeyUp(evt);
                  }
               }
               break;
            
            // Down Arrow press
            case 40:
               evt && evt.stopPropagation();
               if (this._supportsLocalStorage())
               {
                  searches = JSON.parse(localStorage.getItem("ALF_SEARCHBOX_HISTORY"));
                  if (searches)
                  {
                     if (this._lastSearchIndex === searches.length - 1)
                     {
                        this._lastSearchIndex = 0;
                     }
                     else
                     {
                        this._lastSearchIndex++;
                     }
                     this._searchTextNode.value = searches[this._lastSearchIndex];
                     this.onSearchBoxKeyUp(evt);
                  }
               }
               break;
         }
      },

      /**
       * Handles keyup events that occur on the <input> element used for capturing search terms.
       * @instance
       * @param {object} evt The keyup event
       */
      onSearchBoxKeyUp: function alfresco_header_SearchBox__onSearchBoxKeyUp(evt) {
         var terms = lang.trim(this._searchTextNode.value);
         switch (evt.keyCode)
         {
            // Enter key press
            case 13:
               if (terms.length !== 0 && this.suppressRedirect !== true)
               {
                  this.onSaveLastUserSearch();
                  // ACE-1798 - always close the live search drop-down on enter keypress..
                  this.clearResults();
                  this.alfLog("log", "Search request for: ", terms);
                  var url = this.generateSearchPageLink(terms);
                  this.alfPublish("ALF_NAVIGATE_TO_PAGE", { 
                     url: url,
                     type: urlTypes.PAGE_RELATIVE,
                     target: "CURRENT"
                  });
               }
               break;
            
            // Other key press
            default:
               if (this.liveSearch)
               {
                  if (terms.length >= this._minimumSearchLength && terms !== this.lastSearchText)
                  {
                     this.lastSearchText = terms;

                     // abort previous XHR requests to ensure we don't display results from a previous potentially slower query
                     for (var i=0; i<this._requests.length; i++)
                     {
                        this._requests[i].cancel();
                     }
                     this._requests = [];

                     // execute our live search queries in a few ms if user has not continued typing
                     if (this._timeoutHandle)
                     {
                        clearTimeout(this._timeoutHandle);
                     }
                     var _this = this;
                     this._timeoutHandle = setTimeout(function() {
                        if (_this.showDocumentResults)
                        {
                           _this.liveSearchDocuments(terms, 0);
                        }
                        if (_this.showSiteResults)
                        {
                           _this.liveSearchSites(terms, 0);
                        }
                        if (_this.showPeopleResults)
                        {
                           _this.liveSearchPeople(terms, 0);
                        }
                     }, this._keyRepeatWait);
                  }
               }
               if (terms.length === 0)
               {
                  this.clearResults();
               }
         }
      },
      
      /**
       * Creates a widget to render a single live search document result.
       * 
       * @instance
       * @param  {object} data The data to create the document rendering with
       * @return {object} An instance of LiveSearchItem
       * @since 1.0.37
       * @overridable
       */
      createLiveSearchDocument: function alfresco_header_SearchBox__createLiveSearchDocument(data) {
         return new LiveSearchItem(data);
      },
      
      /**
       * Process the live search item for a document and create the HTML entity representing it
       * 
       * @instance
       * @param  {object} item The data item to create the document entity from
       * @return {object} An instance of LiveSearchItem
       * @since 1.0.46
       * @overridable
       */
      processLiveSearchDocument: function alfresco_header_SearchBox__processLiveSearchDocument(item) {
         // construct the meta-data - site information, modified by and title description as tooltip
         var site = (item.site ? "site/" + item.site.shortName + "/" : "");
         var info = "";
         var siteDocLibUrl = urlUtils.convertUrl(site + this.documentLibraryPage, urlTypes.PAGE_RELATIVE);
         if (item.site)
         {
            info += "<a href='" + siteDocLibUrl + "'>" + this.encodeHTML(item.site.title) + "</a> | ";
         }
         info += this.formatFileSize(item.size);
         var info2 = "";
         var modifiedUserUrl = urlUtils.convertUrl("user/" + this.encodeHTML(item.modifiedBy) + "/" + this.peoplePage, urlTypes.PAGE_RELATIVE);
         info2 += this.getRelativeTime(item.modifiedOn) + " | ";
         info2 += "<a href='" + modifiedUserUrl + "'>" + this.encodeHTML(item.modifiedBy) + "</a>";
         
         var desc = item.title;
         if (item.description)
         {
            desc += (desc.length !== 0 ? "\r\n" : "") + item.description;
         }
         // build the widget for the item - including the thumbnail url for the document
         var link;
         switch (item.container)
         {
            case "wiki":
               link = this.wikiPage + "?title=" + encodeURIComponent(item.name);
               break;
            case "blog":
               link = this.blogPage + "?postId=" + encodeURIComponent(item.name);
               item.name = item.title;
               break;
            default:
               link = this.documentPage + "?nodeRef=" + item.nodeRef;
               break;
         }
         var lastModified = item.lastThumbnailModification || 1;
         return this.createLiveSearchDocument({
            searchBox: this,
            cssClass: "alf-livesearch-thumbnail",
            title: desc,
            label: item.name,
            link: urlUtils.convertUrl(site + link, urlTypes.PAGE_RELATIVE),
            icon: AlfConstants.PROXY_URI + "api/node/" + item.nodeRef.replace(":/", "") + "/content/thumbnails/doclib?c=queue&ph=true&lastModified=" + lastModified,
            alt: item.name,
            meta: info,
            meta2: info2,
            currentItem: lang.clone(item),
            publishTopic: this.publishTopic,
            publishPayload: this.publishPayload,
            publishGlobal: this.publishGlobal,
            publishToParent: this.publishToParent,
            publishPayloadType: this.publishPayloadType,
            publishPayloadItemMixin: this.publishPayloadItemMixin,
            publishPayloadModifiers: this.publishPayloadModifiers
         });
      },

      /**
       * @instance
       * @param {string} terms
       * @param {number} startIndex
       */
      liveSearchDocuments: function alfresco_header_SearchBox__liveSearchDocuments(terms, startIndex) {
         var url = AlfConstants.PROXY_URI + this.liveSearchDocumentsUri + "?t=" + this.generateSearchTerm(terms) +
                   "&maxResults=" + this._resultPageSize + "&startIndex=" + startIndex;
         if (this.siteContext === true && this.site) {
            url += "&s=" + encodeURIComponent(this.site);
         }
         this._requests.push(
            this.serviceXhr({
               url: url,
               method: "GET",
               successCallback: function(response) {
                  
                  if (startIndex === 0)
                  {
                     this._LiveSearch.containerNodeDocs.innerHTML = "";
                  }
                  
                  // construct each Document item as a LiveSearchItem widget
                  array.forEach(response.items, function(item) {
                     var itemLink = this.processLiveSearchDocument(item);
                     itemLink.placeAt(this._LiveSearch.containerNodeDocs);
                  }, this);
                  
                  // the more action is added if more results are potentially available
                  domStyle.set(this._LiveSearch.nodeDocsMore, "display", response.hasMoreRecords ? "block" : "none");
                  
                  // record the count of results
                  if (startIndex === 0)
                  {
                     this.resultsCounts.docs = 0;
                  }
                  this.resultsCounts.docs += response.items.length;
                  this.updateResults();
               },
               failureCallback: function() {
                  domStyle.set(this._LiveSearch.nodeDocsMore, "display", "none");
                  if (startIndex === 0)
                  {
                     this._LiveSearch.containerNodeDocs.innerHTML = "";
                     this.resultsCounts.docs = 0;
                  }
                  this.updateResults();
               },
               callbackScope: this
            }));
      },

      /**
       * Creates a widget to render a single live search site result.
       * 
       * @instance
       * @param  {object} data The data to create the site rendering with
       * @return {object} An instance of LiveSearchItem
       * @since 1.0.37
       * @overridable
       */
      createLiveSearchSite: function alfresco_header_SearchBox__createLiveSearchSite(data) {
         return new LiveSearchItem(data);
      },
      
      /**
       * Process the live search item for a site and create the HTML entity representing it
       * 
       * @instance
       * @param  {object} item The data item to create the site entity from
       * @return {object} An instance of LiveSearchItem
       * @since 1.0.46
       * @overridable
       */
      processLiveSearchSite: function alfresco_header_SearchBox__processLiveSearchSite(item) {
         var visibility = item.visibility;
         if (visibility)
         {
            visibility = this.message("site.visibility.label." + visibility);
         }
         return this.createLiveSearchSite({
            searchBox: this,
            cssClass: "alf-livesearch-icon",
            title: item.description,
            label: item.title,
            link: urlUtils.convertUrl("site/" + item.shortName + "/" + this.sitePage, urlTypes.PAGE_RELATIVE),
            icon: AlfConstants.URL_RESCONTEXT + "components/images/filetypes/generic-site-48.png",
            alt: item.title,
            meta: item.description ? this.encodeHTML(item.description) : "&nbsp;",
            meta2: visibility ? visibility : "&nbsp;",
            currentItem: lang.clone(item),
            publishTopic: this.publishTopic,
            publishPayload: this.publishPayload,
            publishGlobal: this.publishGlobal,
            publishToParent: this.publishToParent,
            publishPayloadType: this.publishPayloadType,
            publishPayloadItemMixin: this.publishPayloadItemMixin,
            publishPayloadModifiers: this.publishPayloadModifiers
         });
      },

      /**
       * @instance
       * @param {string} terms The search terms
       * @param {number} startIndex
       */
      liveSearchSites: function alfresco_header_SearchBox__liveSearchSites(terms, /*jshint unused:false*/ startIndex) {
         this._requests.push(
            this.serviceXhr({
               url: AlfConstants.PROXY_URI + this.liveSearchSitesUri + "?t=" + this.generateSearchTerm(terms) + "&maxResults=" + this._resultPageSize,
               method: "GET",
               successCallback: function(response) {
                  this._LiveSearch.containerNodeSites.innerHTML = "";
                  
                  // construct each Site item as a LiveSearchItem widget
                  array.forEach(response.items, function(item) {
                     var itemLink = this.processLiveSearchSite(item);
                     itemLink.placeAt(this._LiveSearch.containerNodeSites);
                  }, this);
                  this.resultsCounts.sites = response.items.length;
                  this.updateResults();
               },
               failureCallback: function() {
                  this._LiveSearch.containerNodeSites.innerHTML = "";
                  this.resultsCounts.sites = 0;
                  this.updateResults();
               },
               callbackScope: this
            }));
      },
      
      /**
       * Creates a widget to render a single live search person result.
       * 
       * @instance
       * @param  {object} data The data to create the person rendering with
       * @return {object} An instance of LiveSearchItem
       * @since 1.0.37
       * @overridable
       */
      createLiveSearchPerson: function alfresco_header_SearchBox__createLiveSearchPerson(data) {
         return new LiveSearchItem(data);
      },
      
      /**
       * Process the live search item for a person and create the HTML entity representing it
       * 
       * @instance
       * @param  {object} item The data item to create the person entity from
       * @return {object} An instance of LiveSearchItem
       * @since 1.0.46
       * @overridable
       */
      processLiveSearchPerson: function alfresco_header_SearchBox__processLiveSearchPerson(item) {
         var fullName = item.firstName + " " + item.lastName;
         var meta = (item.jobtitle || "") + (item.organization ? ((item.jobtitle ? ", " : "") + item.organization) : "");
         var meta2 = (item.email || "") + (item.location ? ((item.email ? ", " : "") + item.location) : "");
         return this.createLiveSearchPerson({
            searchBox: this,
            cssClass: "alf-livesearch-icon",
            title: item.jobtitle || "",
            label: fullName + " (" + item.userName + ")",
            link: urlUtils.convertUrl("user/" + encodeURIComponent(item.userName) + "/" + this.peoplePage, urlTypes.PAGE_RELATIVE),
            icon: AlfConstants.PROXY_URI + "slingshot/profile/avatar/" + encodeURIComponent(item.userName) + "/thumbnail/avatar",
            alt: fullName,
            meta: meta ? this.encodeHTML(meta) : "&nbsp;",
            meta2: meta2 ? this.encodeHTML(meta2) : "&nbsp;",
            currentItem: lang.clone(item),
            publishTopic: this.publishTopic,
            publishPayload: this.publishPayload,
            publishGlobal: this.publishGlobal,
            publishToParent: this.publishToParent,
            publishPayloadType: this.publishPayloadType,
            publishPayloadItemMixin: this.publishPayloadItemMixin,
            publishPayloadModifiers: this.publishPayloadModifiers
         });
      },

      /**
       * @instance
       * @param {string} terms The search terms
       * @param {number} startIndex
       */
      liveSearchPeople: function alfresco_header_SearchBox__liveSearchPeople(terms, /*jshint unused:false*/ startIndex) {
         this._requests.push(
            this.serviceXhr({
               url: AlfConstants.PROXY_URI + this.liveSearchPeopleUri + "?t=" + this.generateSearchTerm(terms) + "&maxResults=" + this._resultPageSize,
               method: "GET",
               successCallback: function(response) {
                  this._LiveSearch.containerNodePeople.innerHTML = "";
                  
                  // construct each Person item as a LiveSearchItem widget
                  array.forEach(response.items, function(item) {
                     var itemLink = this.processLiveSearchPerson(item);
                     itemLink.placeAt(this._LiveSearch.containerNodePeople);
                  }, this);
                  this.resultsCounts.people = response.items.length;
                  this.updateResults();
               },
               failureCallback: function() {
                  this._LiveSearch.containerNodePeople.innerHTML = "";
                  this.resultsCounts.people = 0;
                  this.updateResults();
               },
               callbackScope: this
            }));
      },

      /**
       * @instance
       */
      updateResults: function alfresco_header_SearchBox__showResults() {
         var anyResults = false;

         // Documents
         if (this.resultsCounts.docs > 0)
         {
            anyResults = true;
            domStyle.set(this._LiveSearch.titleNodeDocs, "display", "block");
            domStyle.set(this._LiveSearch.containerNodeDocs, "display", "block");
         }
         else
         {
            domStyle.set(this._LiveSearch.titleNodeDocs, "display", "none");
            domStyle.set(this._LiveSearch.containerNodeDocs, "display", "none");
         }

         // Sites
         if (this.resultsCounts.sites > 0)
         {
            anyResults = true;
            domStyle.set(this._LiveSearch.titleNodeSites, "display", "block");
            domStyle.set(this._LiveSearch.containerNodeSites, "display", "block");
         }
         else
         {
            domStyle.set(this._LiveSearch.titleNodeSites, "display", "none");
            domStyle.set(this._LiveSearch.containerNodeSites, "display", "none");
         }

         // People
         if (this.resultsCounts.people > 0)
         {
            anyResults = true;
            domStyle.set(this._LiveSearch.titleNodePeople, "display", "block");
            domStyle.set(this._LiveSearch.containerNodePeople, "display", "block");
         }
         else
         {
            domStyle.set(this._LiveSearch.titleNodePeople, "display", "none");
            domStyle.set(this._LiveSearch.containerNodePeople, "display", "none");
         }

         // Site Search options are displyed if a site local context search was last performed - this is to ensure
         // the user can select the 'Repository' option even if no results are present from the local site search
         var terms = lang.trim(this._searchTextNode.value);
         if (this.enableContextLiveSearch === true && this.siteContext === true && terms.length >= this._minimumSearchLength)
         {
            anyResults = true;
         }

         // Results pane
         if (anyResults)
         {
            domStyle.set(this._LiveSearch.containerNode, "display", "block");
         }
         else
         {
            domStyle.set(this._LiveSearch.containerNode, "display", "none");
         }
      },

      /**
       * @instance
       */
      clearResults: function alfresco_header_SearchBox__clearResults() {
         this._searchTextNode.value = "";
         if (this.liveSearch)
         {
            this.lastSearchText = "";

            for (var i=0; i<this._requests.length; i++)
            {
               this._requests[i].cancel();
            }
            this._requests = [];

            this.resultsCounts = {};
            this._LiveSearch.containerNodeDocs.innerHTML = "";
            this._LiveSearch.containerNodePeople.innerHTML = "";
            this._LiveSearch.containerNodeSites.innerHTML = "";

            domStyle.set(this._LiveSearch.nodeDocsMore, "display", "none");

            this.updateResults();
         }
         this._searchTextNode.focus();
      },

      /**
       * When the search box loads, add a label to support accessibility
       * 
       * @instance
       */
      addAccessibilityLabel: function alfresco_header_SearchBox__addAccessibilityLabel() {
         domConstruct.create("label", {
            "for": "HEADER_SEARCHBOX_FORM_FIELD",
            innerHTML: this.message(this.accessibilityInstruction),
            "class": "hidden"
         }, this._searchTextNode, "before");
      },

      /**
       * @instance
       * @param {object} evt The click event
       */
      onSearchClearClick: function alfresco_header_LiveSearch__onSearchClearClick(evt) {
         this.clearResults();
         evt.preventDefault();
      }
   });
});
